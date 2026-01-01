import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, FileText, Calendar, Pill, Brain } from 'lucide-react'
import { patientsAPI } from '../services/api'

const PatientView = () => {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const response = await patientsAPI.getById(id)
      setPatient(response.data)
    } catch (error) {
      console.error('Error fetching patient:', error)
      const errorMessage = error.response?.data?.message || 'Error loading patient'
      alert(errorMessage)
      if (error.response?.status === 404) {
        // Patient not found, will show not found message
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="card">
        <p>Patient not found</p>
        <Link to="/patients" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Patients
        </Link>
      </div>
    )
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {patient.firstName} {patient.lastName}
            </h1>
            <p style={{ color: 'var(--text-light)' }}>
              Patient ID: {patient.id}
            </p>
          </div>
          <Link to={`/patients/${id}/edit`} className="btn btn-primary">
            <Edit size={18} />
            Edit Patient
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Personal Information
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Email</span>
              <p style={{ fontWeight: '500' }}>{patient.email || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Phone</span>
              <p style={{ fontWeight: '500' }}>{patient.phoneNumber || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Date of Birth</span>
              <p style={{ fontWeight: '500' }}>{patient.dateOfBirth || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Gender</span>
              <p style={{ fontWeight: '500' }}>{patient.gender || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Blood Group</span>
              <p style={{ fontWeight: '500' }}>{patient.bloodGroup || '-'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Address
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Street</span>
              <p style={{ fontWeight: '500' }}>{patient.address || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>City</span>
              <p style={{ fontWeight: '500' }}>{patient.city || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>State</span>
              <p style={{ fontWeight: '500' }}>{patient.state || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Zip Code</span>
              <p style={{ fontWeight: '500' }}>{patient.zipCode || '-'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Country</span>
              <p style={{ fontWeight: '500' }}>{patient.country || '-'}</p>
            </div>
          </div>
        </div>

        {patient.allergies && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Allergies
            </h3>
            <p>{patient.allergies}</p>
          </div>
        )}

        {patient.medicalHistory && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Medical History
            </h3>
            <p>{patient.medicalHistory}</p>
          </div>
        )}

        {patient.emergencyContactName && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Emergency Contact
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Name</span>
                <p style={{ fontWeight: '500' }}>{patient.emergencyContactName}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Phone</span>
                <p style={{ fontWeight: '500' }}>{patient.emergencyContactPhone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to={`/medical-records?patientId=${id}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <FileText size={18} />
            View Records
          </Link>
          <Link to={`/appointments?patientId=${id}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <Calendar size={18} />
            View Appointments
          </Link>
          <Link to={`/prescriptions?patientId=${id}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <Pill size={18} />
            View Prescriptions
          </Link>
          <Link to={`/ai-analysis?patientId=${id}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <Brain size={18} />
            View AI Analyses
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PatientView

