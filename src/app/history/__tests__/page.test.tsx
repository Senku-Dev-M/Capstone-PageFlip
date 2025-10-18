import React from 'react'
import { render, screen } from '@testing-library/react'
import HistoryPage from '../page'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

// Mock the hook
const mockUserReturnedBooks = jest.fn(() => [])
jest.mock('@/features/catalog/hooks/useBookHistory', () => ({
  useBookHistory: () => ({
    userReturnedBooks: mockUserReturnedBooks(),
  }),
}))

describe('HistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no books returned', () => {
    mockUserReturnedBooks.mockReturnValue([])
    render(<HistoryPage />)

    expect(screen.getByText('Reading History')).toBeInTheDocument()
    expect(
      screen.getByText(
        'No returned books yet. Start borrowing to see your reading history here.',
      ),
    ).toBeInTheDocument()
  })

  it('renders returned books when available', () => {
    const mockBooks = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Test Book 1',
        author: 'Author 1',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        dueDate: '2024-01-08T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z',
        cover: 'test-cover.jpg',
      },
      {
        id: '2',
        bookId: 'book2',
        title: 'Test Book 2',
        author: 'Author 2',
        borrowedAt: '2024-01-10T00:00:00.000Z',
        returnedAt: '2024-01-15T00:00:00.000Z',
      },
    ]

    mockUserReturnedBooks.mockReturnValue(mockBooks)
    render(<HistoryPage />)

    expect(screen.getByText('2 Books Returned')).toBeInTheDocument()
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    expect(screen.getByText('Author 1')).toBeInTheDocument()
    expect(screen.getByText('Author 2')).toBeInTheDocument()
  })

  it('renders correct status chip', () => {
    const mockBooks = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Test Book',
        author: 'Author',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z',
      },
    ]

    mockUserReturnedBooks.mockReturnValue(mockBooks)
    render(<HistoryPage />)

    expect(screen.getByText('Returned')).toBeInTheDocument()
  })

  it('renders fallback colors for books without cover', () => {
    const mockBooks = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Another Book',
        author: 'Author',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z',
        cover: null,
      },
    ]

    mockUserReturnedBooks.mockReturnValue(mockBooks)
    render(<HistoryPage />)

    const initials = screen.getByText('AN')
    expect(initials).toBeInTheDocument()
  })

  it('renders correct meta information', () => {
    const mockBooks = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Test Book',
        author: 'Author',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        dueDate: '2024-01-08T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z',
      },
    ]

    mockUserReturnedBooks.mockReturnValue(mockBooks)
    render(<HistoryPage />)

    expect(screen.getByText('Borrowed:')).toBeInTheDocument()
    expect(screen.getByText('Due:')).toBeInTheDocument()
    expect(screen.getByText('Returned:')).toBeInTheDocument()
  })
})