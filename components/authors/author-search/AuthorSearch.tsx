'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Author } from '@/db/schema'
import AuthorList from '../author-list/AuthorList'

interface AuthorSearchProps {
  initialAuthors: Author[]
  followedAuthorIds?: string[]
}

export default function AuthorSearch({
  initialAuthors,
  followedAuthorIds = []
}: AuthorSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setAuthors(initialAuthors)
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would be an API call
      // Example: const response = await fetch(`/api/authors/search?q=${encodeURIComponent(searchQuery)}`)

      // For demo purposes, we'll just filter the initial authors
      const filteredAuthors = initialAuthors.filter(
        (author) =>
          author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (author.biography &&
            author.biography.toLowerCase().includes(searchQuery.toLowerCase()))
      )

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAuthors(filteredAuthors)
    } catch (error) {
      console.error('Error searching authors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSearch} className='flex w-full max-w-lg gap-2'>
        <Input
          type='text'
          placeholder='Search authors by name or biography...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-1'
        />
        <Button type='submit' disabled={isLoading}>
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>
      </form>

      <div className='mt-6'>
        <AuthorList authors={authors} followedAuthorIds={followedAuthorIds} />
      </div>
    </div>
  )
}
