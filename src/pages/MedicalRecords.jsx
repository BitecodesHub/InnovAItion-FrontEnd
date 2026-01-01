import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { medicalRecordsAPI } from '../services/api'
import { formatDate } from '../utils/dateUtils'

const MedicalRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')

  useEffect(() => {
    fetchRecords()
  }, [patientId])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await medicalRecordsAPI.getAll(patientId ? parseInt(patientId) : undefined)
      setRecords(response.data)
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await medicalRecordsAPI.delete(id)
        fetchRecords()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting record'
        alert(errorMessage)
        console.error(error)
      }
    }
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
            Medical Records
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {patientId ? 'Patient medical records' : 'All medical records'}
          </p>
        </div>
        <Link to="/medical-records/new" className="btn btn-primary">
          <Plus size={18} />
          Add Record
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            No medical records found
          </p>
          <Link to="/medical-records/new" className="btn btn-primary">
            <Plus size={18} />
            Add First Record
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td style={{ fontWeight: '500' }}>{record.title}</td>
                  <td>{record.patientName}</td>
                  <td>
                    <span className="badge badge-info">{record.recordType}</span>
                  </td>
                  <td>{record.doctorName || '-'}</td>
                  <td>{formatDate(record.recordDate)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/medical-records/${record.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        to={`/medical-records/${record.id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(record.id)}
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

export default MedicalRecords

