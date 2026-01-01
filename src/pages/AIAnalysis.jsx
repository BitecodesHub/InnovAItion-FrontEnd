import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Eye, Trash2, Brain } from 'lucide-react'
import { aiAnalysisAPI } from '../services/api'
import { formatDate, formatDateTime } from '../utils/dateUtils'

const AIAnalysis = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')

  useEffect(() => {
    fetchAnalyses()
  }, [patientId])

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const response = await aiAnalysisAPI.getAll(patientId ? parseInt(patientId) : undefined)
      setAnalyses(response.data)
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this AI analysis?')) {
      try {
        await aiAnalysisAPI.delete(id)
        fetchAnalyses()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting analysis'
        alert(errorMessage)
        console.error(error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-warning',
      PROCESSING: 'badge-info',
      COMPLETED: 'badge-success',
      FAILED: 'badge-danger',
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
            AI Analysis
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {patientId ? 'Patient AI analyses' : 'All AI-powered medical analyses'}
          </p>
        </div>
        <Link to="/ai-analysis/new" className="btn btn-primary">
          <Plus size={18} />
          New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Brain size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            No AI analyses found
          </p>
          <Link to="/ai-analysis/new" className="btn btn-primary">
            <Plus size={18} />
            Create First Analysis
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Analysis Type</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr key={analysis.id}>
                  <td style={{ fontWeight: '500' }}>{analysis.patientName}</td>
                  <td>{analysis.analysisType}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(analysis.status)}`}>
                      {analysis.status}
                    </span>
                  </td>
                  <td>{analysis.confidenceScore || '-'}</td>
                  <td>{formatDate(analysis.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/ai-analysis/${analysis.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(analysis.id)}
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

export default AIAnalysis

