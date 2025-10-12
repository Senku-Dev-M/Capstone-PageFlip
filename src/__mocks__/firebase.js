// Complete Firebase mock for all modules
const mockGetApp = jest.fn()
const mockGetApps = jest.fn(() => [])
const mockInitializeApp = jest.fn(() => ({}))

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => callback(null)),
}

const mockGetAuth = jest.fn(() => mockAuth)
const mockDb = {}
const mockGetFirestore = jest.fn(() => mockDb)

const mockSignInWithEmailAndPassword = jest.fn()
const mockCreateUserWithEmailAndPassword = jest.fn()
const mockUpdateProfile = jest.fn()
const mockOnAuthStateChanged = jest.fn()

module.exports = {
  // App module
  getApp: mockGetApp,
  getApps: mockGetApps,
  initializeApp: mockInitializeApp,

  // Auth module
  getAuth: mockGetAuth,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  updateProfile: mockUpdateProfile,
  onAuthStateChanged: mockOnAuthStateChanged,

  // Firestore module
  getFirestore: mockGetFirestore,

  // Exported objects
  auth: mockAuth,
  db: mockDb,
}