import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreatePage from '../src/app/create/page'
import * as useAuthModule from '../src/hooks/useAuth'
import '@testing-library/jest-dom'

// Mock the useAuth hook
jest.mock('../src/hooks/useAuth')
const mockUseAuth = jest.spyOn(useAuthModule, 'useAuth')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const mockUser = {
  id: '123456789',
  email: 'test@example.com',
  name: 'John Doe',
  picture: 'https://example.com/avatar.jpg',
  verified_email: true
}

describe('Create Page', () => {
  beforeEach(() => {
    mockUseAuth.mockClear()
  })

  test('shows loading state when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders create page when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    expect(screen.getByText('One Click')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
    expect(screen.getByText('Run polls and Q&A in your browser.')).toBeInTheDocument()
    expect(screen.getByText('Start Creating')).toBeInTheDocument()
  })

  test('displays user profile picture and name in header', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    const profileImage = screen.getByAltText('John Doe')
    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  test('renders One Click logo that links to home', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    const logo = screen.getByText('One Click')
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  test('logout button calls logout function', () => {
    const mockLogout = jest.fn()
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: mockLogout
    })

    render(<CreatePage />)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  test('renders create illustration and plus button', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Check for the plus button in the illustration
    const plusButton = screen.getByText('+')
    expect(plusButton).toBeInTheDocument()
    expect(plusButton).toHaveClass('bg-green-600')
  })

  test('renders start creating button with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    const startButton = screen.getByText('Start Creating')
    expect(startButton).toBeInTheDocument()
    expect(startButton).toHaveClass('bg-green-600', 'hover:bg-green-700', 'text-white')
  })

  test('returns null when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: 'Authentication required',
      logout: jest.fn()
    })

    const { container } = render(<CreatePage />)
    expect(container.firstChild).toBeNull()
  })

  test('has responsive design classes', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    const mainContent = screen.getByText('Create').closest('main')
    expect(mainContent).toHaveClass('min-h-[calc(100vh-80px)]', 'px-6')
  })
})