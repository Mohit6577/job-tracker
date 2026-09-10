import { useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Addjob from './Addjob';
import Homepage from './Homepage';

function App() {
  const [selectedPage, setSelectedPage] = useState('');
  function handlePageChange(page) {
    setSelectedPage(page);
  }
  return (
    <section id="center">
      {selectedPage !== '' && <Navbar onPageChange={handlePageChange} />}

      <div>
        {selectedPage === 'Dashboard' ? (
          <Dashboard />
        ) : selectedPage === 'Jobs' ? (
          <Jobs />
        ) : selectedPage === 'Add Job' ? (
          <Addjob />
        ) : (
          <Homepage />
        )}
      </div>
    </section>
  );
}

export default App;
