import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { generateInterviewReport } from '../services/interview.api.js'
import './Home.scss'

const Home = () => {
  const { user } = useAuth()
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const canGenerate = Boolean((jobDescription.trim() || selfDescription.trim()) && resumeFile && !loading)

  const handleFileChange = (event) => {
    setResumeFile(event.target.files?.[0] ?? null)
    setStatus({ type: '', message: '' })
  }

  const handleGenerate = async () => {
    setStatus({ type: '', message: '' })
    setReport(null)

    if (!resumeFile) {
      setStatus({ type: 'error', message: 'Please upload your resume PDF to continue.' })
      return
    }

    if (!jobDescription.trim() && !selfDescription.trim()) {
      setStatus({ type: 'error', message: 'Add your profile details or the job description first.' })
      return
    }

    setLoading(true)

    try {
      const response = await generateInterviewReport({
        resume: resumeFile,
        selfDescription,
        jobDescription,
      })

      setReport(response.interviewReport)
      setStatus({ type: 'success', message: response.message || 'Interview report generated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not generate the interview report.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Resume Builder</p>
          <h1 className="home-hero-title">Create a professional interview report with one upload.</h1>
          <p className="home-hero-copy">
            Upload your resume, enter your personal profile and job details, then generate a polished interview-ready summary from the backend.
          </p>

          <div className="home-hero-stats">
            <div className="home-stat">
              <strong>{user?.username ?? 'Career professional'}</strong>
              <span>Signed in as the current authenticated user.</span>
            </div>
            <div className="home-stat">
              <strong>Ready for the next opportunity</strong>
              <span>Secure session and backend-powered report generation.</span>
            </div>
          </div>
        </div>

        <div className="home-hero-card home-illustration">
          <span>
            Welcome back{user?.username ? `, ${user.username}` : ''}! Use the panel to generate a structured prep report that matches your resume and goals.
          </span>
        </div>
      </section>

      <section className="home-panel">
        <div className="home-panel-summary">
          <h2>How the flow works</h2>
          <p>
            Your resume is parsed by the backend, then the AI-driven service creates interview questions, summary points, and response guidance based on your profile and the job description.
          </p>

          <div className="report-card">
            <h3>Fast prep with professional polish</h3>
            <p>
              Provide both your resume and the role details so the generated report stays aligned with the job you want. The system helps you transform raw experience into a crisp interview narrative.
            </p>
          </div>
        </div>

        <div className="home-panel-form">
          <h2>Create your report</h2>

          <div className="home-input-group">
            <label htmlFor="resume">Resume PDF</label>
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>

          <div className="home-input-group">
            <label htmlFor="selfDescription">Professional summary</label>
            <textarea
              id="selfDescription"
              className="home-textarea"
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
              placeholder="Add your title, strengths, experience highlights, and what you want the hiring team to know."
            />
          </div>

          <div className="home-input-group">
            <label htmlFor="jobDescription">Job description or hiring prompt</label>
            <textarea
              id="jobDescription"
              className="home-textarea"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job posting, role overview, or interview briefing here."
            />
          </div>

          <div className="home-action">
            <button type="button" onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? 'Generating…' : 'Generate Interview Report'}
            </button>
            <p className="home-note">
              Fill in the resume plus one of the description fields for the best report results.
            </p>
          </div>

          {status.message ? (
            <div className={`home-status ${status.type}`} role="status">
              {status.message}
            </div>
          ) : null}

          {report ? (
            <div className="report-card report-section">
              <h3>Interview report details</h3>

              <div className="report-details">
                <div className="report-block">
                  <span>Match score</span>
                  <strong>{report.matchScore ?? 'N/A'}%</strong>
                </div>
                <div className="report-block">
                  <span>Role</span>
                  <strong>{report.title ?? (report.jobDescription ? 'Role preview available' : '—')}</strong>
                </div>
              </div>

              {Array.isArray(report.technicalQuestions) && report.technicalQuestions.length > 0 ? (
                <div className="report-section">
                  <h4>Technical questions</h4>
                  {report.technicalQuestions.slice(0, 3).map((item, index) => (
                    <div key={`tech-${index}`} className="report-card report-block">
                      <strong>{item.question}</strong>
                      <p>{item.intention}</p>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {Array.isArray(report.behavioralQuestions) && report.behavioralQuestions.length > 0 ? (
                <div className="report-section">
                  <h4>Behavioral questions</h4>
                  {report.behavioralQuestions.slice(0, 3).map((item, index) => (
                    <div key={`beh-${index}`} className="report-card report-block">
                      <strong>{item.question}</strong>
                      <p>{item.intention}</p>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {Array.isArray(report.skillGaps) && report.skillGaps.length > 0 ? (
                <div className="report-section">
                  <h4>Skill gaps</h4>
                  <div className="report-details">
                    {report.skillGaps.slice(0, 4).map((gap, index) => (
                      <div key={`gap-${index}`} className="report-block">
                        <strong>{gap.skill}</strong>
                        <span>{gap.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {Array.isArray(report.preparationPlan) && report.preparationPlan.length > 0 ? (
                <div className="report-section">
                  <h4>Preparation plan</h4>
                  {report.preparationPlan.map((step, index) => (
                    <div key={`plan-${index}`} className="report-card report-block">
                      <strong>Day {step.day}: {step.focus}</strong>
                      <p>{step.tasks?.join(' • ')}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default Home