'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookIcon, PackageIcon, UsersIcon } from 'lucide-react'

const adminNavItems = [
  {
    title: 'Overview',
    href: '/admin/dashboard',
    icon: BookIcon
  },
  {
    title: 'User Orders',
    href: '/admin/dashboard/orders',
    icon: PackageIcon
  },
  {
    title: 'Authors',
    href: '/admin/dashboard/authors',
    icon: UsersIcon
  },
  {
    title: 'Books',
    href: '/admin/dashboard/books',
    icon: BookIcon
  }
]

interface AdminDashboardNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminDashboardNavigation({
  className,
  ...props
}: AdminDashboardNavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            pathname === item.href ? 'bg-accent' : 'transparent'
          )}
        >
          <item.icon className='mr-2 h-4 w-4' />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
