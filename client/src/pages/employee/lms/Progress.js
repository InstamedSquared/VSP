import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import { useNotifier } from '../../../context/NotificationContext';
import { icons } from '../../../config/icons';

const p_table = "Course Progress";
const tableService = createResourceService('v1/lms/my-progress');

const Progress = () => {
    const dataTableRef = useRef(null);
    const { notify } = useNotifier();

    const handleComplete = async (item) => {
        try {
            await api.patch(`/api/v1/lms/my-courses/${item.id_course}/complete`, {});
            notify({ message: `Congratulations! You have completed ${item.title}`, style: 'success' });
            if (dataTableRef.current) {
                dataTableRef.current.refreshData();
            }
        } catch (error) {
            notify({ message: error.response?.data?.message || 'Failed to update progress', style: 'error' });
        }
    };

    const tableColumns = React.useMemo(() => [
        {
            key: 'title', label: 'Course Title', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{item.title}</b></div>
                </div>
            )
        },
        { key: 'category', label: 'Category', type: 1, sortable: true, render: (item) => {
            const map = {
                internal: 'Internal Policies', hipaa: 'HIPAA', dental: 'Dental & Medical',
                insurance: 'Insurance', billing: 'Medical Billing', customer_service: 'Customer Service'
            };
            return map[item.category] || item.category;
        } },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => (
            <span className={`badge badge-${item.status === 'completed' ? 'green' : 'blue'}`}>{item.status.toUpperCase()}</span>
        ) },
        { key: 'progress_percent', label: 'Progress', type: 1, sortable: true, render: (item) => (
            <div style={{ width: '100%', minWidth: '100px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.progress_percent}%`, height: '8px', backgroundColor: '#3b82f6' }}></div>
                <div style={{ fontSize: '0.75rem', marginTop: '2px', textAlign: 'right' }}>{item.progress_percent}%</div>
            </div>
        ) },
        { key: 'enrolled_at', label: 'Enrolled On', type: 1, sortable: true, render: (item) => (
            item.enrolled_at ? new Date(item.enrolled_at).toLocaleDateString() : '-'
        ) }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'category'], 
                title: <span><h2>My Learning Progress</h2><p>Track your course completions</p></span>, 
                add: false,
                edit: false,
                delete: false,
                rowActions: [
                    {
                        type: 'button',
                        text: 'Mark as Completed',
                        icon: icons.check,
                        className: 'td-btn-primary',
                        onClick: handleComplete,
                        disabled: (item) => item.status === 'completed',
                        showWhenDisabled: true
                    }
                ]
            }}
        />
    );
};

export default Progress;
