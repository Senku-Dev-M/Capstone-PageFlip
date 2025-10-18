import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterDialog from '../RegisterDialog'
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

// Mock Firebase
jest.mock('@/core/firebase', () => ({
  auth: {},
}))

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}))

describe('RegisterDialog', () => {
  const mockOnClose = jest.fn()
  const mockOnSwitchToLogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the dialog when open', () => {
    render(
      <RegisterDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )

    expect(screen.getByText('Initiate New Credentials')).toBeInTheDocument()
    expect(screen.getByLabelText('Codename')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Access Key')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Access Key')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('shows an error if passwords do not match', async () => {
    const user = userEvent.setup()
    render(
      <RegisterDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )

    await user.type(screen.getByLabelText('Access Key'), 'password123')
    await user.type(screen.getByLabelText('Confirm Access Key'), 'password456')
    
    fireEvent.submit(screen.getByTestId('register-form'))

    const errorMessage = await screen.findByRole('alert')
    expect(errorMessage).toHaveTextContent('Access keys do not match. Recalibrate and try again.')
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('calls registration and closes on success', async () => {
    const user = userEvent.setup()
    ;(createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: {},
    })
    ;(updateProfile as jest.Mock).mockResolvedValue({})

    render(
      <RegisterDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )

    await user.type(screen.getByLabelText('Codename'), 'Test User')
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Access Key'), 'password123')
    await user.type(screen.getByLabelText('Confirm Access Key'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password123',
      )
    })

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(expect.any(Object), {
        displayName: 'Test User',
      })
    })

    await waitFor(() => {
      expect(
        screen.getByText('Registration successful. Credentials synced with the network.'),
      ).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }, { timeout: 3500 })

  })

  it('shows an error message on failed registration', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Firebase: Error (auth/email-already-in-use).'
    ;(createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    )

    render(
      <RegisterDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )

    await user.type(screen.getByLabelText('Codename'), 'Test User')
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Access Key'), 'password123')
    await user.type(screen.getByLabelText('Confirm Access Key'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent(errorMessage)
  })

  it('calls onSwitchToLogin when the log in button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <RegisterDialog
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Log In' }))
    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1)
  })
})