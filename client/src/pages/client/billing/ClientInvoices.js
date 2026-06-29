import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/client/my-invoices');

const ClientInvoices = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'invoice_number', label: 'Invoice #', type: 1, sortable: true, render: (item) => <b>{item.invoice_number}</b> },
        { key: 'period', label: 'Period', type: 1, sortable: false, render: (item) => `${moment(item.period_start).format('MMM DD')} - ${moment(item.period_end).format('MMM DD, YYYY')}` },
        { key: 'total', label: 'Total Amount', type: 1, sortable: true, render: (item) => `$${parseFloat(item.total).toFixed(2)}` },
        { key: 'due_date', label: 'Due Date', type: 1, sortable: true, render: (item) => item.due_date ? moment(item.due_date).format('MMM DD, YYYY') : '-' },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                draft: <span style={{color: 'gray'}}>Draft</span>,
                sent: <span style={{color: 'orange'}}>Pending Payment</span>,
                paid: <span style={{color: 'green'}}>Paid</span>,
                overdue: <span style={{color: 'red'}}>Overdue</span>,
                void: <span style={{color: 'black'}}>Void</span>
            };
            return map[item.status] || item.status;
        } },
    ], []);

    return (
        <DataTable
            resourceName="Invoices"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['invoice_number'], 
                title: <span><h2>My Invoices</h2><p>View your billing invoices</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default ClientInvoices;
