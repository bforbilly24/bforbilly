import dynamic from 'next/dynamic';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { PageLoading } from '@/components/atoms/page-loading';

const SignInSection = dynamic(() => import('@/components/organisms/sign-in-section').then(mod => ({ default: mod.SignInSection })), {
	ssr: true,
	loading: () => (
		<section className='flex h-[100dvh] items-center justify-center'>
			<PageLoading />
		</section>
	),
});

const title = 'sign in';
const description = 'Sign in to my portfolio website to access additional features and leave comments in the guest book.';
const url = PAGE_URLS.HOME;
const image = OG_IMAGES.ABOUT;

export const metadata = generateSEO(title, description, image, url);

export default function Page() {
	return <SignInSection />;
}
