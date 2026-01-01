import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  Calendar, 
  Pill, 
  Brain,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import { patientsAPI, medicalRecordsAPI, appointmentsAPI, prescriptionsAPI, aiAnalysisAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    medicalRecords: 0,
    appointments: 0,
    prescriptions: 0,
    aiAnalyses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, recordsRes, appointmentsRes, prescriptionsRes, analysesRes] = await Promise.all([
          patientsAPI.getAll(),
          medicalRecordsAPI.getAll(),
          appointmentsAPI.getAll(),
          prescriptionsAPI.getAll(),
          aiAnalysisAPI.getAll(),
        ])
        setStats({
          patients: patientsRes.data.length,
          medicalRecords: recordsRes.data.length,
          appointments: appointmentsRes.data.length,
          prescriptions: prescriptionsRes.data.length,
          aiAnalyses: analysesRes.data.length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          patients: 0,
          medicalRecords: 0,
          appointments: 0,
          prescriptions: 0,
          aiAnalyses: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { 
      title: 'Patients', 
      value: stats.patients, 
      icon: Users, 
      color: 'var(--primary)',
      link: '/patients'
    },
    { 
      title: 'Medical Records', 
      value: stats.medicalRecords, 
      icon: FileText, 
      color: 'var(--secondary)',
      link: '/medical-records'
    },
    { 
      title: 'Appointments', 
      value: stats.appointments, 
      icon: Calendar, 
      color: 'var(--warning)',
      link: '/appointments'
    },
    { 
      title: 'Prescriptions', 
      value: stats.prescriptions, 
      icon: Pill, 
      color: 'var(--success)',
      link: '/prescriptions'
    },
    { 
      title: 'AI Analyses', 
      value: stats.aiAnalyses, 
      icon: Brain, 
      color: 'var(--primary)',
      link: '/ai-analysis'
    },
  ]

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          Welcome to Medical AI Healthcare Management System
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              to={card.link}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {card.title}
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color }}>
                      {card.value}
                    </h2>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '0.75rem',
                    background: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} color={card.color} />
                  </div>
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: card.color,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  View all <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} />
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/patients/new" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Users size={18} />
            Add Patient
          </Link>
          <Link to="/appointments/new" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            <Calendar size={18} />
            Schedule Appointment
          </Link>
          <Link to="/ai-analysis/new" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Brain size={18} />
            New AI Analysis
          </Link>
          <Link to="/prescriptions/new" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            <Pill size={18} />
            Create Prescription
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

