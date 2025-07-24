import { render, screen, fireEvent } from '@testing-library/react'
import Login from '@/app/login/page'
import '@testing-library/jest-dom'

describe('Login Page', () => {
  test('renders One Click logo that links to home page', () => {
    render(<Login />)
    const logo = screen.getByText('One Click')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
    expect(logo).toHaveClass('text-green-600', 'text-5xl', 'font-bold')
  })

  test('renders login heading', () => {
    render(<Login />)
    expect(screen.getByText('Log in')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toHaveClass('text-5xl', 'font-bold', 'text-black')
  })

  test('renders Google login button', () => {
    render(<Login />)
    const googleButton = screen.getByText('Log in with Google')
    expect(googleButton).toBeInTheDocument()
    expect(googleButton).toHaveClass('w-full', 'bg-gray-100', 'hover:bg-gray-200')
  })

  test('renders or divider', () => {
    render(<Login />)
    expect(screen.getByText('or')).toBeInTheDocument()
    expect(screen.getByText('or')).toHaveClass('text-gray-500')
  })

  test('renders email input field', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Email')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveClass('border-b-2')
  })

  test('renders password input field', () => {
    render(<Login />)
    const passwordInput = screen.getByPlaceholderText('Password')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveClass('border-b-2')
  })

  test('renders continue button', () => {
    render(<Login />)
    const continueButton = screen.getByText('Continue')
    expect(continueButton).toBeInTheDocument()
    expect(continueButton).toHaveClass('w-full', 'bg-green-600', 'hover:bg-green-700')
  })

  test('has white background', () => {
    render(<Login />)
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-white')
  })

  test('email and password inputs have blue border styling', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    
    expect(emailInput).toHaveStyle('border-bottom-color: #1c5d8c')
    expect(passwordInput).toHaveStyle('border-bottom-color: #1c5d8c')
  })

  test('google login button triggers OAuth flow', () => {
    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    render(<Login />)
    const googleButton = screen.getByText('Log in with Google')
    
    fireEvent.click(googleButton)
    
    expect(window.location.href).toBe('/api/auth/google')
  })
})