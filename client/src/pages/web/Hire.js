import React, { useState } from 'react';
import api from '../../api/api';
import { useNotifier } from '../../context/NotificationContext';
import useForm from '../../hooks/useForm';
import '../../assets/css/careers.css';

const Hire = () => {
    const { values, handleChange, handleSubmit } = useForm({
        company_name: '', contact_person: '', email: '', phone: '', role_requested: '', requirements_notes: ''
    }, { company_name: { required: true }, contact_person: { required: true }, email: { required: true } });
    
    const [submitting, setSubmitting] = useState(false);
    const { notify } = useNotifier();

    const onSubmit = async (formValues) => {
        if (!formValues.role_requested) {
            notify({ message: 'Please select a role.', style: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('company_name', formValues.company_name);
            formData.append('contact_person', formValues.contact_person);
            formData.append('email', formValues.email);
            formData.append('phone', formValues.phone);
            formData.append('role_requested', formValues.role_requested);
            formData.append('requirements_notes', formValues.requirements_notes);

            await api.post('/api/v1/client-requests/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            notify({ message: 'Request submitted successfully! We will be in touch.', style: 'success' });
            // Reset form could be handled here
        } catch (error) {
            notify({ message: 'Error submitting request.', style: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="public-page" style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
            <div className="careers-hero">
                <h1>Hire Top Talent</h1>
                <p>Partner with us to find the perfect candidates for your business. Fill out the form below and we will get back to you shortly.</p>
            </div>
            
            <div className="job-details-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                <div className="careers-modal-body" style={{ padding: 0 }}>
                    <form className="form-case" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Company Name *</p>
                                <input type="text" name="company_name" value={values.company_name} onChange={handleChange} required />
                            </div>
                            <div className="input-case" style={{ flex: 1 }}>
                                <p>Contact Person *</p>
                                <input type="text" name="contact_person" value={values.contact_person} onChange={handleChange} required />
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
                                <p>Role Requested *</p>
                                <select name="role_requested" value={values.role_requested} onChange={handleChange} required>
                                    <option value="">Select a Role</option>
                                    <option value="Virtual Assistant">Virtual Assistant</option>
                                    <option value="Medical Biller">Medical Biller</option>
                                    <option value="Customer Support">Customer Support</option>
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        {values.role_requested === 'Others' && (
                            <div className="form-row" style={{ display: 'block' }}>
                                <div className="input-case">
                                    <p>Please specify the role and requirements *</p>
                                    <textarea name="requirements_notes" value={values.requirements_notes} onChange={handleChange} rows="4" required></textarea>
                                </div>
                            </div>
                        )}
                        
                        {values.role_requested !== 'Others' && (
                            <div className="form-row" style={{ display: 'block' }}>
                                <div className="input-case">
                                    <p>Additional Requirements (Optional)</p>
                                    <textarea name="requirements_notes" value={values.requirements_notes} onChange={handleChange} rows="4"></textarea>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '30px', textAlign: 'right' }}>
                            <button type="submit" className="careers-modal-btn-submit" disabled={submitting} style={{ padding: '14px 40px', fontSize: '1.15rem' }}>
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Hire;
