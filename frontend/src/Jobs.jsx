import { useEffect, useState } from 'react';
import apiFetch from './api';
import Toast from './Toast';
import './Jobs.css';

const STATUSES = [
  'All',
  'Applied',
  'Interview',
  'Rejected',
  'Offer',
  'Accepted',
];

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [statusOpen, setStatusOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingJob, setEditingJob] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  //Delete state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await apiFetch('/api/jobs');
        const data = await response.json();

        setJobs(data.data || []);
        setPagination(data.pagination || null);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  function selectJob(job) {
    setSelectedJob(job);
  }

  function getStatusClass(status) {
    return status.toLowerCase();
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    setEditLoading(true);

    const formData = new FormData(e.target);

    const updatedJob = {
      company: formData.get('company'),
      position: formData.get('position'),
      status: formData.get('status'),
      location: formData.get('location'),
      notes: formData.get('notes'),
    };

    try {
      const response = await apiFetch(`/api/jobs/${editingJob._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJob),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || 'Failed to update application',
          type: 'error',
        });

        return;
      }

      // Backend returns the updated job directly.
      setJobs((currentJobs) =>
        currentJobs.map((job) => (job._id === data._id ? data : job)),
      );

      setSelectedJob(data);
      setEditingJob(null);

      setToast({
        message: 'Application updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Update job error:', error);

      setToast({
        message: 'Something went wrong',
        type: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteJob() {
    if (!selectedJob) return;

    setDeleteLoading(true);

    try {
      const response = await apiFetch(`/api/jobs/${selectedJob._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || 'Failed to delete application',
          type: 'error',
        });
        return;
      }

      const deletedJobId = selectedJob._id;

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== deletedJobId),
      );

      setSelectedJob(null);

      setPagination((current) =>
        current
          ? {
              ...current,
              totalJobs: Math.max(0, current.totalJobs - 1),
            }
          : current,
      );

      setToast({
        message: 'Application deleted successfully',
        type: 'success',
      });

      setDeleteModal(false);
    } catch (error) {
      console.error('Delete job error:', error);

      setToast({
        message: 'Something went wrong',
        type: 'error',
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      job.company?.toLowerCase().includes(query) ||
      job.position?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <header className="jobs-header">
          <div>
            <h1>Jobs</h1>
            <p>Track and manage your job applications.</p>
          </div>

          <div className="jobs-total">
            <strong>{pagination?.totalJobs ?? jobs.length}</strong>

            <span>applications</span>
          </div>
        </header>

        {/* Toolbar */}
        <div className="jobs-toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="clear-search" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="status-filter">
            <button
              className={`status-trigger ${statusOpen ? 'open' : ''}`}
              onClick={() => setStatusOpen((prev) => !prev)}
            >
              <span>{statusFilter === 'All' ? 'Status' : statusFilter}</span>

              <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </button>

            {statusOpen && (
              <div className="status-menu">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    className={statusFilter === status ? 'active' : ''}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusOpen(false);
                    }}
                  >
                    <span>{status}</span>

                    {statusFilter === status && (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="jobs-layout">
          {/* Applications */}
          <section className="jobs-card">
            <div className="jobs-card-header">
              <div>
                <h2>Applications</h2>

                <span>
                  {filteredJobs.length}{' '}
                  {filteredJobs.length === 1 ? 'application' : 'applications'}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="jobs-state">
                <div className="spinner" />
                <p>Loading applications...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="jobs-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 5 5" />
                  </svg>
                </div>

                <h3>No applications found</h3>

                <p>Try changing your search or status filter.</p>
              </div>
            ) : (
              <div className="job-list">
                {filteredJobs.map((job) => (
                  <button
                    key={job._id}
                    className={`job-item ${
                      selectedJob?._id === job._id ? 'selected' : ''
                    }`}
                    onClick={() => selectJob(job)}
                  >
                    <div className="company-logo">
                      {job.company?.charAt(0).toUpperCase()}
                    </div>

                    <div className="job-main">
                      <strong>{job.company}</strong>
                      <span>{job.position}</span>
                    </div>

                    <div className="job-location">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                        <circle cx="12" cy="9" r="2.2" />
                      </svg>

                      <span>{job.location || 'Remote'}</span>
                    </div>

                    <span
                      className={`job-status ${getStatusClass(job.status)}`}
                    >
                      <i />
                      {job.status}
                    </span>

                    <svg className="row-arrow" viewBox="0 0 24 24">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <aside className="job-details-card">
            {!selectedJob ? (
              <div className="details-empty">
                <div className="details-empty-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                    <path d="M9 8h6M9 12h6M9 16h4" />
                  </svg>
                </div>

                <h3>Select an application</h3>

                <p>Choose an application from the list to view its details.</p>
              </div>
            ) : (
              <>
                <div className="details-header">
                  <div className="details-company">
                    <div className="details-logo">
                      {selectedJob.company?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <span>APPLICATION</span>

                      <h2>{selectedJob.company}</h2>

                      <p>{selectedJob.position}</p>
                    </div>
                  </div>

                  <button
                    className="close-details"
                    onClick={() => setSelectedJob(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="details-body">
                  <div className="details-status-row">
                    <span
                      className={`job-status ${getStatusClass(
                        selectedJob.status,
                      )}`}
                    >
                      <i />
                      {selectedJob.status}
                    </span>
                  </div>

                  <div className="detail-block">
                    <span>LOCATION</span>

                    <div className="detail-value">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                        <circle cx="12" cy="9" r="2.2" />
                      </svg>

                      {selectedJob.location || 'Not specified'}
                    </div>
                  </div>

                  <div className="detail-block">
                    <span>NOTES</span>

                    <p className="notes">
                      {selectedJob.notes ||
                        'No notes added for this application.'}
                    </p>
                  </div>

                  <div className="detail-block">
                    <span>APPLICATION ID</span>

                    <code>{selectedJob._id}</code>
                  </div>
                </div>

                <div className="details-footer">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingJob(selectedJob)}
                  >
                    Edit application
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => setDeleteModal(true)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
        {deleteModal && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-icon">!</div>

              <h2>Delete application?</h2>

              <p>
                Are you sure you want to delete{' '}
                <strong>
                  {selectedJob?.company} — {selectedJob?.position}
                </strong>
                ?
              </p>

              <p className="delete-warning">This action cannot be undone.</p>

              <div className="delete-modal-actions">
                <button
                  className="cancel-delete-btn"
                  onClick={() => setDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={handleDeleteJob}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Application'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editingJob && (
          <div
            className="edit-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setEditingJob(null);
              }
            }}
          >
            <div className="edit-modal">
              <div className="edit-modal-header">
                <div>
                  <span>EDIT APPLICATION</span>
                  <h2>Edit application</h2>
                </div>

                <button
                  type="button"
                  className="edit-modal-close"
                  onClick={() => setEditingJob(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="edit-form-grid">
                  <div className="edit-field">
                    <label htmlFor="edit-company">Company</label>

                    <input
                      id="edit-company"
                      name="company"
                      defaultValue={editingJob.company}
                      required
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="edit-position">Position</label>

                    <input
                      id="edit-position"
                      name="position"
                      defaultValue={editingJob.position}
                      required
                    />
                  </div>

                  <div className="edit-field">
                    <label htmlFor="edit-status">Status</label>

                    <select
                      id="edit-status"
                      name="status"
                      defaultValue={editingJob.status}
                    >
                      <option value="Applied">Applied</option>

                      <option value="Interview">Interview</option>

                      <option value="Rejected">Rejected</option>

                      <option value="Offer">Offer</option>

                      <option value="Accepted">Accepted</option>
                    </select>
                  </div>

                  <div className="edit-field">
                    <label htmlFor="edit-location">Location</label>

                    <input
                      id="edit-location"
                      name="location"
                      defaultValue={editingJob.location || ''}
                    />
                  </div>

                  <div className="edit-field edit-field-full">
                    <label htmlFor="edit-notes">Notes</label>

                    <textarea
                      id="edit-notes"
                      name="notes"
                      defaultValue={editingJob.notes || ''}
                      rows="5"
                    />
                  </div>
                </div>

                <div className="edit-modal-footer">
                  <button
                    type="button"
                    className="cancel-edit"
                    onClick={() => setEditingJob(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-edit"
                    disabled={editLoading}
                  >
                    {editLoading ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </main>
  );
}

export default Jobs;
