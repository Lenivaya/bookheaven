'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className='flex sm:hidden items-center space-x-1'>
      <MobileNavLink href='/books' isActive={pathname.startsWith('/books')}>
        Books
      </MobileNavLink>
      <MobileNavLink href='/authors' isActive={pathname.startsWith('/authors')}>
        Authors
      </MobileNavLink>
      <MobileNavLink href='/tags' isActive={pathname.startsWith('/tags')}>
        Tags
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
