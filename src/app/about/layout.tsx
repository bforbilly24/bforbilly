import { AboutSidebar } from '@/components/organisms/about-sidebar';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<AboutSidebar />
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto md:col-span-9 md:h-auto lg:col-span-10'>{children}</section>
		</section>
	);
}
