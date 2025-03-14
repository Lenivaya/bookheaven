'use client'

import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'

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
        'group flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200',
        'hover:bg-primary/10',
        isActive
          ? cn('bg-primary/15 text-primary shadow-sm', extraActiveClass)
          : 'text-muted-foreground hover:text-primary'
      )}
    >
      {children}
    </Link>
  )
}
