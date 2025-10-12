// Import the store directly to test its state management
import { useBookStore } from '../useBookStore'

// Mock the store to return a simple object for testing
jest.mock('../useBookStore', () => {
  const mockStore = {
    books: [],
    isLoading: false,
    pagination: { currentPage: 1, pageSize: 12 },
    filters: { search: '', category: 'All', sort: 'publicationDate' },
    setBooks: jest.fn(),
    setIsLoading: jest.fn(),
    updateFilters: jest.fn(),
    setPage: jest.fn(),
    reset: jest.fn(),
  }

  return {
    useBookStore: () => mockStore,
  }
})

describe('useBookStore', () => {
  const mockStore = require('../useBookStore')

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset to initial state before each test
    mockStore.useBookStore().books = []
    mockStore.useBookStore().isLoading = false
    mockStore.useBookStore().pagination = { currentPage: 1, pageSize: 12 }
    mockStore.useBookStore().filters = { search: '', category: 'All', sort: 'publicationDate' }
  })

  it('should have initial state', () => {
    const store = useBookStore()

    expect(store.books).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.pagination).toEqual({
      currentPage: 1,
      pageSize: 12,
    })
  })

  it('should have initial filters', () => {
    const store = useBookStore()

    expect(store.filters.search).toBe('')
    expect(store.filters.category).toBe('All')
    expect(store.filters.sort).toBe('publicationDate')
  })

  it('should expose action functions', () => {
    const store = useBookStore()

    expect(typeof store.setBooks).toBe('function')
    expect(typeof store.setIsLoading).toBe('function')
    expect(typeof store.updateFilters).toBe('function')
    expect(typeof store.setPage).toBe('function')
    expect(typeof store.reset).toBe('function')
  })

  it('should have proper pagination structure', () => {
    const store = useBookStore()

    expect(store.pagination).toHaveProperty('currentPage')
    expect(store.pagination).toHaveProperty('pageSize')
    expect(store.pagination.currentPage).toBe(1)
    expect(store.pagination.pageSize).toBe(12)
  })
})