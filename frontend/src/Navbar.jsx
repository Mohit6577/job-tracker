function Navbar({ onPageChange }) {
  return (
    <section id="top">
      <button onClick={() => onPageChange('Dashboard')}>Dashboard</button>
      <button onClick={() => onPageChange('Jobs')}>Jobs</button>
      <button onClick={() => onPageChange('Add Job')}>Add Job</button>
      <button onClick={() => onPageChange('Homepage')}>Home</button>
    </section>
  );
}
export default Navbar;
