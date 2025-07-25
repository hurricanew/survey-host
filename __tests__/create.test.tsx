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

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

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

  test('opens modal when Start Creating button is clicked', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    expect(screen.getByText('Give your slide a name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Slide name')).toBeInTheDocument()
    expect(screen.getByText('Anyone with the code or link can participate')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Create slide')).toBeInTheDocument()
  })

  test('closes modal when Cancel button is clicked', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    expect(screen.getByText('Give your slide a name')).toBeInTheDocument()
    
    // Close modal
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(screen.queryByText('Give your slide a name')).not.toBeInTheDocument()
  })

  test('closes modal when Create slide button is clicked with valid inputs', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Add text to input
    const input = screen.getByPlaceholderText('Slide name')
    fireEvent.change(input, { target: { value: 'My Test Slide' } })
    
    // Add file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)
    
    // Click create
    const createButton = screen.getByText('Create slide')
    fireEvent.click(createButton)
    
    expect(screen.queryByText('Give your slide a name')).not.toBeInTheDocument()
  })

  test('input field works correctly in modal', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    const input = screen.getByPlaceholderText('Slide name')
    expect(input).toHaveValue('')
    
    fireEvent.change(input, { target: { value: 'My Test Slide' } })
    expect(input).toHaveValue('My Test Slide')
  })

  test('modal has proper styling and layout', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    const modal = screen.getByText('Give your slide a name').closest('div')
    expect(modal).toHaveClass('bg-white', 'rounded-3xl', 'p-8')
    
    const input = screen.getByPlaceholderText('Slide name')
    expect(input).toHaveClass('w-full', 'p-4', 'border', 'rounded-xl')
    
    const createButton = screen.getByText('Create slide')
    expect(createButton).toHaveClass('bg-green-600', 'hover:bg-green-700', 'text-white')
  })

  test('shows file upload field in modal', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    expect(screen.getByText('Upload File (.txt only)')).toBeInTheDocument()
    expect(screen.getByText('Click to upload a .txt file')).toBeInTheDocument()
    
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.txt,text/plain')
  })

  test('validates required slide name field', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Try to create without slide name
    const createButton = screen.getByText('Create slide')
    fireEvent.click(createButton)
    
    expect(screen.getByText('Slide name is required')).toBeInTheDocument()
    expect(screen.getByText('Please upload a .txt file')).toBeInTheDocument()
  })

  test('validates required file upload field', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Add slide name but no file
    const input = screen.getByPlaceholderText('Slide name')
    fireEvent.change(input, { target: { value: 'Test Slide' } })
    
    // Try to create without file
    const createButton = screen.getByText('Create slide')
    fireEvent.click(createButton)
    
    expect(screen.getByText('Please upload a .txt file')).toBeInTheDocument()
    expect(screen.queryByText('Slide name is required')).not.toBeInTheDocument()
  })

  test('clears validation errors when fields are filled', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Try to create without inputs to trigger errors
    const createButton = screen.getByText('Create slide')
    fireEvent.click(createButton)
    
    expect(screen.getByText('Slide name is required')).toBeInTheDocument()
    
    // Add slide name - should clear the error
    const input = screen.getByPlaceholderText('Slide name')
    fireEvent.change(input, { target: { value: 'Test Slide' } })
    
    expect(screen.queryByText('Slide name is required')).not.toBeInTheDocument()
  })

  test('handles txt file upload correctly', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    
    // Upload the file
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)
    
    // Should show the filename
    expect(screen.getByText('test.txt')).toBeInTheDocument()
  })

  test('rejects non-txt files', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Create a mock non-txt file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    
    // Upload the file
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)
    
    // Should show error message
    expect(screen.getByText('Please select a .txt file')).toBeInTheDocument()
  })

  test('successfully creates slide with valid inputs', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: '',
      logout: jest.fn()
    })

    render(<CreatePage />)
    
    // Open modal
    const startButton = screen.getByText('Start Creating')
    fireEvent.click(startButton)
    
    // Fill in both required fields
    const input = screen.getByPlaceholderText('Slide name')
    fireEvent.change(input, { target: { value: 'Test Slide' } })
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)
    
    // Create slide
    const createButton = screen.getByText('Create slide')
    fireEvent.click(createButton)
    
    // Should close modal and log creation
    expect(screen.queryByText('Give your slide a name')).not.toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith('Creating slide:', 'Test Slide', 'with file:', 'test.txt')
    
    consoleSpy.mockRestore()
  })
})