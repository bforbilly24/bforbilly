import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { transformerCopyButton } from './src/lib/shiki-transformers.js';


/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
		type: 'string',
		resolve: doc => doc._raw.sourceFileName.replace(/\.mdx/, ''),
	},
};

/** @type {import('contentlayer/source-files').defineDocumentType} */
const About = defineDocumentType(() => ({
	name: 'About',
	filePathPattern: `about/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: { type: 'string', required: true },
		summary: { type: 'string', required: true },
	},
	computedFields,
}));

/** @type {import('contentlayer/source-files').defineDocumentType} */
const Projects = defineDocumentType(() => ({
	name: 'Projects',
	filePathPattern: `projects/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: { type: 'string', required: true },
		summary: { type: 'string', required: true },
		image: { type: 'string', required: true },
		category: {
			type: 'list',
			of: { type: 'string' },
			required: false,
		},
		technology: {
			type: 'list',
			of: { type: 'string' },
			required: false,
		},
		platform: {
			type: 'list',
			of: { type: 'string' },
			required: false,
		},
		tag: {
			type: 'list',
			of: { type: 'string' },
			required: true,
		},
	},
	computedFields,
}));

/** @type {import('contentlayer/source-files').defineDocumentType} */
const Articles = defineDocumentType(() => ({
	name: 'Articles',
	filePathPattern: `articles/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: { type: 'string', required: true },
		summary: { type: 'string', required: true },
		publishedDate: { type: 'string', required: true },
		tag: {
			type: 'list',
			of: { type: 'string' },
			required: true,
		},
	},
	computedFields: {
		...computedFields,
		headings: {
			type: 'json',
			resolve: async doc => {
				const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
				const headings = Array.from(doc.body.raw.matchAll(regXHeader)).map(({ groups }) => {
					const flag = groups?.flag;
					const content = groups?.content;
					let level = '';

					switch (flag?.length) {
						case 1:
							level = 'one';
							break;
						case 2:
							level = 'two';
							break;
						case 3:
							level = 'three';
							break;
						case 4:
							level = 'four';
							break;
						case 5:
							level = 'five';
							break;
						case 6:
							level = 'six';
							break;
						default:
							level = 'unknown';
					}

					return {
						level: level,
						text: content,
					};
				});

				return headings;
			},
		},
	},
}));

const rehypePrettyOptions = {
	theme: {
		dark: 'github-dark-dimmed',
		light: 'github-light',
	},
	keepBackground: false,
	defaultLang: 'plaintext',
	grid: false,
	transformers: [
		transformerCopyButton({
			copyButtonText: 'Copy',
			copiedText: 'Copied!',
			timeout: 2000,
			visibility: 'hover'
		})
	],
	onVisitLine(node) {
		// Prevent lines with no content from collapsing
		if (node.children.length === 0) {
			node.children = [{ type: 'text', value: ' ' }];
		}
	},
	onVisitHighlightedLine(node) {
		// Add class to highlighted lines
		if (!node.properties.className) {
			node.properties.className = [];
		}
		node.properties.className.push('highlighted');
	},
	onVisitHighlightedChars(node) {
		// Add class to highlighted chars
		if (!node.properties.className) {
			node.properties.className = [];
		}
		node.properties.className.push('highlighted-chars');
	},
};

// About pages without copy button
const rehypePrettyOptionsAbout = {
	theme: {
		dark: 'github-dark-dimmed',
		light: 'github-light',
	},
	keepBackground: false,
	defaultLang: 'plaintext',
	grid: false,
	transformers: [], // No copy button for about pages
	onVisitLine(node) {
		// Prevent lines with no content from collapsing
		if (node.children.length === 0) {
			node.children = [{ type: 'text', value: ' ' }];
		}
	},
	onVisitHighlightedLine(node) {
		// Add class to highlighted lines
		if (!node.properties.className) {
			node.properties.className = [];
		}
		node.properties.className.push('highlighted');
	},
	onVisitHighlightedChars(node) {
		// Add class to highlighted chars
		if (!node.properties.className) {
			node.properties.className = [];
		}
		node.properties.className.push('highlighted-chars');
	},
};

/** @type {import('contentlayer/source-files').SourcePlugin} */
export default makeSource({
	contentDirPath: './src/content',
	documentTypes: [About, Projects, Articles],
	mdx: {
		remarkPlugins: [
			// Temporarily disable remarkGfm to fix table parsing issues
			// [remarkGfm]
		],
		rehypePlugins: [
			rehypeSlug, 
			rehypeAutolinkHeadings, 
			[rehypePrettyCode, (vfile) => {
				// Check if this is an about page
				const isAboutPage = vfile.path && vfile.path.includes('/about/')
				
				if (isAboutPage) {
					return rehypePrettyOptionsAbout
				}
				return rehypePrettyOptions
			}]
		],
	},
});