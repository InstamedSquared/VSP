import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ staff: 0, invoices: 0, contracts: 0 });

    useEffect(() => {
        if (!user) return;
        let isMounted = true;
        const fetchStats = async () => {
            try {
                // Fetch stats (can be optimized with a dedicated stats endpoint later)
                const [staffRes, invoicesRes, contractsRes] = await Promise.all([
                    api.get('/api/v1/client/my-staff?limit=1'),
                    api.get('/api/v1/client/my-invoices?limit=1'),
                    api.get('/api/v1/client/my-contracts?limit=1')
                ]);

                if (isMounted) {
                    setStats({
                        staff: staffRes.data?.totalRecords || 0,
                        invoices: invoicesRes.data?.totalRecords || 0,
                        contracts: contractsRes.data?.totalRecords || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
        return () => { isMounted = false; };
    }, [user]);

    return (
        <div className='admin-pager'>
            <header className='admin-pager-head'>
                <div className='admin-pager-title'>
                    <span>
                        <h2>Welcome back, {user?.fn || 'Client'}!</h2>
                        <p>Here is an overview of your account.</p>
                    </span>
                </div>
            </header>
            <div className='wrap-flex'>
                <div className="dash-stat-grid" style={{ display: 'flex', gap: '20px', width: '100%', marginBottom: '20px' }}>
                    <div className="pagelet" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '15px', borderRadius: '10px' }}>
                            <Icon icon={icons.users} size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Active Staff</p>
                            <h2 style={{ margin: 0 }}>{stats.staff}</h2>
                        </div>
                    </div>
                    <div className="pagelet" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '15px', borderRadius: '10px' }}>
                            <Icon icon={icons.creditCard} size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Invoices</p>
                            <h2 style={{ margin: 0 }}>{stats.invoices}</h2>
                        </div>
                    </div>
                    <div className="pagelet" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: 'var(--warning)', color: 'white', padding: '15px', borderRadius: '10px' }}>
                            <Icon icon={icons.file} size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Active Contracts</p>
                            <h2 style={{ margin: 0 }}>{stats.contracts}</h2>
                        </div>
                    </div>
                </div>
                
                <div className='pagelet w100'>
                    <div className='pagelet-head'>
                        <h4>Recent Announcements</h4>
                    </div>
                    <div className='pagelet-body'>
                        <p>No recent announcements.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
