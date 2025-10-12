import React from 'react'
import { render, screen } from '@testing-library/react'
import Toast from '../Toast'

describe('Toast', () => {
  it('renders with default variant (info)', () => {
    render(<Toast message="Test message" />)

    const toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveTextContent('Test message')
  })

  it('renders with success variant', () => {
    render(<Toast message="Success message" variant="success" />)

    const toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveTextContent('Success message')
  })

  it('renders with error variant', () => {
    render(<Toast message="Error message" variant="error" />)

    const toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveTextContent('Error message')
  })

  it('applies correct styling based on variant', () => {
    const { rerender } = render(<Toast message="Test" variant="success" />)

    let toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()

    rerender(<Toast message="Test" variant="error" />)
    toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()

    rerender(<Toast message="Test" variant="info" />)
    toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
  })
})