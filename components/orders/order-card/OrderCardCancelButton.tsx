'use client'

import { cancelOrder } from '@/app/actions/orders.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function OrderCardCancelButton({ orderId }: { orderId: string }) {
  const handleCancelOrder = async () => {
    await cancelOrder(orderId)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
          <Trash2 className='h-4 w-4 mr-1' />
          Cancel order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to cancel this order?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Order will be cancelled and you will
            not be able to receive your books. Your funds will be refunded in up
            to 10 business days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelOrder}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Cancel order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
