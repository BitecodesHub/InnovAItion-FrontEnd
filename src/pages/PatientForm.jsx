import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { patientsAPI } from '../services/api'
import { Link } from 'react-router-dom'
import { formatDateInput } from '../utils/dateUtils'

const PatientForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      fetchPatient()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit])

  const fetchPatient = async () => {
    try {
      const response = await patientsAPI.getById(id)
      const patient = response.data
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        phoneNumber: patient.phoneNumber || '',
        dateOfBirth: formatDateInput(patient.dateOfBirth) || '',
        gender: patient.gender || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
        country: patient.country || '',
        bloodGroup: patient.bloodGroup || '',
        allergies: patient.allergies || '',
        medicalHistory: patient.medicalHistory || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
      })
    } catch (error) {
      console.error('Error fetching patient:', error)
      alert('Error loading patient data')
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
      // Prepare data - ensure dateOfBirth is properly formatted
      const submitData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
      }
      
      if (isEdit) {
        await patientsAPI.update(id, submitData)
      } else {
        await patientsAPI.create(submitData)
      }
      navigate('/patients')
    } catch (error) {
      let errorMessage = 'Error saving patient'
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
          to="/patients" 
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
          Back to Patients
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {isEdit ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., O+, A-, B+"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="form-textarea"
              placeholder="List any known allergies"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Previous medical conditions, surgeries, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact Phone</label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link to="/patients" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={18} />
            {loading ? 'Saving...' : isEdit ? 'Update Patient' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientForm

