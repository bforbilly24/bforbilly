import dynamic from 'next/dynamic';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';

// Dynamic import untuk komponen yang butuh client-side
const CodingActivitySection = dynamic(() => import('@/components/organisms/coding-activity-section').then(mod => ({ default: mod.CodingActivitySection })), {
  ssr: true
})

const title = 'coding activity';
const description = 'Explore my coding activity and statistics. See what languages I use most frequently and track my development patterns over time.';
const url = PAGE_URLS.CODING_ACTIVITY;
const image = OG_IMAGES.CODING_ACTIVITY;

export const metadata = generateSEO(title, description, image, url);

export default function CodingActivity() {
	return <CodingActivitySection />;
}
