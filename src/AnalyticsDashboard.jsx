import { useEffect, useState } from 'react'
import {
  Activity,
  Eye,
  Users,
  RefreshCw,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import './AnalyticsDashboard.css'

const API_URL = import.meta.env.VITE_API_BASE_URL

function getDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = useState(getDate(6))
  const [endDate, setEndDate] = useState(getDate(0))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      const query = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      const response = await fetch(
        `${API_URL}/analytics/dashboard?${query.toString()}`,
        {
          headers: { Accept: 'application/json' },
        },
      )

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message || 'Could not load analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const summary = data?.summary ?? {
    total_events: 0,
    page_views: 0,
    unique_visitors: 0,
  }

  const traffic = (data?.traffic ?? []).map((item) => ({
    ...item,
    date: item.date.slice(5),
  }))

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div>
          <div className="analytics-eyebrow">URBAN BITES · INSIGHTS</div>
          <h1>Analytics Dashboard</h1>
          <p>Understand your website traffic and visitor activity.</p>
        </div>

        <button
          className="analytics-refresh"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      <section className="analytics-filters">
        <label>
          <CalendarDays size={17} />
          Start date
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>

        <label>
          <CalendarDays size={17} />
          End date
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={getDate(0)}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>

        <button
          className="analytics-apply"
          onClick={loadDashboard}
          disabled={loading}
        >
          Apply filters
        </button>
      </section>

      {error && (
        <div className="analytics-error">
          {error}
          <button onClick={loadDashboard}>Try again</button>
        </div>
      )}

      <section className="analytics-cards">
        <article className="analytics-card">
          <div className="analytics-card-top">
            <span>Total Events</span>
            <Activity size={21} />
          </div>
          <strong>{summary.total_events.toLocaleString()}</strong>
          <small>All tracked events in this period</small>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-top">
            <span>Page Views</span>
            <Eye size={21} />
          </div>
          <strong>{summary.page_views.toLocaleString()}</strong>
          <small>Recorded page visits</small>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-top">
            <span>Unique Visitors</span>
            <Users size={21} />
          </div>
          <strong>{summary.unique_visitors.toLocaleString()}</strong>
          <small>Distinct visitor IDs in this period</small>
        </article>
      </section>

      <section className="analytics-panel">
        <div className="analytics-panel-heading">
          <div>
            <h2>Website Traffic</h2>
            <p>Page views by day</p>
          </div>
          <TrendingUp size={22} />
        </div>

        <div className="analytics-chart">
          {traffic.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="page_views"
                  name="Page Views"
                  stroke="#ed7845"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="analytics-empty">
              No page views found for this period.
            </div>
          )}
        </div>
      </section>

      <section className="analytics-panel">
        <div className="analytics-panel-heading">
          <div>
            <h2>Popular Pages</h2>
            <p>Pages with the most recorded views</p>
          </div>
        </div>

        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Page URL</th>
                <th>Page Views</th>
              </tr>
            </thead>
            <tbody>
              {(data?.popular_pages ?? []).length > 0 ? (
                data.popular_pages.map((page, index) => (
                  <tr key={`${page.page_url}-${index}`}>
                    <td>{page.page_url || '(unknown)'}</td>
                    <td>{page.views.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No page-view data available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
