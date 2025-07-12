import { CodingActivitySidebar } from '@/components/organisms/coding-activity-sidebar';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { generateSEO } from '@/utils/seo';

const title = 'coding-activity';
const description = 'Dive into my coding activity page to discover insights into my work hours, coding time, preferred text editors, and the current programming languages in focus this week. Get a transparent glimpse into my coding routine, offering a quick snapshot of the tools and dedication that drive my passion for development.';
const url = PAGE_URLS.CODING_ACTIVITY;
const image = OG_IMAGES.CODING_ACTIVITY;

export const metadata = generateSEO(title, description, image, url);

export default function CodingActivityLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<CodingActivitySidebar />
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto p-5 md:col-span-9 md:h-auto lg:col-span-10'>{children}</section>
		</section>
	);
}
