import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react'
import { patientsAPI } from '../services/api'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [searchTerm])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await patientsAPI.getAll(searchTerm || undefined)
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientsAPI.delete(id)
        fetchPatients()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting patient'
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
            Patients
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Manage patient records and information
          </p>
        </div>
        <Link to="/patients/new" className="btn btn-primary">
          <Plus size={18} />
          Add Patient
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '0.875rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-light)'
          }} />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            No patients found
          </p>
          <Link to="/patients/new" className="btn btn-primary">
            <Plus size={18} />
            Add First Patient
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: '500' }}>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td>{patient.email || '-'}</td>
                  <td>{patient.phoneNumber || '-'}</td>
                  <td>{patient.dateOfBirth || '-'}</td>
                  <td>{patient.gender || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/patients/${patient.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        to={`/patients/${patient.id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(patient.id)}
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

export default Patients

