import { 
  SignedIn, 
  SignedOut
} from '@clerk/nextjs';
import { CommentPreview } from '@/components/molecules/comment-preview';
import { FadeInStagger } from '@/components/atoms/fade-in';
import { GuestBookChat } from '@/components/molecules/guest-book-chat';
import { generateSEO } from '@/utils/seo';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';

const title = 'guest book';
const description = 'Leave a message in my guest book. Share your thoughts, feedback, or just say hello. Join the conversation!';
const url = PAGE_URLS.GUEST_BOOK;
const image = OG_IMAGES.GUEST_BOOK;

export const metadata = generateSEO(title, description, image, url);

export default function GuestBooks() {
  return (
    <FadeInStagger className='p-5 space-y-6 min-h-screen' faster>
      <SignedOut>
        <CommentPreview />
      </SignedOut>
      <SignedIn>
        <aside className='space-y-6 pb-20 md:pb-6'>
          <GuestBookChat />
        </aside>
      </SignedIn>
    </FadeInStagger>
  );
}
