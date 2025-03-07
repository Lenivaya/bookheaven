// Server Component
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavLink } from './NavLink'
import { MobileNavigation } from './MobileNavigation'

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

            <nav className='hidden sm:flex items-center space-x-5'>
              <NavLink href='/books'>Books</NavLink>
              <NavLink href='/authors'>Authors</NavLink>
              <NavLink href='/tags'>Tags</NavLink>
            </nav>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-full transition-colors hover:bg-primary/10'
              asChild
            >
              <Link
                href='https://github.com/yourusername/bookheaven'
                target='_blank'
                rel='noreferrer'
                aria-label='GitHub'
              >
                <svg
                  viewBox='0 0 24 24'
                  className='h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'
                    fill='currentColor'
                  />
                </svg>
                <span className='sr-only'>GitHub</span>
              </Link>
            </Button>

            <MobileNavigation />
          </div>
        </div>
      </header>
    </div>
  )
}
