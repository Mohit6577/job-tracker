import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Addjob from './Addjob';
import Homepage from './Homepage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token'),
  );

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }
  return (
    <BrowserRouter>
      <section id="center">
        {!isLoggedIn ? (
          <Homepage onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <>
            <Navbar onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/add-job" element={<Addjob />} />
            </Routes>
          </>
        )}
      </section>
    </BrowserRouter>
  );
}

export default App;
