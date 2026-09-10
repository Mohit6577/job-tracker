import { useEffect, useState } from 'react';
import './Jobs.css';
function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {}, []);

  function handleJobId(id) {
    setSelectedJob(id);
  }
  function findJob(id) {
    return jobs.find((job) => {
      return job.id === id;
    });
  }

  const selectedJobData = findJob(selectedJob);

  return (
    <>
      <h1>Jobs page</h1>
      <h3>Here you can view your applications</h3>
      {jobs.map((job) => {
        return (
          <div
            key={job.id}
            className={
              job.id === selectedJob ? 'job-card selected' : 'job-card'
            }
          >
            <button onClick={() => handleJobId(job.id)}>{job.company}</button>
            <p>{job.position}</p>
            <p className={`status ${job.status.toLowerCase()}`}>{job.status}</p>
            <p>{job.location}</p>
          </div>
        );
      })}
      <br />
      <p>Selected Job is: {selectedJob}</p>
      {selectedJobData && (
        <div>
          <h2>{selectedJobData.company}</h2>
          <p>{selectedJobData.position}</p>
          <p>{selectedJobData.status}</p>
          <p>{selectedJobData.location}</p>
        </div>
      )}
    </>
  );
}
export default Jobs;
