import React, { useState } from 'react';
import api from '../../api/api';
import { useNotifier } from '../../context/NotificationContext';
import useForm from '../../hooks/useForm';
import '../../assets/css/hire.css';

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
            // Ideally reset form here
        } catch (error) {
            notify({ message: 'Error submitting request.', style: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="hire-page-wrapper">
            <div className="hire-container">
                {/* Left Panel: Branding & Value Prop */}
                <div className="hire-left-panel">
                    <h1 className="hire-title">Build Your Dream Team.</h1>
                    <p className="hire-subtitle">Partner with Vital Solution Partners to find top-tier talent tailored to your business needs.</p>
                    
                    <ul className="hire-features">
                        <li><i className="fi fi-rr-star"></i> Access the top 1% of global talent</li>
                        <li><i className="fi fi-rr-rocket-lunch"></i> Fast and seamless onboarding process</li>
                        <li><i className="fi fi-rr-headset"></i> Dedicated 24/7 account support</li>
                    </ul>

                    <div className="hire-trust">
                        <p>Trusted by industry leaders</p>
                        <div className="hire-trust-logos">
                            <span>TechCorp</span>
                            <span>GlobalHealth</span>
                            <span>FinServe</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: The Form */}
                <div className="hire-form-panel">
                    <h3>Let's get started</h3>
                    <p>Fill out the form below and our team will contact you within 24 hours.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="hire-row">
                            <div className="hire-input-group">
                                <label>Company Name *</label>
                                <input type="text" name="company_name" value={values.company_name} onChange={handleChange} required placeholder="Acme Inc." />
                            </div>
                            <div className="hire-input-group">
                                <label>Contact Person *</label>
                                <input type="text" name="contact_person" value={values.contact_person} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="hire-row">
                            <div className="hire-input-group">
                                <label>Work Email *</label>
                                <input type="email" name="email" value={values.email} onChange={handleChange} required placeholder="john@acme.com" />
                            </div>
                            <div className="hire-input-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" value={values.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>

                        <div className="hire-input-group">
                            <label>Role Requested *</label>
                            <select name="role_requested" value={values.role_requested} onChange={handleChange} required>
                                <option value="">Select a Role...</option>
                                <option value="Virtual Assistant">Virtual Assistant</option>
                                <option value="Medical Biller">Medical Biller</option>
                                <option value="Customer Support">Customer Support</option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {values.role_requested === 'Others' ? (
                            <div className="hire-input-group">
                                <label>Please specify the role and requirements *</label>
                                <textarea name="requirements_notes" value={values.requirements_notes} onChange={handleChange} required placeholder="Describe the role and responsibilities..."></textarea>
                            </div>
                        ) : (
                            <div className="hire-input-group">
                                <label>Additional Requirements (Optional)</label>
                                <textarea name="requirements_notes" value={values.requirements_notes} onChange={handleChange} placeholder="Any specific skills, timezones, or software requirements..."></textarea>
                            </div>
                        )}

                        <button type="submit" className="hire-btn-submit" disabled={submitting}>
                            {submitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    Submit Request <i className="fi fi-rr-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Hire;
