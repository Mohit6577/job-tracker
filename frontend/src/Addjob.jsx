import { useState } from 'react';
import apiFetch from './api';
import Toast from './Toast';
import './Addjob.css';

function Addjob() {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) {
      setToast({
        message: 'Company and position are required',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || 'Failed to add job',
          type: 'error',
        });
        return;
      }

      setToast({
        message: 'Job added successfully',
        type: 'success',
      });

      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.log(error);

      setToast({
        message: 'Something went wrong',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="add-job">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="add-job-header">
        <p className="add-job-eyebrow">NEW APPLICATION</p>
        <h1>Add Job</h1>
        <p>Track a new job application.</p>
      </div>

      <form className="add-job-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Google"
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Lisbon, Portugal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about this application..."
            rows="5"
          />
        </div>

        <button className="add-job-submit" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Job'}
        </button>
      </form>
    </main>
  );
}

export default Addjob;
