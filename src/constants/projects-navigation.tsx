import { RiReactjsLine, RiBootstrapFill } from 'react-icons/ri';
import { SiLaravel, SiCodeigniter, SiInertia, SiFastapi, SiElectron } from 'react-icons/si';
import { TbBrandNextjs, TbDeviceDesktop, TbDeviceMobile, TbBrain, TbServer, TbCloud } from 'react-icons/tb';
import { HiTerminal } from 'react-icons/hi';
import { MdWeb, MdPhoneIphone } from 'react-icons/md';
import type { ProjectsNavigationData } from '@/types/projects-navigation';

export const PROJECTS_NAVIGATION_DATA: ProjectsNavigationData = [
	{
		title: 'Categories',
		list: [
			{
				title: 'All Projects',
				href: '/projects',
				icon: <HiTerminal className='size-4' />,
			},
			{
				title: 'AI & ML',
				href: '/projects?category=' + encodeURIComponent('AI & ML'),
				icon: <TbBrain className='size-4' />,
			},
			{
				title: 'Frontend Development',
				href: '/projects?category=Frontend Development',
				icon: <TbDeviceDesktop className='size-4' />,
			},
			{
				title: 'Backend Development',
				href: '/projects?category=Backend Development',
				icon: <TbServer className='size-4' />,
			},
			{
				title: 'Mobile Development',
				href: '/projects?category=Mobile Development',
				icon: <TbDeviceMobile className='size-4' />,
			},
			{
				title: 'Desktop Development',
				href: '/projects?category=Desktop Development',
				icon: <TbCloud className='size-4' />,
			},
			{
				title: 'DevOps',
				href: '/projects?category=DevOps',
				icon: <TbServer className='size-4' />,
			},
		],
	},
	{
		title: 'Technologies',
		list: [
			{
				title: 'Next.js',
				href: '/projects?technology=Next.js',
				icon: <TbBrandNextjs className='size-4' />,
			},
			{
				title: 'React',
				href: '/projects?technology=React',
				icon: <RiReactjsLine className='size-4' />,
			},
			{
				title: 'Electron',
				href: '/projects?technology=Electron',
				icon: <SiElectron className='size-4' />,
			},
			{
				title: 'Laravel',
				href: '/projects?technology=Laravel',
				icon: <SiLaravel className='size-4' />,
			},
			{
				title: 'Inertia.js',
				href: '/projects?technology=Inertia.js',
				icon: <SiInertia className='size-4' />,
			},
			{
				title: 'FastAPI',
				href: '/projects?technology=FastAPI',
				icon: <SiFastapi className='size-4' />,
			},
			{
				title: 'CodeIgniter',
				href: '/projects?technology=CodeIgniter',
				icon: <SiCodeigniter className='size-4' />,
			},
			{
				title: 'Bootstrap',
				href: '/projects?technology=Bootstrap',
				icon: <RiBootstrapFill className='size-4' />,
			},
		],
	},
	{
		title: 'Platform',
		list: [
			{
				title: 'Web',
				href: '/projects?platform=Web',
				icon: <MdWeb className='size-4' />,
			},
			{
				title: 'Mobile',
				href: '/projects?platform=Mobile',
				icon: <MdPhoneIphone className='size-4' />,
			},
			{
				title: 'Desktop',
				href: '/projects?platform=Desktop',
				icon: <TbDeviceDesktop className='size-4' />,
			},
		],
	},
] as const;
