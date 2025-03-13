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
import { useState } from 'react'

export function MobileNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className='sm:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <Menu size={18} />
            <span className='sr-only'>Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[250px] sm:w-[300px]'>
          <SheetHeader className='mb-4'>
            <SheetTitle className='text-left'>Navigation</SheetTitle>
          </SheetHeader>
          <nav className='flex flex-col space-y-3'>
            <MobileNavLink
              href='/books'
              isActive={pathname.startsWith('/books')}
              onClick={() => setOpen(false)}
            >
              <BookOpenIcon size={16} className='mr-2' />
              Books
            </MobileNavLink>
            <MobileNavLink
              href='/authors'
              isActive={pathname.startsWith('/authors')}
              onClick={() => setOpen(false)}
            >
              <Users size={16} className='mr-2' />
              Authors
            </MobileNavLink>
            <MobileNavLink
              href='/book-shelves'
              isActive={pathname.startsWith('/book-shelves')}
              onClick={() => setOpen(false)}
            >
              <Library size={16} className='mr-2' />
              Shelves
            </MobileNavLink>
          </nav>
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
      variant='ghost'
      size='sm'
      className='justify-start px-2 h-10 w-full'
      asChild
    >
      <Link
        href={href}
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
        onClick={onClick}
      >
        {children}
      </Link>
    </Button>
  )
}
