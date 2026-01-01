import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { appointmentsAPI } from '../services/api'
import { formatDateTime } from '../utils/dateUtils'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')

  useEffect(() => {
    fetchAppointments()
  }, [patientId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await appointmentsAPI.getAll(patientId ? parseInt(patientId) : undefined)
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id)
        fetchAppointments()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting appointment'
        alert(errorMessage)
        console.error(error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      SCHEDULED: 'badge-info',
      CONFIRMED: 'badge-success',
      IN_PROGRESS: 'badge-warning',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-danger',
      NO_SHOW: 'badge-danger',
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
            Appointments
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {patientId ? 'Patient appointments' : 'All appointments'}
          </p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">
          <Plus size={18} />
          Schedule Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            No appointments found
          </p>
          <Link to="/appointments/new" className="btn btn-primary">
            <Plus size={18} />
            Schedule First Appointment
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={{ fontWeight: '500' }}>{appointment.patientName}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{appointment.department}</td>
                  <td>{formatDateTime(appointment.appointmentDate)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/appointments/${appointment.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        to={`/appointments/${appointment.id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(appointment.id)}
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

export default Appointments

