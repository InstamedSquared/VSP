import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';

const p_table = "Client Invoices";
const tableService = createResourceService('v1/client/my-invoices');

const Invoices = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'invoice_number', label: 'Invoice #', type: 1, sortable: true, render: (item) => (
            <b>{item.invoice_number}</b>
        ) },
        { key: 'issue_date', label: 'Issue Date', type: 1, sortable: true, render: (item) => (
            new Date(item.issue_date).toLocaleDateString()
        ) },
        { key: 'due_date', label: 'Due Date', type: 1, sortable: true, render: (item) => (
            new Date(item.due_date).toLocaleDateString()
        ) },
        { key: 'total_amount', label: 'Amount', type: 1, sortable: true, render: (item) => (
            <b>${Number(item.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</b>
        ) },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const colors = { draft: '#94a3b8', sent: '#3b82f6', paid: '#10b981', overdue: '#ef4444', cancelled: '#64748b' };
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
        } }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['invoice_number', 'status'], 
                title: <span><h2>My Invoices</h2><p>View your billing history</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default Invoices;
