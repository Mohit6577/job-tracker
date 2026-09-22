import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiFetch from './api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const response = await apiFetch('/api/jobs/stats');

      const data = await response.json();

      setStats(data.stats);
    }
    fetchStats();
  }, []);

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>
          <h1>Welcome back 👋</h1>
          <p className="dashboard-subtitle">
            Here's how your job search is looking.
          </p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card applied">
          <div className="stat-card-top">
            <span className="stat-label">Applied</span>
            <span className="stat-icon">↗</span>
          </div>
          <h2>{stats?.Applied ?? 0}</h2>
          <p>Applications sent</p>
        </div>

        <div className="stat-card interview">
          <div className="stat-card-top">
            <span className="stat-label">Interview</span>
            <span className="stat-icon">◆</span>
          </div>
          <h2>{stats?.Interview ?? 0}</h2>
          <p>Interviews in progress</p>
        </div>

        <div className="stat-card offer">
          <div className="stat-card-top">
            <span className="stat-label">Offers</span>
            <span className="stat-icon">★</span>
          </div>
          <h2>{stats?.Offer ?? 0}</h2>
          <p>Offers received</p>
        </div>

        <div className="stat-card accepted">
          <div className="stat-card-top">
            <span className="stat-label">Accepted</span>
            <span className="stat-icon">✓</span>
          </div>
          <h2>{stats?.Accepted ?? 0}</h2>
          <p>Jobs accepted</p>
        </div>

        <div className="stat-card rejected">
          <div className="stat-card-top">
            <span className="stat-label">Rejected</span>
            <span className="stat-icon">×</span>
          </div>
          <h2>{stats?.Rejected ?? 0}</h2>
          <p>Applications rejected</p>
        </div>
      </section>

      <section className="dashboard-empty">
        <Link to="/add-job" className="empty-icon">
          +
        </Link>
        <h2>Your job search starts here</h2>
        <p>Add your first application and start tracking your progress.</p>
      </section>
    </main>
  );
}
export default Dashboard;
