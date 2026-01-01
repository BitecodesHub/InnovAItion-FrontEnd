import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      if (status === 404) {
        console.error('Resource not found:', data?.message || 'Not found')
      } else if (status === 400) {
        // Validation errors
        if (data?.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n')
          console.error('Validation errors:', errorMessages)
        } else {
          console.error('Bad request:', data?.message || 'Invalid request')
        }
      } else if (status === 500) {
        console.error('Server error:', data?.message || 'Internal server error')
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Patients API
export const patientsAPI = {
  getAll: (search) => {
    const params = search ? { search } : {}
    return api.get('/patients', { params })
  },
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
}

// Medical Records API
export const medicalRecordsAPI = {
  getAll: (patientId, recordType) => {
    const params = {}
    if (patientId) params.patientId = patientId
    if (recordType) params.recordType = recordType
    return api.get('/medical-records', { params })
  },
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
}

// Appointments API
export const appointmentsAPI = {
  getAll: (patientId, status) => {
    const params = {}
    if (patientId) params.patientId = patientId
    if (status) params.status = status
    return api.get('/appointments', { params })
  },
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
}

// Prescriptions API
export const prescriptionsAPI = {
  getAll: (patientId, activeOnly) => {
    const params = {}
    if (patientId) params.patientId = patientId
    if (activeOnly !== undefined && activeOnly !== null) {
      params.activeOnly = activeOnly === true || activeOnly === 'true'
    }
    return api.get('/prescriptions', { params })
  },
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
}

// AI Analysis API
export const aiAnalysisAPI = {
  getAll: (patientId, analysisType) => {
    const params = {}
    if (patientId) params.patientId = patientId
    if (analysisType) params.analysisType = analysisType
    return api.get('/ai-analysis', { params })
  },
  getById: (id) => api.get(`/ai-analysis/${id}`),
  create: (data) => api.post('/ai-analysis', data),
  update: (id, data) => api.put(`/ai-analysis/${id}`, data),
  delete: (id) => api.delete(`/ai-analysis/${id}`),
}

// Health Check API
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api

