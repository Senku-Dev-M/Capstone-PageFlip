import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

// Mock navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock auth hook
jest.mock('@/features/auth/hooks/useAuthSession', () => ({
  useAuthSession: () => ({
    user: {
      id: 'user123',
      displayName: 'Test User',
      email: 'test@example.com',
    },
    isLoading: false,
  }),
}))

describe('Header', () => {
  it('renders PageFlip brand', () => {
    render(<Header />)

    const brandLink = screen.getByRole('link', { name: /pageflip/i })
    expect(brandLink).toBeInTheDocument()
  })

  it('renders main navigation items', () => {
    render(<Header />)

    expect(screen.getByText('Catalog')).toBeInTheDocument()
    expect(screen.getByText('Loans')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Wishlist')).toBeInTheDocument()
  })

  it('renders user menu when authenticated', () => {
    render(<Header />)

    // Should show user-related elements
    expect(screen.getByRole('button', { name: /test user/i })).toBeDefined()
  })

  it('renders navigation links with correct hrefs', () => {
    render(<Header />)

    const catalogLink = screen.getByRole('link', { name: /catalog/i })
    const loansLink = screen.getByRole('link', { name: /loans/i })
    const historyLink = screen.getByRole('link', { name: /history/i })
    const wishlistLink = screen.getByRole('link', { name: /wishlist/i })

    expect(catalogLink).toHaveAttribute('href', '/')
    expect(loansLink).toHaveAttribute('href', '/loans')
    expect(historyLink).toHaveAttribute('href', '/history')
    expect(wishlistLink).toHaveAttribute('href', '/wishlist')
  })
})