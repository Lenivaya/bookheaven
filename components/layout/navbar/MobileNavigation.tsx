'use client'

import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpenIcon, Users, Library } from 'lucide-react'

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className='flex sm:hidden items-center space-x-1'>
      <MobileNavLink href='/books' isActive={pathname.startsWith('/books')}>
        <BookOpenIcon size={16} />
        Books
      </MobileNavLink>
      <MobileNavLink href='/authors' isActive={pathname.startsWith('/authors')}>
        <Users size={16} />
        Authors
      </MobileNavLink>
      <MobileNavLink href='/tags' isActive={pathname.startsWith('/tags')}>
        <Library size={16} />
        Shelves
      </MobileNavLink>
    </nav>
  )
}

function MobileNavLink({
  href,
  isActive,
  children
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
}) {
  return (
    <Button variant='ghost' size='sm' className='px-2 h-8' asChild>
      <Link
        href={href}
        className={cn(
          'text-xs font-medium',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {children}
      </Link>
    </Button>
  )
}
