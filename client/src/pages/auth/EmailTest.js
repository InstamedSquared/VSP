import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';

const EmailTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleTestEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter an email address.');
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/auth/test-email', { email });
      
      if (response.data.success) {
        setMessage('Test email sent successfully! Check your inbox.');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(response.data.message || 'Failed to send test email.');
        setMessageType('error');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Network error occurred.';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Email Server Test</h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
        Test the email server configuration by sending a test email to any address.
      </p>

      {message && (
        <p style={{ 
          color: messageType === 'success' ? '#28a745' : '#dc3545',
          textAlign: 'center', 
          background: messageType === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
          padding: '0.5rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <Icon 
            icon={messageType === 'success' ? icons.successCircle : icons.warning} 
            style={{ marginRight: '8px' }} 
          />
          {message}
        </p>
      )}

      <form onSubmit={handleTestEmail}>
        <div className="input-group">
          <Icon icon={icons.user} className="input-icon" />
          <input
            type="email"
            className="input-field"
            placeholder="Enter email address to test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          <Icon icon={icons.user} style={{ marginRight: '8px' }} />
          {loading ? 'Sending Test Email...' : 'Send Test Email'}
        </button>
      </form>

      <div style={{ 
        background: '#e9ecef', 
        padding: '1rem', 
        borderRadius: '5px', 
        marginTop: '1.5rem',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Email Configuration:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#6c757d' }}>
          <li>Host: smtp.gmail.com</li>
          <li>Port: 587</li>
          <li>Security: TLS</li>
          <li>From: emailsystem.ino@gmail.com</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            <Icon icon={icons.login} style={{ marginRight: '5px' }} />
            Back to Login
          </a>
        </div>
        <div>
          <a href="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
            <Icon icon={icons.key} style={{ marginRight: '5px' }} />
            Test Forgot Password
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;