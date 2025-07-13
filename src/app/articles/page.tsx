import dynamic from 'next/dynamic';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { PageLoading } from '@/components/atoms/page-loading';

const ArticlesSection = dynamic(() => import('@/components/organisms/articles-section').then(mod => ({ default: mod.ArticlesSection })), {
	ssr: true,
	loading: () => (
		<section className='flex h-[100dvh] items-center justify-center'>
			<PageLoading />
		</section>
	),
});

type SearchParamsProps = {
	searchParams: {
		tag: string;
	};
};

const title = 'articles';
const description =
	"Embark on a journey through a diverse collection of articles, ranging from React deep-dives to engaging non-technical discussions. Whether you're exploring the entire repository or seeking insights on a specific tag, our articles cover a spectrum of topics to cater to both technical enthusiasts and those looking for non-technical perspectives. Discover thought-provoking content and immerse yourself in the world of insights and ideas.";
const url = PAGE_URLS.ARTICLES;
const image = OG_IMAGES.ARTICLES;

export const metadata = generateSEO(title, description, image, url);

export default function Articles({ searchParams }: SearchParamsProps) {
	return <ArticlesSection searchParams={searchParams} />;
}
