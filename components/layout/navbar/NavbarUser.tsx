import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import { NavbarDashboard } from './NavbarDashboard'

export function NavbarUser() {
  return (
    <header className='flex justify-end items-center p-4 gap-4 h-16'>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button
            variant='ghost'
            size='sm'
            className='text-primary hover:bg-secondary/80 hover:text-primary transition-colors duration-200'
          >
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <Button
            variant='default'
            size='sm'
            className='flex items-center gap-1.5 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200'
          >
            <BookOpen className='size-4' />
            Sign up
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
