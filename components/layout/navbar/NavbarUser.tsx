import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookOpen, LogIn, UserPlus } from 'lucide-react'
import { NavbarDashboard } from './NavbarDashboard'

export function NavbarUser() {
  return (
    <header className='flex justify-end items-center gap-1.5 sm:gap-4 h-auto'>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 sm:h-auto sm:w-auto sm:px-3 text-primary hover:bg-secondary/80 hover:text-primary transition-colors duration-200'
          >
            <LogIn className='h-4 w-4 sm:hidden' />
            <span className='hidden sm:inline'>Sign in</span>
          </Button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <Button
            variant='default'
            size='icon'
            className='h-8 w-8 sm:h-auto sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200'
          >
            <UserPlus className='h-4 w-4 sm:hidden' />
            <BookOpen className='hidden sm:inline size-4' />
            <span className='hidden sm:inline'>Sign up</span>
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className='hidden h-5 w-[1px] bg-border/40 sm:block' />
        <NavbarDashboard />
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox:
                'border-2 border-primary/20 hover:border-primary/50 transition-colors duration-200',
              userButtonTrigger:
                'focus:shadow-md hover:shadow-sm transition-shadow duration-200'
            }
          }}
        />
      </SignedIn>
    </header>
  )
}
