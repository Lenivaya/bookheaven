import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { MobileNavigation } from './MobileNavigation'
import { NavbarCart } from './NavbarCart'
import { NavbarUser } from './NavbarUser'
import { NavLink } from './NavLink'
import { BookOpen, Users, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  return (
    <div className='fixed top-0 z-40 flex w-full justify-center pt-4 sm:pt-6 md:pt-10'>
      <header className='w-[95%] rounded-full border border-border/40 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 md:w-[90%] lg:w-[80%] xl:w-[60%]'>
        <div className='flex h-12 items-center justify-between px-3 sm:px-6'>
          <div className='flex items-center gap-3 sm:gap-6'>
            <Link
              href='/'
              className='flex items-center gap-2 transition-opacity hover:opacity-80'
            >
              <span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-base font-bold text-transparent'>
                BookHeaven
              </span>
              <span className='text-muted-foreground'>📚🌿</span>
            </Link>

            <div className='hidden h-5 w-[1px] bg-border/40 sm:block' />

            <nav className='hidden sm:flex items-center space-x-1.5'>
              <NavLink href='/books'>
                <BookOpen
                  size={16}
                  className={cn(
                    'transition-all duration-200',
                    'text-muted-foreground group-hover:text-primary',
                    'group-[:has([aria-current])]:text-primary'
                  )}
                />
                <span>Books</span>
              </NavLink>
              <NavLink href='/authors'>
                <Users
                  size={16}
                  className={cn(
                    'transition-all duration-200',
                    'text-muted-foreground group-hover:text-primary',
                    'group-[:has([aria-current])]:text-primary'
                  )}
                />
                <span>Authors</span>
              </NavLink>
              <NavLink href='/book-shelves'>
                <Library
                  size={16}
                  className={cn(
                    'transition-all duration-200',
                    'text-muted-foreground group-hover:text-primary',
                    'group-[:has([aria-current])]:text-primary'
                  )}
                />
                <span>Shelves</span>
              </NavLink>
            </nav>
          </div>

          <div className='flex items-center gap-2'>
            <NavbarCart />
            <Separator orientation='vertical' className='h-full' />
            <NavbarUser />
            <MobileNavigation />
          </div>
        </div>
      </header>
    </div>
  )
}
