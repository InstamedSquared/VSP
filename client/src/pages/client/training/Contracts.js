import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/client/my-contracts');

const Contracts = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'title', label: 'Title', type: 1, sortable: true, render: (item) => <b>{item.title}</b> },
        { key: 'contract_type', label: 'Type', type: 1, sortable: true, render: (item) => <span style={{ textTransform: 'uppercase' }}>{item.contract_type}</span> },
        { key: 'effective_date', label: 'Effective Date', type: 1, sortable: true, render: (item) => item.effective_date ? moment(item.effective_date).format('MMM DD, YYYY') : '-' },
        { key: 'expiry_date', label: 'Expiry Date', type: 1, sortable: true, render: (item) => item.expiry_date ? moment(item.expiry_date).format('MMM DD, YYYY') : '-' },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => {
            const map = {
                active: <span style={{color: 'green'}}>Active</span>,
                draft: <span style={{color: 'gray'}}>Draft</span>,
                expired: <span style={{color: 'red'}}>Expired</span>,
                terminated: <span style={{color: 'black'}}>Terminated</span>
            };
            return map[item.status] || item.status;
        } },
    ], []);

    return (
        <DataTable
            resourceName="Contracts"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title'], 
                title: <span><h2>Contracts</h2><p>View active and past contracts</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default Contracts;
