import { ArticleDetailSidebar } from '@/components/organisms/article-detail-sidebar';

export default async function ArticleDetailLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<ArticleDetailSidebar slug={params.slug} />
			<section className='relative col-span-12 h-[80dvh] overflow-y-auto scroll-smooth md:col-span-9 md:h-auto lg:col-span-10'>{children}</section>
		</section>
	);
}
