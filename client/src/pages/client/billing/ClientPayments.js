import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/client/my-payments');

const ClientPayments = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'invoice_number', label: 'Invoice #', type: 1, sortable: true, render: (item) => item.invoice_number || '-' },
        { key: 'amount', label: 'Amount', type: 1, sortable: true, render: (item) => `$${parseFloat(item.amount).toFixed(2)} ${item.currency}` },
        { key: 'paid_at', label: 'Date Paid', type: 1, sortable: true, render: (item) => item.paid_at ? moment(item.paid_at).format('MMM DD, YYYY') : '-' },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                pending: <span style={{color: 'orange'}}>Pending</span>,
                succeeded: <span style={{color: 'green'}}>Succeeded</span>,
                failed: <span style={{color: 'red'}}>Failed</span>,
                refunded: <span style={{color: 'gray'}}>Refunded</span>
            };
            return map[item.status] || item.status;
        } },
    ], []);

    return (
        <DataTable
            resourceName="Payments"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: [], 
                title: <span><h2>Payment History</h2><p>Record of payments made</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default ClientPayments;
