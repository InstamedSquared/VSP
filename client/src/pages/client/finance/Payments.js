import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';

const p_table = "Client Payments";
const tableService = createResourceService('v1/client/my-payments');

const Payments = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'payment_date', label: 'Payment Date', type: 1, sortable: true, render: (item) => (
            new Date(item.payment_date).toLocaleDateString()
        ) },
        { key: 'amount', label: 'Amount', type: 1, sortable: true, render: (item) => (
            <b style={{color: 'green'}}>${Number(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</b>
        ) },
        { key: 'payment_method', label: 'Method', type: 1, sortable: true, render: (item) => (
            <span style={{ textTransform: 'capitalize' }}>{item.payment_method}</span>
        ) },
        { key: 'reference_number', label: 'Reference #', type: 1, sortable: true },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const colors = { pending: '#f59e0b', completed: '#10b981', failed: '#ef4444', refunded: '#64748b' };
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
                searchables: ['reference_number', 'payment_method', 'status'], 
                title: <span><h2>My Payments</h2><p>View your payment history</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default Payments;
