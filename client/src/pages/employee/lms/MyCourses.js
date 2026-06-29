import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import api from '../../../api/api';
import { useNotifier } from '../../../context/NotificationContext';
import { icons } from '../../../config/icons';

const p_table = "Course";
const tableService = createResourceService('v1/lms/my-courses');

const MyCourses = () => {
    const dataTableRef = useRef(null);
    const { notify } = useNotifier();
    const navigate = useNavigate();

    const handleEnroll = async (item) => {
        try {
            await api.post(`/api/v1/lms/my-courses/${item.id}/enroll`, {});
            notify({ message: `Successfully enrolled in ${item.title}`, style: 'success' });
            if (dataTableRef.current) {
                dataTableRef.current.refreshData();
            }
        } catch (error) {
            notify({ message: error.response?.data?.message || 'Failed to enroll', style: 'error' });
        }
    };

    const tableColumns = React.useMemo(() => [
        {
            key: 'title', label: 'Course Title', type: 1, sortable: true, render: (item) => (
                <div className='tr-name'>
                    {item.is_locked === 1 ? (
                        <b style={{ color: '#aaa' }}><i className={icons.lock} style={{marginRight:'5px'}} /> {item.title}</b>
                    ) : (
                        <b>{item.title}</b>
                    )}
                </div>
            )
        },
        { key: 'description', label: 'Description', type: 1, sortable: false, render: (item) => (
            <span style={{ fontSize: '0.9em', color: item.is_locked === 1 ? '#ccc' : 'var(--text-color)' }}>{item.description}</span>
        ) },
        { key: 'category', label: 'Category', type: 1, sortable: true, render: (item) => {
            const map = {
                internal: 'Internal Policies', hipaa: 'HIPAA', dental: 'Dental & Medical',
                insurance: 'Insurance', billing: 'Medical Billing', customer_service: 'Customer Service'
            };
            return map[item.category] || item.category;
        } },
        { key: 'duration_hours', label: 'Duration', type: 1, sortable: true, render: (item) => (
            item.duration_hours ? `${item.duration_hours} hrs` : '-'
        ) },
        { key: 'enrollment_status', label: 'Status', type: 1, sortable: true, render: (item) => {
            if (item.is_locked === 1) {
                return <span className="badge badge-gray" style={{opacity:0.6}}><i className={icons.lock} /> LOCKED</span>;
            }
            if (item.is_enrolled === 1) {
                return <span className={`badge badge-${item.enrollment_status === 'completed' ? 'green' : 'blue'}`}>{item.enrollment_status.toUpperCase()}</span>;
            }
            if (item.is_required === 1) {
                return <span className="badge badge-red">REQUIRED</span>;
            }
            return <span className="badge badge-gray">AVAILABLE</span>;
        } },
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'category'], 
                title: <span><h2>Course Catalog</h2><p>Browse and enroll in available courses</p></span>, 
                add: false,
                edit: false,
                delete: false,
                rowActions: [
                    {
                        type: 'button',
                        text: 'Enroll Now',
                        icon: icons.addCircle,
                        className: 'td-btn-edit',
                        onClick: handleEnroll,
                        disabled: (item) => item.is_enrolled === 1 || item.is_locked === 1
                    },
                    {
                        type: 'button',
                        text: 'View Lessons',
                        icon: icons.view,
                        className: 'td-btn-primary',
                        onClick: (item) => navigate(`/employee/lms/courses/${item.id}`),
                        disabled: (item) => item.is_enrolled === 0 || item.is_locked === 1
                    }
                ]
            }}
        />
    );
};

export default MyCourses;
