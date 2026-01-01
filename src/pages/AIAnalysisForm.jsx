import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Save, ArrowLeft, Brain } from 'lucide-react'
import { aiAnalysisAPI, patientsAPI, medicalRecordsAPI } from '../services/api'

const AIAnalysisForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [formData, setFormData] = useState({
    patientId: searchParams.get('patientId') || '',
    medicalRecordId: '',
    analysisType: '',
    inputData: '',
    modelVersion: 'v1.0',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (formData.patientId) {
      fetchMedicalRecords()
    } else {
      setMedicalRecords([])
      setFormData(prev => ({ ...prev, medicalRecordId: '' }))
    }
  }, [formData.patientId])

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll()
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchMedicalRecords = async () => {
    try {
      const response = await medicalRecordsAPI.getAll(parseInt(formData.patientId))
      setMedicalRecords(response.data)
    } catch (error) {
      console.error('Error fetching medical records:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData = {
        patientId: parseInt(formData.patientId),
        medicalRecordId: formData.medicalRecordId ? parseInt(formData.medicalRecordId) : null,
        analysisType: formData.analysisType,
        inputData: formData.inputData,
        modelVersion: formData.modelVersion || 'v1.0',
      }
      const response = await aiAnalysisAPI.create(submitData)
      navigate(`/ai-analysis/${response.data.id}`)
    } catch (error) {
      let errorMessage = 'Error creating AI analysis'
      if (error.response?.data?.errors) {
        const errors = Object.entries(error.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n')
        errorMessage = `Validation errors:\n${errors}`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      alert(errorMessage)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/ai-analysis" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--text-light)',
            textDecoration: 'none',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={18} />
          Back to AI Analysis
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain size={28} />
          New AI Analysis
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
          Create a new AI-powered medical analysis using Google Gemini
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Record (Optional)</label>
              <select
                name="medicalRecordId"
                value={formData.medicalRecordId}
                onChange={handleChange}
                className="form-select"
                disabled={!formData.patientId || medicalRecords.length === 0}
              >
                <option value="">None</option>
                {medicalRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title} - {record.recordType}
                  </option>
                ))}
              </select>
              {formData.patientId && medicalRecords.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  No medical records found for this patient
                </p>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Analysis Type *</label>
              <select
                name="analysisType"
                value={formData.analysisType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Analysis Type</option>
                <option value="Diagnosis Prediction">Diagnosis Prediction</option>
                <option value="Risk Assessment">Risk Assessment</option>
                <option value="Treatment Recommendation">Treatment Recommendation</option>
                <option value="Symptom Analysis">Symptom Analysis</option>
                <option value="Drug Interaction Check">Drug Interaction Check</option>
                <option value="Disease Progression">Disease Progression</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Input Data *</label>
              <textarea
                name="inputData"
                value={formData.inputData}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
                required
                placeholder="Enter medical data, symptoms, test results, or any information to analyze. For example: Patient presents with fever (38.5°C), persistent cough for 5 days, fatigue, and mild shortness of breath."
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Provide detailed medical information for accurate AI analysis
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Model Version</label>
              <input
                type="text"
                name="modelVersion"
                value={formData.modelVersion}
                onChange={handleChange}
                className="form-input"
                placeholder="v1.0"
              />
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'var(--bg)', 
          borderRadius: '0.5rem',
          border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            <strong>Note:</strong> This analysis will use Google Gemini AI to process the medical information. 
            The results are for informational purposes only and should not replace professional medical consultation.
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link to="/ai-analysis" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Brain size={18} />
            {loading ? 'Processing...' : 'Create Analysis'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AIAnalysisForm

