import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BookCard from '../BookCard'

// Mock Next.js components and hooks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

// Mock the useBookLoans hook
jest.mock('@/features/catalog/hooks/useBookLoans', () => ({
  useBookLoans: jest.fn(() => ({
    returnBook: jest.fn(),
    userLoans: [],
    isLoading: false,
  })),
}))

const mockBook = {
  id: 'test-book-1',
  title: 'Test Book Title',
  author: 'Test Author',
  year: 2023,
  format: 'Digital',
  status: 'available' as const,
  internalStatus: 'available' as const,
  isBorrowedByCurrentUser: false,
  isBorrowable: true,
}

describe('BookCard', () => {
  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} />)

    expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Published 2023')).toBeInTheDocument()
    expect(screen.getByText('Digital')).toBeInTheDocument()
  })

  it('shows available status correctly', () => {
    render(<BookCard book={{ ...mockBook, status: 'available' }} />)

    expect(screen.getByText('available')).toBeInTheDocument()
  })

  it('shows borrowed status for other users', () => {
    const borrowedBook = {
      ...mockBook,
      internalStatus: 'borrowed' as const,
      isBorrowedByCurrentUser: false,
    }
    render(<BookCard book={borrowedBook} />)

    expect(screen.getByText('borrowed')).toBeInTheDocument()
  })

  it('shows "Your Book" status when borrowed by current user', () => {
    const myBook = {
      ...mockBook,
      internalStatus: 'borrowed' as const,
      isBorrowedByCurrentUser: true,
    }
    render(<BookCard book={myBook} />)

    expect(screen.getByText('Your Book')).toBeInTheDocument()
  })

  it('renders link to book details page', () => {
    render(<BookCard book={mockBook} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/book/test-book-1')
  })

  it('handles missing year data gracefully', () => {
    const bookWithoutYear = {
      ...mockBook,
      year: undefined,
    }
    render(<BookCard book={bookWithoutYear} />)

    expect(screen.getByText('Year Unknown')).toBeInTheDocument()
  })
})