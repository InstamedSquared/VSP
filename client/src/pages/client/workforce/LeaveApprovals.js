import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';
import api from '../../../api/api';

const tableService = createResourceService('v1/client/my-leaves');

const LeaveApprovals = () => {
    const dataTableRef = React.useRef(null);

    const handleAction = async (item, status) => {
        try {
            const formData = new FormData();
            formData.append('status', status);
            await api.put(`/api/v1/client/my-leaves/${item.id}`, formData);
            if (dataTableRef.current) dataTableRef.current.fetchData();
        } catch (error) {
            console.error(`Error updating leave to ${status}:`, error);
        }
    };

    const tableColumns = React.useMemo(() => [
        { key: 'employee', label: 'Employee', type: 1, sortable: false, render: (item) => `${item.employee_fn} ${item.employee_sn}` },
        { key: 'leave_type', label: 'Leave Type', type: 1, sortable: true, render: (item) => <span style={{ textTransform: 'capitalize' }}>{item.leave_type}</span> },
        { key: 'start_date', label: 'Start Date', type: 1, sortable: true, render: (item) => moment(item.start_date).format('MMM. DD, YYYY') },
        { key: 'end_date', label: 'End Date', type: 1, sortable: true, render: (item) => moment(item.end_date).format('MMM. DD, YYYY') },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                pending: <span style={{color: 'orange'}}>Pending Approval</span>,
                approved: <span style={{color: 'green'}}>Approved</span>,
                rejected: <span style={{color: 'red'}}>Rejected</span>,
                cancelled: <span style={{color: 'gray'}}>Cancelled</span>
            };
            return map[item.status] || item.status;
        } },
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName="Leave Requests"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: [], 
                title: <span><h2>Staff Leave Requests</h2><p>Review and approve leave requests from your assigned staff</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: true,
                rowActions: [
                    {
                        type: 'button',
                        icon: icons.check,
                        text: 'Approve',
                        className: 'td-btn-edit',
                        show: (item) => item.status === 'pending',
                        onClick: (item) => handleAction(item, 'approved')
                    },
                    {
                        type: 'button',
                        icon: icons.times,
                        text: 'Reject',
                        className: 'td-btn-delete',
                        show: (item) => item.status === 'pending',
                        onClick: (item) => handleAction(item, 'rejected')
                    }
                ]
            }}
        />
    );
};

export default LeaveApprovals;
