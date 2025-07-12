import { 
  SignedIn, 
  SignedOut
} from '@clerk/nextjs';
import { GuestBookCommentPreview } from '@/components/molecules/guest-book';
import { FadeInStagger } from '@/components/atoms/fade-in';
import { GuestBookChat } from '@/components/molecules/guest-book';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';

const title = 'guest book';
const description = 'Leave a message in my guest book. Share your thoughts, feedback, or just say hello. Join the conversation!';
const url = PAGE_URLS.GUEST_BOOK;
const image = OG_IMAGES.GUEST_BOOK;

export const metadata = generateSEO(title, description, image, url);

export default function GuestBooks() {
  return (
    <FadeInStagger className='p-5 space-y-6' faster>
      <SignedOut>
        <GuestBookCommentPreview />
      </SignedOut>
      <SignedIn>
        <aside className='space-y-6'>
          <GuestBookChat />
        </aside>
      </SignedIn>
    </FadeInStagger>
  );
}
