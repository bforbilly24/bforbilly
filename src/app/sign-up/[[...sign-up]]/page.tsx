import dynamic from 'next/dynamic'
import { generateSEO } from '@/utils/seo'
import { PAGE_URLS, OG_IMAGES } from '@/types/environment'

// Dynamic import untuk komponen yang butuh client-side
const SignUpSection = dynamic(() => import('@/components/organisms/sign-up-section').then(mod => ({ default: mod.SignUpSection })), {
  ssr: true
})

const title = 'sign up'
const description = 'Create an account on my portfolio website to access additional features and leave comments in the guest book.'
const url = PAGE_URLS.HOME
const image = OG_IMAGES.ABOUT

export const metadata = generateSEO(title, description, image, url)
 
export default function Page() {
  return <SignUpSection />;
}
