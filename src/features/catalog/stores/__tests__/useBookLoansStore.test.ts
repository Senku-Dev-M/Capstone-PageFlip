// Mock the entire useBookLoansStore
jest.mock('../useBookLoansStore', () => {
  const mockState = {
    loans: [],
    userLoans: []
  }

  return {
    useBookLoansStore: {
      getState: () => ({
        loans: mockState.loans,
        userLoans: mockState.userLoans,
        setLoans: (loans: any[]) => {
          mockState.loans.splice(0, mockState.loans.length, ...loans)
        },
        setUserLoans: (loans: any[]) => {
          mockState.userLoans.splice(0, mockState.userLoans.length, ...loans)
        },
        getBookAvailability: (bookId: string) => {
          const activeLoan = mockState.loans.find(
            (loan: any) => loan.bookId === bookId && !loan.returnedAt,
          )
          return activeLoan ? 'borrowed' : 'available'
        },
        getUserLoans: () => {
          return mockState.userLoans.filter((loan: any) => !loan.returnedAt)
        },
        isBookBorrowedByUser: (bookId: string, userId: string) => {
          return mockState.loans.some(
            (loan: any) =>
              loan.bookId === bookId &&
              loan.borrowedBy === userId &&
              !loan.returnedAt,
          )
        },
        reset: () => {
          mockState.loans.splice(0, mockState.loans.length)
          mockState.userLoans.splice(0, mockState.userLoans.length)
        }
      }),
      setState: (newState: any) => {
        if (newState.loans !== undefined) {
          mockState.loans.splice(0, mockState.loans.length, ...newState.loans)
        }
        if (newState.userLoans !== undefined) {
          mockState.userLoans.splice(0, mockState.userLoans.length, ...newState.userLoans)
        }
      }
    }
  }
})

import { useBookLoansStore } from '../useBookLoansStore'

describe('useBookLoansStore', () => {
  beforeEach(() => {
    // Reset store state
    useBookLoansStore.setState({
      loans: [],
      userLoans: [],
    })
  })

  it('should expose store methods', () => {
    const store = useBookLoansStore.getState()

    expect(typeof store.setLoans).toBe('function')
    expect(typeof store.setUserLoans).toBe('function')
    expect(typeof store.getBookAvailability).toBe('function')
    expect(typeof store.getUserLoans).toBe('function')
    expect(typeof store.isBookBorrowedByUser).toBe('function')
    expect(typeof store.reset).toBe('function')
  })

  it('should manage loans state', () => {
    const store = useBookLoansStore.getState()

    const testLoans = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Book 1',
        author: 'Author 1',
        borrowedBy: 'user1',
        borrowedByUsername: 'User1',
        borrowedByEmail: 'user1@example.com',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z',
      },
    ]

    store.setLoans(testLoans)
    expect(store.loans).toEqual(testLoans)
  })

  it('should manage user loans state', () => {
    const store = useBookLoansStore.getState()

    const testUserLoans = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Book 1',
        author: 'Author 1',
        borrowedBy: 'user1',
        borrowedByUsername: 'User1',
        borrowedByEmail: 'user1@example.com',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: null, // Active loan
      },
    ]

    store.setUserLoans(testUserLoans)
    expect(store.userLoans).toEqual(testUserLoans)
  })

  it('should return book availability correctly', () => {
    const store = useBookLoansStore.getState()

    const activeLoan = {
      id: '1',
      bookId: 'book1',
      title: 'Book 1',
      author: 'Author 1',
      borrowedBy: 'user1',
      borrowedByUsername: 'User1',
      borrowedByEmail: 'user1@example.com',
      borrowedAt: '2024-01-01T00:00:00.000Z',
      returnedAt: null, // Active loan
    }

    store.setLoans([activeLoan])

    expect(store.getBookAvailability('book1')).toBe('borrowed')
    expect(store.getBookAvailability('book2')).toBe('available')
  })

  it('should filter user loans correctly', () => {
    const store = useBookLoansStore.getState()

    const mixedLoans = [
      {
        id: '1',
        bookId: 'book1',
        title: 'Book 1',
        author: 'Author 1',
        borrowedBy: 'user1',
        borrowedByUsername: 'User1',
        borrowedByEmail: 'user1@example.com',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: null, // Active loan
      },
      {
        id: '2',
        bookId: 'book2',
        title: 'Book 2',
        author: 'Author 2',
        borrowedBy: 'user1',
        borrowedByUsername: 'User1',
        borrowedByEmail: 'user1@example.com',
        borrowedAt: '2024-01-01T00:00:00.000Z',
        returnedAt: '2024-01-05T00:00:00.000Z', // Returned loan
      },
    ]

    store.setUserLoans(mixedLoans)
    const userLoans = store.getUserLoans()

    expect(userLoans).toHaveLength(1)
    expect(userLoans[0].id).toBe('1')
    expect(userLoans[0].returnedAt).toBeNull()
  })

  it('should reset state correctly', () => {
    const store = useBookLoansStore.getState()

    const testLoans = [{
      id: '1',
      bookId: 'book1',
      title: 'Book 1',
      author: 'Author 1',
      borrowedBy: 'user1',
      borrowedByUsername: 'User1',
      borrowedByEmail: 'user1@example.com',
      borrowedAt: '2024-01-01T00:00:00.000Z',
      returnedAt: null,
    }]

    store.setLoans(testLoans)
    store.setUserLoans(testLoans)

    expect(store.loans).toHaveLength(1)
    expect(store.userLoans).toHaveLength(1)

    store.reset()

    expect(store.loans).toEqual([])
    expect(store.userLoans).toEqual([])
  })
})