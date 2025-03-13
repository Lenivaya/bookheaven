import { AdminDashboardNavigation } from '@/app/components/admin/dashboard/dashboard-navigation/AdminDashboardNavigation'
import { Separator } from '@/components/ui/separator'

export default function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='container mx-auto px-4 py-8 mt-16 md:mt-24 max-w-7xl'>
      <h1 className='text-3xl font-bold tracking-tight mb-6'>
        Admin Dashboard
      </h1>

      <div className='flex flex-col md:flex-row gap-8'>
        <aside className='md:w-64 shrink-0'>
          <AdminDashboardNavigation className='sticky top-24' />
        </aside>

        <Separator className='md:hidden' />

        <div className='md:hidden h-4' />

        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </div>
  )
}
