import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';

const p_table = "My Payslips";
const tableService = createResourceService('v1/workforce/my-payslips');

const MyPayslips = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'period_start', label: 'Period', type: 1, sortable: true, render: (item) => (
            <b>{new Date(item.period_start).toLocaleDateString()} - {new Date(item.period_end).toLocaleDateString()}</b>
        ) },
        { key: 'gross_pay', label: 'Gross Pay', type: 1, sortable: true, render: (item) => (
            `$${Number(item.gross_pay).toLocaleString(undefined, {minimumFractionDigits: 2})}`
        ) },
        { key: 'deductions', label: 'Deductions', type: 1, sortable: true, render: (item) => (
            <span style={{color: 'red'}}>-${Number(item.deductions).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        ) },
        { key: 'net_pay', label: 'Net Pay', type: 1, sortable: true, render: (item) => (
            <b style={{color: 'green'}}>${Number(item.net_pay).toLocaleString(undefined, {minimumFractionDigits: 2})}</b>
        ) },
        { key: 'payment_date', label: 'Payment Date', type: 1, sortable: true, render: (item) => (
            item.payment_date ? new Date(item.payment_date).toLocaleDateString() : '-'
        ) }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: [], 
                title: <span><h2>My Payslips</h2><p>View your payroll records</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default MyPayslips;
