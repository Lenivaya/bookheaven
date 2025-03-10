import { Author, BookEdition, BookWork, Tag } from '@/db/schema'
import type { Meta, StoryObj } from '@storybook/react'
import BookCard from './BookCard'

const meta: Meta<typeof BookCard> = {
  title: 'Components/Books/BookCard',
  component: BookCard,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <div className='max-w-sm dark'>
        <Story />
      </div>
    )
  ],
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof BookCard>

// Mock data
const mockBook: BookWork = {
  id: '1',
  title: 'The Great Gatsby',
  description:
    'A novel by F. Scott Fitzgerald that follows a cast of characters living in the fictional town of West Egg on prosperous Long Island in the summer of 1922.',
  originalTitle: 'The Great Gatsby',
  writingCompletedAt: new Date('1925-04-10'),
  originalLanguage: 'en',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null
}

const mockEdition: BookEdition = {
  id: '1',
  workId: '1',
  isbn: '9780743273565',
  publisher: 'Scribner',
  publishedAt: new Date('2004-09-30'),
  language: 'en',
  pageCount: 180,
  format: 'Paperback',
  edition: 'Reprint',
  price: '15.99',
  isOnSale: false,
  salePrice: null,
  stockQuantity: 100,
  likesCount: 100,
  thumbnailUrl:
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
  smallThumbnailUrl:
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null
}

const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'F. Scott Fitzgerald',
    biography:
      'Francis Scott Key Fitzgerald was an American novelist, essayist, and short story writer.',
    birthDate: new Date('1896-09-24'),
    deathDate: new Date('1940-12-21'),
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5c/F_Scott_Fitzgerald_1921.jpg',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  }
]

const mockTags: Tag[] = [
  {
    id: '1',
    name: 'Classic',
    description: 'Classic literature',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  },
  {
    id: '2',
    name: 'Fiction',
    description: 'Fiction books',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  },
  {
    id: '3',
    name: 'American',
    description: 'American literature',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  }
]

// Stories
export const Default: Story = {
  args: {
    book: mockBook,
    edition: mockEdition,
    authors: mockAuthors,
    tags: mockTags
  }
}

export const WithActions: Story = {
  args: {
    book: mockBook,
    edition: mockEdition,
    authors: mockAuthors,
    tags: mockTags
  }
}

export const OnSale: Story = {
  args: {
    book: mockBook,
    edition: {
      ...mockEdition,
      isOnSale: true,
      salePrice: '9.99'
    },
    authors: mockAuthors,
    tags: mockTags
  }
}

export const NoImage: Story = {
  args: {
    book: mockBook,
    edition: {
      ...mockEdition,
      thumbnailUrl: '',
      smallThumbnailUrl: ''
    },
    authors: mockAuthors,
    tags: mockTags
  }
}

export const ManyTags: Story = {
  args: {
    book: mockBook,
    edition: mockEdition,
    authors: mockAuthors,
    tags: [
      ...mockTags,
      {
        id: '4',
        name: 'Jazz Age',
        description: 'Set in the Jazz Age',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
      {
        id: '5',
        name: 'Literary',
        description: 'Literary fiction',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
      {
        id: '6',
        name: '1920s',
        description: 'Set in the 1920s',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ]
  }
}

export const MultipleAuthors: Story = {
  args: {
    book: mockBook,
    edition: mockEdition,
    authors: [
      ...mockAuthors,
      {
        id: '2',
        name: 'Ernest Hemingway',
        biography:
          'Ernest Miller Hemingway was an American novelist, short-story writer, and journalist.',
        birthDate: new Date('1899-07-21'),
        deathDate: new Date('1961-07-02'),
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/2/28/ErnestHemingway.jpg',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ],
    tags: mockTags
  }
}

export const LongTitle: Story = {
  args: {
    book: {
      ...mockBook,
      title:
        'The Curious Incident of the Dog in the Night-Time: A Novel with an Extremely Long Title That Should Be Truncated'
    },
    edition: mockEdition,
    authors: mockAuthors,
    tags: mockTags
  }
}
