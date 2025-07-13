import dynamic from 'next/dynamic';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { PageLoading } from '@/components/atoms/page-loading';

const CodingActivitySection = dynamic(() => import('@/components/organisms/coding-activity-section').then(mod => ({ default: mod.CodingActivitySection })), {
	ssr: true,
	loading: () => (
		<section className='flex h-[100dvh] items-center justify-center'>
			<PageLoading />
		</section>
	),
});

const title = 'coding activity';
const description = 'Explore my coding activity and statistics. See what languages I use most frequently and track my development patterns over time.';
const url = PAGE_URLS.CODING_ACTIVITY;
const image = OG_IMAGES.CODING_ACTIVITY;

export const metadata = generateSEO(title, description, image, url);

export default function CodingActivity() {
	return <CodingActivitySection />;
}
