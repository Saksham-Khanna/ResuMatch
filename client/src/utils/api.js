import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
    }
    const message =
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)


/**
 * Upload resume and analyze against job description
 * @param {File} file
 * @param {string} jobDescription
 * @param {function} onUploadProgress
 */
export async function analyzeResume(file, jobDescription, onUploadProgress) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('jobDescription', jobDescription)

  const response = await api.post('/analysis/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onUploadProgress?.(percent)
    },
  })

  return response.data.data
}

/**
 * Get analysis history
 * @param {number} page
 * @param {number} limit
 */
export async function getHistory(page = 1, limit = 10) {
  const response = await api.get('/analysis/history', { params: { page, limit } })
  return response.data
}

/**
 * Get single analysis by ID
 * @param {string} id
 */
export async function getAnalysis(id) {
  const response = await api.get(`/analysis/${id}`)
  return response.data.data
}

/**
 * Delete analysis by ID
 * @param {string} id
 */
export async function deleteAnalysis(id) {
  const response = await api.delete(`/analysis/${id}`)
  return response.data
}
/**
 * Auth APIs
 */
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { token, ...user } = response.data.data
  localStorage.setItem('token', token)
  return user
}

export async function register(email, password) {
  const response = await api.post('/auth/register', { email, password })
  const { token, ...user } = response.data.data
  localStorage.setItem('token', token)
  return user
}

export async function getMe() {
  if (!localStorage.getItem('token')) return null
  const response = await api.get('/auth/me')
  return response.data.data
}

export function logout() {
  localStorage.removeItem('token')
}
