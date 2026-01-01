import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Pill, 
  Brain,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/medical-records', icon: FileText, label: 'Medical Records' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/ai-analysis', icon: Brain, label: 'AI Analysis' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Brain size={28} />
            Medical AI
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Healthcare Management
          </p>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: active ? 'var(--primary)' : 'var(--text)',
                  backgroundColor: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  fontWeight: active ? '600' : '400',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--bg)'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '260px',
        flex: 1,
        padding: '2rem',
        width: 'calc(100% - 260px)',
      }}>
        {children}
      </main>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          padding: '0.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  )
}

export default Layout

