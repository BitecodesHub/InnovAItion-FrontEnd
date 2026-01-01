import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Brain, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { aiAnalysisAPI } from '../services/api'
import { formatDateTime } from '../utils/dateUtils'

const FormattedContent = ({ content }) => {
  const formatContent = (text) => {
    if (!text) return null
    
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Headers
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="formatted-list">
              {currentList}
            </ul>
          )
          currentList = []
          listType = null
        }
        
        const headerText = trimmedLine.replace(/\*\*/g, '')
        const level = headerText.match(/^\d+\./) ? 'h3' : 'h4'
        elements.push(
          <div key={index} className={`formatted-header ${level}`}>
            {headerText}
          </div>
        )
      }
      // Horizontal line
      else if (trimmedLine === '---') {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="formatted-list">
              {currentList}
            </ul>
          )
          currentList = []
          listType = null
        }
        elements.push(<div key={index} className="formatted-divider" />)
      }
      // Bullet points
      else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.substring(2)
        const formattedContent = content
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        
        currentList.push(
          <li key={index} dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )
        listType = 'ul'
      }
      // Regular text
      else if (trimmedLine) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="formatted-list">
              {currentList}
            </ul>
          )
          currentList = []
          listType = null
        }
        
        const formattedContent = trimmedLine
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        
        elements.push(
          <p key={index} className="formatted-text" dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )
      }
      // Empty line
      else if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="formatted-list">
            {currentList}
          </ul>
        )
        currentList = []
        listType = null
      }
    })
    
    // Add remaining list items
    if (currentList.length > 0) {
      elements.push(
        <ul key="final-list" className="formatted-list">
          {currentList}
        </ul>
      )
    }
    
    return elements
  }
  
  return <div className="formatted-content">{formatContent(content)}</div>
}

const AIAnalysisView = () => {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalysis()
  }, [id])

  useEffect(() => {
    if (analysis && (analysis.status === 'PROCESSING' || analysis.status === 'PENDING')) {
      const interval = setInterval(() => {
        fetchAnalysis()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [analysis?.status])

  const fetchAnalysis = async () => {
    try {
      const response = await aiAnalysisAPI.getById(id)
      setAnalysis(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      const errorMessage = error.response?.data?.message || 'Error loading analysis'
      alert(errorMessage)
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { 
        color: '#f59e0b', 
        bg: '#fef3c7', 
        icon: RefreshCw,
        text: 'Pending'
      },
      PROCESSING: { 
        color: '#3b82f6', 
        bg: '#dbeafe', 
        icon: RefreshCw,
        text: 'Processing'
      },
      COMPLETED: { 
        color: '#10b981', 
        bg: '#d1fae5', 
        icon: CheckCircle,
        text: 'Completed'
      },
      FAILED: { 
        color: '#ef4444', 
        bg: '#fee2e2', 
        icon: AlertTriangle,
        text: 'Failed'
      },
    }
    return configs[status] || configs.PROCESSING
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <RefreshCw size={32} style={{ 
          animation: 'spin 1s linear infinite',
          color: '#3b82f6'
        }} />
      </div>
    )
  }

  if (!analysis) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <p>Analysis not found</p>
        <Link 
          to="/ai-analysis" 
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          Back to AI Analysis
        </Link>
      </div>
    )
  }

  const statusConfig = getStatusConfig(analysis.status)
  const StatusIcon = statusConfig.icon

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .formatted-content {
          line-height: 1.8;
        }
        
        .formatted-header {
          margin: 1.5rem 0 1rem 0;
          font-weight: 700;
        }
        
        .formatted-header.h3 {
          font-size: 1.25rem;
          color: #1f2937;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .formatted-header.h4 {
          font-size: 1.1rem;
          color: #374151;
        }
        
        .formatted-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 1.5rem 0;
        }
        
        .formatted-list {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        
        .formatted-list li {
          margin: 0.5rem 0;
          color: #374151;
        }
        
        .formatted-list li strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .formatted-list li em {
          font-style: italic;
          color: #6b7280;
        }
        
        .formatted-text {
          margin: 0.75rem 0;
          color: #374151;
        }
        
        .formatted-text strong {
          color: #1f2937;
          font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/ai-analysis"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            padding: '0.25rem 0'
          }}
        >
          <ArrowLeft size={16} />
          Back to AI Analysis
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={28} color="white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700',
              margin: 0,
              color: '#111827'
            }}>
              {analysis.analysisType}
            </h1>
          </div>
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: statusConfig.bg,
          color: statusConfig.color,
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          <StatusIcon size={16} />
          {statusConfig.text}
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Patient Information
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                Patient Name
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                {analysis.patientName}
              </div>
            </div>
            {analysis.medicalRecordId && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Medical Record
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  #{analysis.medicalRecordId}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Analysis Details
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Confidence</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10b981' }}>
                {analysis.confidenceScore}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Model</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                {analysis.modelVersion}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Created</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                {formatDateTime(analysis.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Data */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <Info size={20} color="#3b82f6" />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            Input Data
          </h3>
        </div>
        <div style={{ 
          padding: '1.25rem', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.875rem',
          color: '#374151',
          lineHeight: '1.7'
        }}>
          {analysis.inputData}
        </div>
      </div>

      {/* Analysis Result */}
      {analysis.status === 'COMPLETED' && analysis.analysisResult && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Brain size={20} color="#8b5cf6" />
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              AI Analysis Result
            </h3>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            background: 'linear-gradient(to bottom, #faf5ff, #ffffff)', 
            borderRadius: '8px',
            border: '1px solid #e9d5ff'
          }}>
            <FormattedContent content={analysis.analysisResult} />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.status === 'COMPLETED' && analysis.recommendations && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <CheckCircle size={20} color="#10b981" />
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              Recommendations
            </h3>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            background: 'linear-gradient(to bottom, #ecfdf5, #ffffff)', 
            borderRadius: '8px',
            border: '1px solid #a7f3d0'
          }}>
            <FormattedContent content={analysis.recommendations} />
          </div>
        </div>
      )}

      {/* Processing State */}
      {analysis.status === 'PROCESSING' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <RefreshCw 
            size={40} 
            style={{ 
              animation: 'spin 1s linear infinite',
              color: '#3b82f6',
              marginBottom: '1rem'
            }} 
          />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Processing Analysis
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            The AI is analyzing the provided data. This may take a few moments...
          </p>
        </div>
      )}

      {/* Failed State */}
      {analysis.status === 'FAILED' && (
        <div style={{
          background: '#fef2f2',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '0.5rem'
              }}>
                Analysis Failed
              </h3>
              <p style={{ color: '#7f1d1d', margin: 0 }}>
                {analysis.analysisResult || 'An error occurred during analysis'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAnalysisView