import { FadeIn } from '@/components/atoms/fade-in';
import { GuestBookSidebar } from '@/components/organisms/guest-book-sidebar';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { generateSEO } from '@/utils/seo';

const title = 'guest-book';
const description =
	'Leave a lasting imprint on my digital canvas! Sign in and share your thoughts, greetings, or anecdotes on my guest-book page. Your messages contribute to the heart and soul of my online community. Connect with us through your words and be a part of the vibrant conversations happening on my website. Your messages matter, so take a moment to make your mark and be heard!';
const url = PAGE_URLS.GUEST_BOOK;
const image = OG_IMAGES.GUEST_BOOK;

export const metadata = generateSEO(title, description, image, url);

export default async function GuestBookLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<GuestBookSidebar />
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto md:col-span-9 md:h-auto lg:col-span-10'>
				<FadeIn className='h-full'>
					{children}
				</FadeIn>
			</section>
		</section>
	);
}
