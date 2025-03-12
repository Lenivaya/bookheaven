import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { DialogTitle } from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

export function ZoomableImage({
  src,
  alt,
  className,
  children
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  children: React.ReactNode
}) {
  if (!src) return null
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>{alt}</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className='max-w-7xl border-0 bg-transparent p-0  [&>button]:hidden'>
        <div
          className={cn(
            'relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md',
            className
          )}
        >
          <Image
            src={src}
            fill
            alt={alt || ''}
            className='h-full w-full object-contain'
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
