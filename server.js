const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(async (req, res) => {
		try {
			const parsedUrl = parse(req.url, true);
			await handle(req, res, parsedUrl);
		} catch (err) {
			console.error('Error occurred handling', req.url, err);
			res.statusCode = 500;
			res.end('internal server error');
		}
	});

	const io = new Server(httpServer, {
		cors: {
			origin: dev ? 'http://localhost:3000' : ['https://bforbilly.tech', 'https://www.bforbilly.tech', 'https://bforbilly.tech', 'https://bforbilly.me', 'https://www.bforbilly.me', 'https://www.bforbilly.tech', 'https://bforbilly.vercel.app'],
			methods: ['GET', 'POST'],
			credentials: true,
		},
		path: '/socket.io/',
		transports: ['polling', 'websocket'],
		allowEIO3: true,
	});

	let onlineUsers = 0;
	let guestBookUsers = new Set();

	io.on('connection', socket => {
		onlineUsers++;
		console.log('👤 User connected:', socket.id, `(${onlineUsers} online)`);

		io.emit('online-count', onlineUsers);

		socket.on('guestbook:join-room', () => {
			socket.join('guestbook');
			guestBookUsers.add(socket.id);
			console.log('📝 User joined guest book room:', socket.id, `(${guestBookUsers.size} in guest book)`);

			io.to('guestbook').emit('guestbook:online-count', guestBookUsers.size);
		});

		socket.on('guestbook:leave-room', () => {
			socket.leave('guestbook');
			guestBookUsers.delete(socket.id);
			console.log('👋 User left guest book room:', socket.id, `(${guestBookUsers.size} in guest book)`);

			io.to('guestbook').emit('guestbook:online-count', guestBookUsers.size);
		});

		socket.on('disconnect', () => {
			onlineUsers--;
			guestBookUsers.delete(socket.id);
			console.log('👤 User disconnected:', socket.id, `(${onlineUsers} online, ${guestBookUsers.size} in guest book)`);

			io.emit('online-count', onlineUsers);
			io.to('guestbook').emit('guestbook:online-count', guestBookUsers.size);
		});
	});

	global.io = io;

	httpServer
		.once('error', err => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`🚀 Server ready on http://${hostname}:${port}`);
			console.log('✅ Socket.IO server started successfully');
		});
});
