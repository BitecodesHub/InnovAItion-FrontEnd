import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { prescriptionsAPI } from '../services/api'
import { formatDate } from '../utils/dateUtils'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')

  useEffect(() => {
    fetchPrescriptions()
  }, [patientId])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionsAPI.getAll(patientId ? parseInt(patientId) : undefined)
      setPrescriptions(response.data)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionsAPI.delete(id)
        fetchPrescriptions()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting prescription'
        alert(errorMessage)
        console.error(error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'badge-success',
      COMPLETED: 'badge-info',
      CANCELLED: 'badge-danger',
    }
    return badges[status] || 'badge-info'
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Prescriptions
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {patientId ? 'Patient prescriptions' : 'All prescriptions'}
          </p>
        </div>
        <Link to="/prescriptions/new" className="btn btn-primary">
          <Plus size={18} />
          Create Prescription
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            No prescriptions found
          </p>
          <Link to="/prescriptions/new" className="btn btn-primary">
            <Plus size={18} />
            Create First Prescription
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td style={{ fontWeight: '500' }}>{prescription.patientName}</td>
                  <td>{prescription.medicationName}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.frequency}</td>
                  <td>{formatDate(prescription.startDate)}</td>
                  <td>{formatDate(prescription.endDate)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/prescriptions/${prescription.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        to={`/prescriptions/${prescription.id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(prescription.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Prescriptions

