import { Suspense } from 'react';
import { ProjectsSidebar } from '@/components/organisms/projects-sidebar';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { generateSEO } from '@/utils/seo';
import { PageLoading } from '@/components/atoms/page-loading';

const title = 'projects';
const description = 'Discover the interactive brilliance of my projects, peruse my polished portfolio, and delve into a sneak peek of my formidable technical prowess. Uncover a world where innovation meets functionality, showcased through a meticulously crafted Next.js application. Elevate your digital experience with a seamless blend of creativity and technical finesse.';
const url = PAGE_URLS.PROJECTS;
const image = OG_IMAGES.PROJECTS;

export const metadata = generateSEO(title, description, image, url);

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<ProjectsSidebar />
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto scroll-smooth md:col-span-9 md:h-auto lg:col-span-10'>
				<Suspense fallback={
					<div className='flex h-full flex-1 items-center justify-center'>
						<PageLoading />
					</div>
				}>
					{children}
				</Suspense>
			</section>
		</section>
	);
}
