'use client'

import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpenIcon, Users, Library, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

export function MobileNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the navigation when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className='sm:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-10 w-10 rounded-full hover:bg-primary/10 transition-colors'
            aria-label='Open navigation menu'
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='right'
          className='w-[280px] border-l border-border bg-background/95 backdrop-blur-sm p-0'
        >
          <div className='flex flex-col h-full'>
            <SheetHeader className='p-4 border-b border-border/30'>
              <SheetTitle className='text-xl font-bold'>Navigation</SheetTitle>
            </SheetHeader>

            <nav className='flex flex-col p-4 space-y-1'>
              <MobileNavLink
                href='/books'
                isActive={pathname.startsWith('/books')}
                onClick={() => setOpen(false)}
              >
                <BookOpenIcon size={20} />
                <span>Books</span>
              </MobileNavLink>
              <MobileNavLink
                href='/authors'
                isActive={pathname.startsWith('/authors')}
                onClick={() => setOpen(false)}
              >
                <Users size={20} />
                <span>Authors</span>
              </MobileNavLink>
              <MobileNavLink
                href='/book-shelves'
                isActive={pathname.startsWith('/book-shelves')}
                onClick={() => setOpen(false)}
              >
                <Library size={20} />
                <span>Shelves</span>
              </MobileNavLink>
            </nav>

            <div className='mt-auto p-4 border-t border-border/30 text-center'>
              <p className='text-xs text-muted-foreground'>
                © {new Date().getFullYear()} BookHeaven
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MobileNavLink({
  href,
  isActive,
  children,
  onClick
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      size='lg'
      className={cn(
        'flex flex-col items-center justify-center h-24 w-full rounded-xl relative',
        isActive
          ? 'bg-primary/10 text-primary font-medium shadow-sm'
          : 'hover:bg-primary/5 text-muted-foreground font-normal'
      )}
      asChild
    >
      <Link
        href={href}
        className='flex flex-col items-center gap-2 transition-colors duration-200'
        onClick={onClick}
      >
        {isActive && (
          <span className='absolute top-0 right-0 w-1.5 h-full bg-primary rounded-l-full' />
        )}
        {children}
      </Link>
    </Button>
  )
}
