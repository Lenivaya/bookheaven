'use client'

import { createCheckoutSessionForBookEditions } from '@/app/actions/payments.actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
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
import { isNone } from '@/lib/types'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Minus, Plus, ShoppingCart, X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'

export function ShoppingCartSheet({ children }: { children: React.ReactNode }) {
  const {
    cartCount = 0,
    cartDetails,
    removeItem,
    incrementItem,
    decrementItem,
    redirectToCheckout,
    formattedTotalPrice,
    clearCart
  } = useShoppingCart()

  async function handleCheckoutClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault()

    if (cartCount === 0) {
      toast.error('Your cart is empty')
      return
    }
    if (isNone(cartDetails)) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const checkoutSessionId =
        await createCheckoutSessionForBookEditions(cartDetails)

      const result = await redirectToCheckout(checkoutSessionId)
      if (result?.error) {
        toast.error('Checkout failed. Please try again.')
        console.error('Checkout error:', result.error)
        return
      }
      clearCart()
    } catch (err) {
      toast.error('Checkout failed. Please try again.')
      console.error('Checkout error:', err)
    }
  }

  function handleQuantityChange(id: string, action: 'increment' | 'decrement') {
    if (action === 'increment') {
      incrementItem(id)
    } else {
      const item = cartDetails?.[id]
      if (item?.quantity === 1) {
        removeItem(id)
      } else {
        decrementItem(id)
      }
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='w-full max-w-xl md:max-w-2xl p-0'>
        <div className='h-full flex flex-col'>
          <SheetHeader className='p-6 pb-2'>
            <SheetTitle className='flex items-center gap-2 text-xl'>
              <ShoppingCart className='h-5 w-5' />
              Your Cart {cartCount > 0 && `(${cartCount})`}
            </SheetTitle>
            <Separator className='mt-4' />
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            {cartCount === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-3 py-10'>
                <ShoppingCart className='h-16 w-16 text-muted-foreground/40' />
                <h3 className='text-xl font-medium'>Your cart is empty</h3>
                <p className='text-sm text-muted-foreground'>
                  Add items to your cart to see them here
                </p>
              </div>
            ) : (
              <ul className='divide-y divide-border py-4'>
                {Object.values(cartDetails ?? {}).map((item) => (
                  <li key={item.id} className='py-6 first:pt-0 last:pb-0'>
                    <div className='flex items-start gap-5'>
                      <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted'>
                        {item.image && (
                          <Image
                            src={item.image as string}
                            alt={item.name}
                            width={100}
                            height={100}
                            className='h-full w-full object-cover object-center'
                          />
                        )}
                      </div>

                      <div className='flex flex-1 flex-col'>
                        <div className='flex justify-between'>
                          <Link href={`/books/${item.id}`}>
                            <h3 className='text-base font-medium'>
                              {item.name}
                            </h3>
                          </Link>
                          <p className='text-base font-medium ml-4'>
                            {item.formattedValue}
                          </p>
                        </div>

                        {item.description && (
                          <p className='mt-1.5 text-sm text-muted-foreground line-clamp-2'>
                            {item.description}
                          </p>
                        )}

                        <div className='mt-auto flex items-center justify-between pt-4'>
                          <div className='flex items-center rounded-md border'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 rounded-none rounded-l-md'
                              onClick={() =>
                                handleQuantityChange(item.id, 'decrement')
                              }
                              aria-label='Decrease quantity'
                            >
                              <Minus className='h-3.5 w-3.5' />
                            </Button>
                            <span className='flex h-8 min-w-8 items-center justify-center px-2 text-sm font-medium'>
                              {item.quantity}
                            </span>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 rounded-none rounded-r-md'
                              onClick={() =>
                                handleQuantityChange(item.id, 'increment')
                              }
                              aria-label='Increase quantity'
                            >
                              <Plus className='h-3.5 w-3.5' />
                            </Button>
                          </div>

                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-2 text-sm text-muted-foreground hover:text-foreground'
                            onClick={() => removeItem(item.id)}
                          >
                            <X className='mr-1.5 h-3.5 w-3.5' />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='border-t border-border mt-auto'>
            <div className='p-6 space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Subtotal</span>
                  <span className='font-medium'>
                    {formattedTotalPrice || '$0.00'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Shipping
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <SheetFooter className='flex-col gap-2 sm:flex-col mt-4'>
                {cartCount > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full text-muted-foreground hover:text-destructive border'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Clear Cart
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Shopping Cart</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove all items from your
                          cart? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => clearCart()}
                          className='bg-destructive hover:bg-destructive/90'
                        >
                          Clear Cart
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <SignedIn>
                  <Button
                    onClick={handleCheckoutClick}
                    className='w-full'
                    disabled={cartCount === 0}
                    size='lg'
                  >
                    Checkout
                  </Button>
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <Button className='w-full' size='lg'>
                      Sign in to checkout
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SheetTrigger asChild>
                  <Button variant='outline' className='w-full' size='lg'>
                    Continue Shopping
                  </Button>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
