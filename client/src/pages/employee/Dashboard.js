import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';
import { useNotifier } from '../../context/NotificationContext';

const Dashboard = () => {
    const { user } = useAuth();
    const { notify } = useNotifier();
    const [isReprofiling, setIsReprofiling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) { setIsLoading(false); return; }
        // Fetch current bench status
        api.get('/api/v1/workforce/my-bench')
            .then(res => {
                if (res.data.success && res.data.data) {
                    const myBenchStatus = res.data.data;
                    if (myBenchStatus.status === 'available') {
                        setIsReprofiling(true);
                    }
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [user]);

    const handleReprofileToggle = async (e) => {
        const newValue = e.target.checked;
        setIsReprofiling(newValue);
        
        try {
            const res = await api.patch('/api/v1/workforce/my-bench/reprofile', { is_reprofiling: newValue });
            if (res.data.success) {
                notify({ message: newValue ? 'You are now marked as available for reprofiling.' : 'You have been removed from the reprofiling bench.', style: 'success' });
            } else {
                setIsReprofiling(!newValue);
                notify({ message: 'Failed to update status', style: 'error' });
            }
        } catch (error) {
            setIsReprofiling(!newValue);
            notify({ message: 'An error occurred while updating your status.', style: 'error' });
        }
    };

    return (
        <div className="admin-pager">
            <header className="admin-pager-head">
                <div className="admin-pager-title">
                    <span>
                        <h2>Employee Dashboard</h2>
                        <p>Welcome back, {user.fn}</p>
                    </span>
                </div>
            </header>

            <div className="wrap-flex" style={{ padding: '20px' }}>
                <div style={{ backgroundColor: 'var(--table-bg, #ffffff)', color: 'var(--text-color, #333)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: 1, maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>Availability Status</h3>
                            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9em' }}>Let HR know you are available for a new client project.</p>
                        </div>
                        <i className="fi fi-rr-user" style={{ fontSize: '2em', color: '#10b981' }}></i>
                    </div>
                    
                    {isLoading ? (
                        <p>Loading status...</p>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px', padding: '15px', backgroundColor: 'var(--input-bg, #f8f9fa)', borderRadius: '8px', border: '1px solid var(--border-color, #e5e7eb)' }}>
                            <div className="toggle-switch radius">
                                <label>
                                    <input type="checkbox" checked={isReprofiling} onChange={handleReprofileToggle} />
                                    <span></span>
                                </label>
                            </div>
                            <div>
                                <b style={{ display: 'block', color: 'var(--text-color, #333)' }}>{isReprofiling ? 'Available for Reprofile' : 'Currently Assigned'}</b>
                                <span style={{ fontSize: '0.85em', opacity: 0.7 }}>
                                    {isReprofiling ? 'Recruitment and Admins can see you are ready for a new project.' : 'You are currently active on a client project.'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div style={{ flex: 2 }}></div>
            </div>
        </div>
    );
};

export default Dashboard;
