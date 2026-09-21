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

  const [editingJob, setEditingJob] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await apiFetch('/api/jobs');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch jobs');
        }

        setJobs(data.data || []);
        setPagination(data.pagination || null);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);

        setToast({
          message: error.message || 'Failed to load applications',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  function getStatusClass(status) {
    return status?.toLowerCase() || '';
  }

  function selectJob(job) {
    setSelectedJob(job);
  }

  function closeEditModal() {
    if (!editLoading) {
      setEditingJob(null);
    }
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditingJob((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!editingJob) return;

    setEditLoading(true);

    try {
      const response = await apiFetch(
        `/api/jobs/${editingJob._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company: editingJob.company,
            position: editingJob.position,
            status: editingJob.status,
            location: editingJob.location,
            notes: editingJob.notes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || 'Failed to update application',
          type: 'error',
        });

        return;
      }

      const updatedJob = data;

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job,
        ),
      );

      setSelectedJob(updatedJob);
      setEditingJob(null);

      setToast({
        message: 'Application updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Edit job error:', error);

      setToast({
        message: 'Something went wrong',
        type: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  }

  function openDeleteModal() {
    if (!selectedJob) return;

    setDeleteTarget(selectedJob);
  }

  function closeDeleteModal() {
    if (!deleteLoading) {
      setDeleteTarget(null);
    }
  }

  async function handleDeleteJob() {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      const response = await apiFetch(
        `/api/jobs/${deleteTarget._id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        let message = 'Failed to delete application';

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Response did not contain JSON.
        }

        setToast({
          message,
          type: 'error',
        });

        return;
      }

      const deletedJobId = deleteTarget._id;

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== deletedJobId),
      );

      setSelectedJob((current) =>
        current?._id === deletedJobId ? null : current,
      );

      setPagination((current) =>
        current
          ? {
              ...current,
              totalJobs: Math.max(0, current.totalJobs - 1),
            }
          : current,
      );

      setDeleteTarget(null);

      setToast({
        message: 'Application deleted successfully',
        type: 'success',
      });
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

    const matchesStatus =
      statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="jobs-page">
      <div className="jobs-container">

        <header className="jobs-header">
          <div>
            <span className="jobs-eyebrow">APPLICATIONS</span>

            <h1>Jobs</h1>

            <p>
              Track and manage your job applications.
            </p>
          </div>

          <div className="jobs-total">
            <strong>
              {pagination?.totalJobs ?? jobs.length}
            </strong>

            <span>applications</span>
          </div>
        </header>

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
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="status-filter">
            <button
              type="button"
              className={`status-trigger ${
                statusOpen ? 'open' : ''
              }`}
              onClick={() => setStatusOpen((current) => !current)}
            >
              <span>
                {statusFilter === 'All'
                  ? 'Status'
                  : statusFilter}
              </span>

              <svg
                className="chevron"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m7 10 5 5 5-5" />
              </svg>
            </button>

            {statusOpen && (
              <div className="status-menu">
                {STATUSES.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={
                      statusFilter === status ? 'active' : ''
                    }
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusOpen(false);
                    }}
                  >
                    <span>
                      {status === 'All' ? 'All statuses' : status}
                    </span>

                    {statusFilter === status && (
                      <svg viewBox="0 0 24 24">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="jobs-layout">

          <section className="jobs-card">

            <div className="jobs-card-header">
              <div>
                <h2>Applications</h2>

                <span>
                  {filteredJobs.length}{' '}
                  {filteredJobs.length === 1
                    ? 'application'
                    : 'applications'}
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

                <p>
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <div className="job-list">
                {filteredJobs.map((job) => (
                  <button
                    type="button"
                    key={job._id}
                    className={`job-item ${
                      selectedJob?._id === job._id
                        ? 'selected'
                        : ''
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

                      <span>
                        {job.location || 'Remote'}
                      </span>
                    </div>

                    <span
                      className={`job-status ${getStatusClass(
                        job.status,
                      )}`}
                    >
                      <i />
                      {job.status}
                    </span>

                    <svg
                      className="row-arrow"
                      viewBox="0 0 24 24"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </section>

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

                <p>
                  Choose an application from the list to view
                  its details.
                </p>
              </div>
            ) : (
              <>
                <div className="details-header">
                  <div className="details-company">
                    <div className="details-logo">
                      {selectedJob.company
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <span>APPLICATION</span>

                      <h2>{selectedJob.company}</h2>

                      <p>{selectedJob.position}</p>
                    </div>
                  </div>

                  <button
                    type="button"
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
                    type="button"
                    className="edit-btn"
                    onClick={() => setEditingJob(selectedJob)}
                  >
                    Edit application
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={openDeleteModal}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      {editingJob && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <form
            className="edit-modal"
            onSubmit={handleEditSubmit}
          >
            <div className="edit-modal-header">
              <div>
                <span>EDIT APPLICATION</span>
                <h2>Update application</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <div className="edit-form-grid">

              <div className="edit-field">
                <label htmlFor="company">Company</label>

                <input
                  id="company"
                  name="company"
                  value={editingJob.company || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="edit-field">
                <label htmlFor="position">Position</label>

                <input
                  id="position"
                  name="position"
                  value={editingJob.position || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="edit-field">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={editingJob.status || 'Applied'}
                  onChange={handleEditChange}
                >
                  {STATUSES.slice(1).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-field">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  name="location"
                  value={editingJob.location || ''}
                  onChange={handleEditChange}
                  placeholder="Remote / City"
                />
              </div>

              <div className="edit-field edit-field-full">
                <label htmlFor="notes">Notes</label>

                <textarea
                  id="notes"
                  name="notes"
                  value={editingJob.notes || ''}
                  onChange={handleEditChange}
                  placeholder="Add notes..."
                />
              </div>
            </div>

            <div className="edit-modal-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={closeEditModal}
                disabled={editLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="delete-modal">

            <div className="delete-icon">!</div>

            <h2>Delete application?</h2>

            <p>
              You're about to delete
              <strong>
                {' '}
                {deleteTarget.company} — {deleteTarget.position}
              </strong>
              .
            </p>

            <p className="delete-warning">
              This action cannot be undone.
            </p>

            <div className="delete-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-btn"
                onClick={handleDeleteJob}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}

export default Jobs;