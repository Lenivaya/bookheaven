'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { fetchAndProcessBookByIsbn } from '@/app/actions/books.actions'
import { useRouter } from 'next/navigation'

export function IsbnSearchDialog() {
  const [isbn, setIsbn] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await fetchAndProcessBookByIsbn(isbn)

      if (result.status === 'error') {
        toast.error(result.message || 'Failed to fetch book')
        return
      }

      if (result.status === 'exists') {
        const confirmed = window.confirm(
          'This book already exists. Would you like to edit it?'
        )
        if (confirmed && result.data?.edition.id) {
          setIsOpen(false)
          router.push(`/forms/books/${result.data.edition.id}/edit`)
        }
        return
      }

      if (result.status === 'success' && result.data) {
        toast.success('Book found and imported successfully')
        setIsOpen(false)
        router.push(`/forms/books/${result.data.edition.id}/edit`)
      }
    } catch (error) {
      toast.error('Failed to process ISBN')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' type='button'>
          Search by ISBN
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Search by ISBN</DialogTitle>
          <DialogDescription>
            Enter an ISBN to automatically fill the book details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='isbn' className='text-right'>
              ISBN
            </Label>
            <Input
              id='isbn'
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className='col-span-3'
              placeholder='Enter ISBN-13'
            />
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
