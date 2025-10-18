import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginDialog from '../LoginDialog'
import { signInWithEmailAndPassword } from 'firebase/auth'

// Mock Firebase
jest.mock('@/core/firebase', () => ({
  auth: {},
}))

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}))

describe('LoginDialog', () => {
  const mockOnClose = jest.fn()
  const mockOnSwitchToRegister = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the dialog when open', () => {
    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    expect(screen.getByText('Secure Access Terminal')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Access Key')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(
      <LoginDialog
        isOpen={false}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('allows typing in email and password fields', async () => {
    const user = userEvent.setup()
    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Access Key')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('calls onLogin and onClose on successful login', async () => {
    const user = userEvent.setup()
    ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValue({})

    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Access Key'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Connect' }))

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password123',
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Connection established. Welcome back, operator.')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }, { timeout: 3500 })

  })

  it('shows an error message on failed login', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Firebase: Error (auth/wrong-password).'
    ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    )

    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Access Key'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Connect' }))

    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent(errorMessage)
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    await user.click(screen.getByLabelText('Close login dialog'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSwitchToRegister when the sign up button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LoginDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1)
  })
})