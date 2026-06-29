import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';

const p_table = "Client Contracts";
const tableService = createResourceService('v1/client/my-contracts');

const Contracts = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'title', label: 'Contract Title', type: 1, sortable: true, render: (item) => (
            <b>{item.title}</b>
        ) },
        { key: 'start_date', label: 'Start Date', type: 1, sortable: true, render: (item) => (
            new Date(item.start_date).toLocaleDateString()
        ) },
        { key: 'end_date', label: 'End Date', type: 1, sortable: true, render: (item) => (
            item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Ongoing'
        ) },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const colors = { active: '#10b981', expired: '#ef4444', terminated: '#64748b' };
            const statusColor = colors[item.status] || '#64748b';
            return (
                <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    backgroundColor: `${statusColor}20`,
                    color: statusColor,
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    {item.status}
                </span>
            );
        } },
        { key: 'document', label: 'Document', type: 1, sortable: false, render: (item) => (
            item.document_path ? (
                <a href={`/api/v1/client/my-contracts/${item.id}/download`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    <i className="fi fi-rr-download" style={{ marginRight: '5px' }}></i> Download
                </a>
            ) : <span className="gray-text">Not Available</span>
        ) }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'status'], 
                title: <span><h2>My Contracts</h2><p>View your active and past service agreements</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default Contracts;
