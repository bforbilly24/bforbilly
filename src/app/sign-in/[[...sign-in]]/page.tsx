import dynamic from 'next/dynamic'
import { generateSEO } from '@/utils/seo'
import { PAGE_URLS, OG_IMAGES } from '@/types/environment'

// Dynamic import untuk komponen yang butuh client-side
const SignInSection = dynamic(() => import('@/components/organisms/sign-in-section').then(mod => ({ default: mod.SignInSection })), {
  ssr: true
})

const title = 'sign in'
const description = 'Sign in to my portfolio website to access additional features and leave comments in the guest book.'
const url = PAGE_URLS.HOME
const image = OG_IMAGES.ABOUT

export const metadata = generateSEO(title, description, image, url)
 
export default function Page() {
  return <SignInSection />;
}
