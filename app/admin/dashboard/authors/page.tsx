import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AdminAuthorsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Authors</h2>
        <p className='text-muted-foreground'>
          Manage authors and their information.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Authors Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Author list and management tools will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
