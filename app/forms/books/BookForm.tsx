'use client'

import { UploadButton } from '@/app/api/uploadthing/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Author, BookEdition, BookWork, Tag } from '@/db/schema/books.schema'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { MoneyInput } from '@/components/ui/money-input'

// Combine both schemas for the full book form
const bookFormSchema = z.object({
  // BookWork fields
  title: z.string().min(1, 'Title is required'),
  originalTitle: z.string().nullable(),
  description: z.string().nullable(),
  writingCompletedAt: z.date().nullable(),
  originalLanguage: z.string().min(1, 'Original language is required'),

  // BookEdition fields
  isbn: z.string().nullable(),
  publisher: z.string().nullable(),
  publishedAt: z.date().nullable(),
  language: z.string().min(1, 'Language is required'),
  pageCount: z.number().int().positive().nullable(),
  format: z.string().min(1, 'Format is required'),
  edition: z.string().nullable(),
  price: z.number().positive().nullable(),
  thumbnailUrl: z.string().nullable(),

  // Relations
  authorIds: z.array(z.string()).min(1, 'At least one author is required'),
  tagIds: z.array(z.string())
})

type BookFormData = z.infer<typeof bookFormSchema>

interface BookFormProps {
  initialData?: {
    work: BookWork
    edition: BookEdition
    authors: Author[]
    tags: Tag[]
  }
  availableAuthors: Author[]
  availableTags: Tag[]
  onSubmit: (
    data: BookFormData
  ) => Promise<{ work: BookWork; edition: BookEdition }>
}

const FORMATS = ['hardcover', 'paperback', 'ebook', 'audiobook'] as const
const LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'ru', 'zh', 'ja'] as const

export function BookForm({
  initialData,
  availableAuthors,
  availableTags,
  onSubmit
}: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialData?.edition.thumbnailUrl || null
  )
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(
    initialData?.authors || []
  )
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialData?.tags || []
  )
  const [createdEditionId, setCreatedEditionId] = useState<string | null>(
    initialData?.edition.id || null
  )

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      // BookWork defaults
      title: initialData?.work.title || '',
      originalTitle: initialData?.work.originalTitle || null,
      description: initialData?.work.description || null,
      writingCompletedAt: initialData?.work.writingCompletedAt || null,
      originalLanguage: initialData?.work.originalLanguage || 'en',

      // BookEdition defaults
      isbn: initialData?.edition.isbn || null,
      publisher: initialData?.edition.publisher || null,
      publishedAt: initialData?.edition.publishedAt || null,
      language: initialData?.edition.language || 'en',
      pageCount: initialData?.edition.pageCount || null,
      format: initialData?.edition.format || 'paperback',
      edition: initialData?.edition.edition || null,
      price:
        typeof initialData?.edition.price === 'string'
          ? parseFloat(initialData.edition.price)
          : initialData?.edition.price || null,
      thumbnailUrl: initialData?.edition.thumbnailUrl || null,

      // Relations
      authorIds: initialData?.authors.map((a) => a.id) || [],
      tagIds: initialData?.tags.map((t) => t.id) || []
    }
  })

  const handleSubmit = async (data: BookFormData) => {
    try {
      setIsLoading(true)
      const result = await onSubmit({
        ...data,
        thumbnailUrl: thumbnailUrl || null,
        pageCount:
          typeof data.pageCount === 'string'
            ? parseInt(data.pageCount, 10)
            : data.pageCount,
        price:
          typeof data.price === 'string' ? parseFloat(data.price) : data.price
      })
      setCreatedEditionId(result.edition.id)
      toast.success(
        initialData ? 'Book updated successfully' : 'Book created successfully'
      )
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-8'>
      <div className='flex justify-start'>
        <GoBackButton href='/admin/books' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Book Work Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-2 border-b'>
                <h3 className='text-lg font-semibold text-primary'>
                  Book Information
                </h3>
                <div className='h-px flex-1 bg-border/60' />
              </div>

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Book title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='originalTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Title</FormLabel>
                    <FormDescription>
                      If this is a translation, enter the original title
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder='Original title'
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Book description'
                        className='min-h-[200px]'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='writingCompletedAt'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Writing Completed Date</FormLabel>
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
                          disabled={(date) => date > new Date()}
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
                name='originalLanguage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select language' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='authorIds'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authors</FormLabel>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedAuthors.map((author) => (
                        <Badge key={author.id} variant='secondary'>
                          {author.name}
                          <button
                            type='button'
                            className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                            onClick={() => {
                              setSelectedAuthors(
                                selectedAuthors.filter(
                                  (a) => a.id !== author.id
                                )
                              )
                              field.onChange(
                                field.value.filter((id) => id !== author.id)
                              )
                            }}
                          >
                            <X className='h-3 w-3' />
                            <span className='sr-only'>
                              Remove {author.name}
                            </span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormControl>
                      <div className='border rounded-md'>
                        <Command>
                          <CommandInput placeholder='Search authors...' />
                          <CommandList>
                            <CommandEmpty>No authors found.</CommandEmpty>
                            <CommandGroup>
                              {availableAuthors
                                .filter(
                                  (author) =>
                                    !selectedAuthors.find(
                                      (a) => a.id === author.id
                                    )
                                )
                                .map((author) => (
                                  <CommandItem
                                    key={author.id}
                                    value={author.name}
                                    onSelect={() => {
                                      setSelectedAuthors([
                                        ...selectedAuthors,
                                        author
                                      ])
                                      field.onChange([
                                        ...field.value,
                                        author.id
                                      ])
                                    }}
                                  >
                                    {author.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tagIds'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedTags.map((tag) => (
                        <Badge key={tag.id} variant='secondary'>
                          {tag.name}
                          <button
                            type='button'
                            className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                            onClick={() => {
                              setSelectedTags(
                                selectedTags.filter((t) => t.id !== tag.id)
                              )
                              field.onChange(
                                field.value.filter((id) => id !== tag.id)
                              )
                            }}
                          >
                            <X className='h-3 w-3' />
                            <span className='sr-only'>Remove {tag.name}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormControl>
                      <div className='border rounded-md'>
                        <Command>
                          <CommandInput placeholder='Search tags...' />
                          <CommandList>
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                              {availableTags
                                .filter(
                                  (tag) =>
                                    !selectedTags.find((t) => t.id === tag.id)
                                )
                                .map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={() => {
                                      setSelectedTags([...selectedTags, tag])
                                      field.onChange([...field.value, tag.id])
                                    }}
                                  >
                                    {tag.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Book Edition Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2 pb-2 border-b'>
                <h3 className='text-lg font-semibold text-primary'>
                  Edition Details
                </h3>
                <div className='h-px flex-1 bg-border/60' />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='isbn'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='ISBN'
                          {...field}
                          value={field.value ?? ''}
                          className='bg-background/50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='publisher'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Publisher name'
                          {...field}
                          value={field.value ?? ''}
                          className='bg-background/50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='publishedAt'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal bg-background/50',
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
                            disabled={(date) => date > new Date()}
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
                  name='language'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-background/50'>
                            <SelectValue placeholder='Select language' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='format'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-background/50'>
                            <SelectValue placeholder='Select format' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FORMATS.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format.charAt(0).toUpperCase() + format.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='pageCount'
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Page Count</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Number of pages'
                          {...field}
                          value={value || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            onChange(val ? parseInt(val, 10) : null)
                          }}
                          className='bg-background/50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='price'
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <MoneyInput
                          placeholder='0.00'
                          {...field}
                          value={value || ''}
                          onChange={onChange}
                          error={!!form.formState.errors.price}
                          className='bg-background/50'
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        Enter the price in your local currency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='edition'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Edition</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., First Edition, Second Revised Edition'
                          {...field}
                          value={field.value ?? ''}
                          className='bg-background/50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='thumbnailUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className='flex flex-col gap-4'>
                        {thumbnailUrl && (
                          <div className='flex justify-center'>
                            <div className='relative w-48 h-64 group rounded-lg overflow-hidden border border-border/50 shadow-sm'>
                              <Image
                                src={thumbnailUrl}
                                alt='Book cover'
                                fill
                                className='rounded-lg object-cover transition-opacity group-hover:opacity-75'
                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                              />
                              {createdEditionId && (
                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-[2px]'>
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    className='shadow-sm'
                                    onClick={() => {
                                      setThumbnailUrl(null)
                                      field.onChange(null)
                                    }}
                                  >
                                    Change Image
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className='relative'>
                          {createdEditionId && !thumbnailUrl && (
                            <UploadButton
                              endpoint='bookImageUploader'
                              input={{ editionId: createdEditionId }}
                              onUploadBegin={() => {
                                setIsUploading(true)
                              }}
                              onClientUploadComplete={(res) => {
                                if (res?.[0]) {
                                  const url = res[0].url
                                  setThumbnailUrl(url)
                                  field.onChange(url)
                                  toast.success('Cover uploaded successfully')
                                  setIsUploading(false)
                                }
                              }}
                              onUploadError={(error: Error) => {
                                toast.error(`ERROR! ${error.message}`)
                                setIsUploading(false)
                              }}
                              className={cn(
                                'transition-all duration-200',
                                isUploading && 'opacity-50 pointer-events-none'
                              )}
                            />
                          )}
                          {!createdEditionId && (
                            <div className='text-sm text-muted-foreground text-center p-4 border rounded-md bg-background/50'>
                              Please save the book first to enable image upload
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex justify-end pt-4 border-t'>
            <Button type='submit' disabled={isLoading || isUploading} size='lg'>
              {isLoading || isUploading ? (
                <>
                  <span className='mr-2'>
                    {initialData ? 'Updating...' : 'Creating...'}
                  </span>
                  {/* Add a loading spinner here if you want */}
                </>
              ) : (
                <>{initialData ? 'Update Book' : 'Create Book'}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
