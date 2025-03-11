'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  extraActiveClass?: string
}

export function NavLink({ href, children, extraActiveClass }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        isActive
          ? cn('text-primary', extraActiveClass)
          : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
