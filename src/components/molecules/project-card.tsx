import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/atoms/dialog'
import { Badge } from '@/components/atoms/badge'
import { buttonVariants } from '@/components/atoms/button'
import { Projects } from 'contentlayer/generated'

export const ProjectCard = ({ data }: { data: Projects }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <article className='rounded-md overflow-hidden group hover:shadow-2xl transition-shadow duration-500 border hover:shadow-secondary'>
          <figure className='relative aspect-video overflow-hidden'>
            <Image
              src={data.image}
              alt={data.title}
              blurDataURL={data.image}
              placeholder='blur'
              quality={75}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
              loading='lazy'
            />
            <div className='w-full h-full absolute z-30 flex items-center rounded-t justify-center bg-background/80 backdrop-blur-sm overflow-hidden group-hover:opacity-0 transition-opacity duration-500'>
              <p className='text-3xl italic font-semibold uppercase'>{data.title}</p>
            </div>
          </figure>

          <div className='p-3'>
            <p className='line-clamp-5 text-off-white text-left text-sm text-muted-foreground'>{data.summary}</p>
          </div>
        </article>
      </DialogTrigger>
      <DialogContent className='shadow-2xl shadow-secondary max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='mb-2'>{data.title}</DialogTitle>
          <DialogDescription>
            <figure className='relative aspect-video overflow-hidden rounded-md mb-5'>
              <Image src={data.image} alt={data.title} fill className='object-cover object-top group-hover:scale-105 transition-transform duration-500' />
            </figure>
            <div className='border-y py-3 mb-4'>
              <h4 className='text-foreground font-medium mb-2'>Technologies :</h4>
              <div className='flex flex-wrap gap-1.5'>
                {data.tag && data.tag.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <p className='whitespace-pre-line mt-2 text-left'>{data.summary}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href={`/projects/${data.title.toLowerCase()}`} className={buttonVariants({ variant: 'default' })}>
            Details
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const ProjectCardSkeleton = ({ delay }: { delay: number }) => {
  return (
    <div className='w-full h-full rounded bg-muted/20 border overflow-hidden'>
      <div className='aspect-video bg-muted/30 animate-pulse' style={{ animationDelay: `${delay * 0.1}s` }} />
      <div className='p-3 space-y-2.5'>
        {[...Array(4)].map((_, i) => (
          <div className='w-full h-4 bg-muted/30 rounded animate-pulse' key={i} style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}
