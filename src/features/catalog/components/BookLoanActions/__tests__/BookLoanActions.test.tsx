import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookLoanActions from '../BookLoanActions'

// Mock hooks
const mockBorrowBook = jest.fn()
const mockReturnBook = jest.fn()

jest.mock('@/features/catalog/hooks/useBookLoans', () => ({
  useBookLoans: () => ({
    borrowBook: mockBorrowBook,
    returnBook: mockReturnBook,
    isLoading: false,
    userLoans: [],
  }),
}))

jest.mock('@/features/catalog/hooks/useWishlist', () => ({
  useWishlist: () => ({
    addToWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
    isBookInWishlist: jest.fn(() => false),
  }),
}))

jest.mock('@/features/catalog/stores/useBookLoansStore', () => ({
  useBookLoansStore: () => ({
    loans: [],
  }),
}))

jest.mock('@/features/auth/stores/useUserStore', () => ({
  useUserStore: () => ({
    user: { id: 'user123', displayName: 'Test User', email: 'test@example.com' },
  }),
}))

describe('BookLoanActions', () => {
  const mockBook = {
    id: 'test-book-1',
    title: 'Test Book',
    author: 'Test Author',
    status: 'available' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders borrow button when book is available', () => {
    render(<BookLoanActions book={mockBook} remoteStatus="available" />)

    const borrowButton = screen.getByRole('button', { name: /acquire loan/i })
    expect(borrowButton).toBeInTheDocument()
  })

  it('renders wishlist button alongside loan button', () => {
    render(<BookLoanActions book={mockBook} remoteStatus="available" />)

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i })
    expect(wishlistButton).toBeInTheDocument()
  })

  it('renders request hold button when book is borrowed', () => {
    render(<BookLoanActions book={mockBook} remoteStatus="borrowed" />)

    const holdButton = screen.getByRole('button', { name: /request hold/i })
    expect(holdButton).toBeInTheDocument()
  })

  it('calls borrowBook when clicking borrow button', async () => {
    const user = userEvent.setup()
    render(<BookLoanActions book={mockBook} remoteStatus="available" />)

    const borrowButton = screen.getByRole('button', { name: /acquire loan/i })
    await user.click(borrowButton)

    expect(mockBorrowBook).toHaveBeenCalledWith(mockBook)
  })

  it('shows two action buttons (loan and wishlist)', () => {
    render(<BookLoanActions book={mockBook} remoteStatus="available" />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('handles books with unavailable status', () => {
    render(<BookLoanActions book={{ ...mockBook, status: 'borrowed' }} remoteStatus="borrowed" />)

    const holdButton = screen.getByRole('button', { name: /request hold/i })
    expect(holdButton).toBeDisabled()
  })
})