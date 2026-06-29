import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { useNotifier } from '../../context/NotificationContext';
import useForm from '../../hooks/useForm';
import '../../assets/css/careers.css';
import '../../assets/css/careers_modal.css'; // Import the new modal CSS

const ApplicationModal = ({ job, onClose }) => {
    const { values, errors, handleChange, handleSubmit } = useForm({
        fn: '', mn: '', sn: '', email: '', phone: '', gender: '', bday: '', cover_letter: ''
    }, { fn: { required: true }, sn: { required: true }, email: { required: true } });
    const [resume, setResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { notify } = useNotifier();

    const onSubmit = async (formValues) => {
        if (!resume) {
            notify({ message: 'Please attach your resume.', style: 'error' });
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('id_job_posting', job.id);
            formData.append('fn', formValues.fn);
            formData.append('mn', formValues.mn);
            formData.append('sn', formValues.sn);
            formData.append('email', formValues.email);
            formData.append('phone', formValues.phone);
            formData.append('gender', formValues.gender);
            formData.append('bday', formValues.bday);
            formData.append('cover_letter', formValues.cover_letter);
            formData.append('resume', resume);

            await api.post('/api/v1/recruitment/public-apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            notify({ message: 'Application submitted successfully! We will be in touch.', style: 'success' });
            onClose();
        } catch (error) {
            notify({ message: 'Error submitting application.', style: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="careers-modal-overlay">
            <div className="careers-modal-content">
                <div className="careers-modal-header">
                    <h3>Apply for {job.title}</h3>
                    <button type="button" className="careers-modal-close" onClick={onClose}>
                        <i className="fi fi-rr-cross"></i>
                    </button>
                </div>
                <div className="careers-modal-body">
                    <form className="form-case" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>First Name *</p>
                                <input type="text" name="fn" value={values.fn} onChange={handleChange} required />
                            </div>
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Middle Name</p>
                                <input type="text" name="mn" value={values.mn} onChange={handleChange} />
                            </div>
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Last Name *</p>
                                <input type="text" name="sn" value={values.sn} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Gender</p>
                                <select name="gender" value={values.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Birthday</p>
                                <input type="date" name="bday" value={values.bday} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Email Address *</p>
                                <input type="email" name="email" value={values.email} onChange={handleChange} required />
                            </div>
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Phone Number</p>
                                <input type="text" name="phone" value={values.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row" style={{ display: 'block' }}>
                            <div className="input-case">
                                <p>Cover Letter (Optional)</p>
                                <textarea name="cover_letter" value={values.cover_letter} onChange={handleChange} rows="4"></textarea>
                            </div>
                        </div>
                        <div className="form-row" style={{ display: 'block' }}>
                            <div className="input-case">
                                <p>Resume / CV (Required)</p>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} required />
                            </div>
                        </div>
                        <div className="careers-modal-footer">
                            <button type="button" className="careers-modal-btn-cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="careers-modal-btn-submit" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const { notify } = useNotifier();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Public endpoint
                const res = await api.get('/api/v1/recruitment/public-jobs');
                if (res.data && res.data.data) {
                    setJobs(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching careers", error);
                notify({ message: 'Failed to load open positions.', style: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [notify]);

    return (
        <div className="public-page" style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
            {showApplyModal && selectedJob && (
                <ApplicationModal job={selectedJob} onClose={() => setShowApplyModal(false)} />
            )}

            <div className="careers-hero">
                <h1>Join Our Team</h1>
                <p>We're always looking for talented individuals to join our growing team. Find a position that fits your skills below.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#64748b' }}>
                    <i className="fi fi-rr-spinner fi-spin" style={{ marginRight: '10px' }}></i> Loading open positions...
                </div>
            ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 40px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '10px' }}>No open positions at the moment.</h3>
                    <p style={{ color: '#64748b' }}>Please check back later!</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    <div className="jobs-list">
                        {jobs.map(job => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
                            >
                                <h3>{job.title}</h3>
                                <div className="job-tags">
                                    {job.location && <span className="job-tag"><i className="fi fi-rr-marker"></i> {job.location}</span>}
                                    {job.department && <span className="job-tag"><i className="fi fi-rr-briefcase"></i> {job.department}</span>}
                                    {job.salary_range && <span className="job-tag salary"><i className="fi fi-rr-dollar"></i> {job.salary_range}</span>}
                                </div>
                                <div className="job-meta">
                                    <span>{job.employment_type ? job.employment_type.replace('_', ' ').toUpperCase() : ''}</span>
                                    <span>Posted {moment(job.created_at).fromNow()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedJob && (
                        <div className="job-details-panel">
                            <div className="job-details-header">
                                <div>
                                    <h2 className="job-details-title">{selectedJob.title}</h2>
                                    <div className="job-details-meta">
                                        {selectedJob.department && <span className="job-tag"><strong>Department:</strong> {selectedJob.department}</span>}
                                        {selectedJob.location && <span className="job-tag"><strong>Location:</strong> {selectedJob.location}</span>}
                                        {selectedJob.employment_type && <span className="job-tag"><strong>Type:</strong> {selectedJob.employment_type.replace('_', ' ')}</span>}
                                        {selectedJob.salary_range && <span className="job-tag salary"><strong>Salary:</strong> {selectedJob.salary_range}</span>}
                                    </div>
                                </div>
                                <button className="btn-apply" onClick={() => setShowApplyModal(true)}>
                                    Apply Now
                                </button>
                            </div>

                            <hr style={{ border: 'none', borderTop: '2px solid #e2e8f0', margin: '30px 0' }} />

                            {selectedJob.description && (
                                <div className="job-section">
                                    <h3>Job Description</h3>
                                    <div className="job-content tiptap-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedJob.description) }} />
                                </div>
                            )}

                            {selectedJob.requirements && (
                                <div className="job-section">
                                    <h3>Requirements</h3>
                                    <div className="job-content tiptap-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedJob.requirements) }} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Careers;
