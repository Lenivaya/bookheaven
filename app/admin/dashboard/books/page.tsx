import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AdminBooksPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Books</h2>
        <p className='text-muted-foreground'>
          Manage books catalog and inventory.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Books Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Book list and management tools will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
