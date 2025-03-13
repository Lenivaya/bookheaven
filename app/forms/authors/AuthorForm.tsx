'use client'

import { UploadButton } from '@/app/api/uploadthing/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { GoBackButton } from '@/components/ui/go-back-button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Author, authorsInsertSchema } from '@/db/schema/books.schema'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type AuthorFormData = z.infer<typeof authorsInsertSchema>

interface AuthorFormProps {
  initialData?: Author
  onSubmit: (data: AuthorFormData) => Promise<Author>
}

export function AuthorForm({ initialData, onSubmit }: AuthorFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '')
  const [isAuthorCreated, setIsAuthorCreated] = useState(!!initialData)
  const [isUploading] = useState(false)
  const [createdAuthor, setCreatedAuthor] = useState<Author | null>(null)

  const form = useForm<AuthorFormData>({
    resolver: zodResolver(authorsInsertSchema),
    defaultValues: {
      name: initialData?.name || '',
      biography: initialData?.biography || '',
      birthDate: initialData?.birthDate || undefined,
      deathDate: initialData?.deathDate || undefined,
      photoUrl: initialData?.photoUrl || ''
    }
  })

  const handleSubmit = async (data: AuthorFormData) => {
    try {
      setIsLoading(true)

      // Submit the form and get the created/updated author
      const author = await onSubmit({
        ...data,
        photoUrl: photoUrl || data.photoUrl
      })

      setCreatedAuthor(author)
      setIsAuthorCreated(true)
      toast.success(
        initialData
          ? 'Author updated successfully'
          : 'Author created successfully. You can now upload a photo.'
      )
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-start'>
        <GoBackButton href='/admin/authors' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Author name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='biography'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Author biography'
                    className='min-h-[200px]'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='birthDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Birth Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='deathDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Death Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='photoUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <div className='flex flex-col gap-4'>
                    {photoUrl && (
                      <div className='flex justify-center'>
                        <div className='relative w-48 h-48'>
                          <Image
                            src={photoUrl}
                            alt='Author photo'
                            fill
                            className='rounded-lg object-cover'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                      </div>
                    )}
                    <div className='relative'>
                      <UploadButton
                        endpoint='authorImageUploader'
                        input={{
                          authorId: createdAuthor?.id || initialData?.id || ''
                        }}
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setPhotoUrl(res[0].ufsUrl)
                            field.onChange(res[0].ufsUrl)
                            toast.success('Photo uploaded successfully')
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`ERROR! ${error.message}`)
                        }}
                        disabled={
                          (!isAuthorCreated && !createdAuthor) || isUploading
                        }
                        className={cn(
                          'transition-all duration-200',
                          (!isAuthorCreated && !createdAuthor) || isUploading
                            ? 'opacity-50 pointer-events-none'
                            : ''
                        )}
                      />
                      {((!isAuthorCreated && !createdAuthor) ||
                        isUploading) && (
                        <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px] rounded-md'>
                          <p className='text-sm text-muted-foreground text-center px-4'>
                            {!isAuthorCreated && !createdAuthor
                              ? 'Please create the author first to upload their photo'
                              : 'Uploading photo...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isLoading || isUploading}>
            {isLoading || isUploading
              ? 'Saving...'
              : initialData
                ? 'Update Author'
                : 'Create Author'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
