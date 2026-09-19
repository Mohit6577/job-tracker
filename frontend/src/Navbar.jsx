import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Job Tracker</h1>
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate('/')}>Dashboard</button>

        <button onClick={() => navigate('/jobs')}>Jobs</button>

        <button onClick={() => navigate('/add-job')}>Add Job</button>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
