import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Homepage.css';

function Homepage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <main className="homepage">
        <header className="homepage-header">
          <h1>Job Tracker</h1>
          <p>Track your applications. Stay organized. Get hired.</p>
        </header>
        <section className="auth-container">
          <div className="auth-switch">
            <button
              className={showLogin ? 'active' : ''}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={!showLogin ? 'active' : ''}
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
          </div>
          <div className="auth-form">
            {showLogin ? <Login onLogin={onLogin} /> : <Register />}
          </div>
        </section>
      </main>
    </>
  );
}
export default Homepage;
