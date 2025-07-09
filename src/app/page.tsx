import dynamic from 'next/dynamic';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';

// Dynamic import untuk komponen yang butuh client-side
const HomepageSection = dynamic(() => import('@/components/organisms/homepage-section').then(mod => ({ default: mod.HomepageSection })), {
  ssr: false // Karena menggunakan sessionStorage
})

const title = 'Halim Putra - Frontend Developer';
const description = 'Frontend developer specializing in modern web technologies. Visit my portfolio to see my latest projects and articles.';
const url = PAGE_URLS.HOME;
const image = OG_IMAGES.ABOUT;

export const metadata = generateSEO(title, description, image, url);

export default function Home() {
  return <HomepageSection />;
}
