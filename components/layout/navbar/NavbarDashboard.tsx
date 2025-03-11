import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import { NavLink } from './NavLink'

export function NavbarDashboard() {
  return (
    <NavLink
      href='/user/dashboard'
      extraActiveClass='text-primary bg-primary/30 rounded-md'
    >
      <Button
        variant='ghost'
        size='sm'
        className='relative flex items-center gap-2'
        aria-label='Dashboard'
      >
        <LayoutDashboard className='h-5 w-5' />
      </Button>
    </NavLink>
  )
}
