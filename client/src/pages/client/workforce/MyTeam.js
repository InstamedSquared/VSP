import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/client/my-staff');

const MyTeam = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.employee_fn} ${item.employee_sn}`}</b><p>{item.employee_email}</p></div>
                </div>
            )
        },
        { key: 'start_date', label: 'Start Date', type: 1, sortable: true, render: (item) => item.start_date ? moment(item.start_date).format('MMM. DD, YYYY') : '-' },
        { key: 'end_date', label: 'End Date', type: 1, sortable: true, render: (item) => item.end_date ? moment(item.end_date).format('MMM. DD, YYYY') : '-' }
    ], []);

    return (
        <DataTable
            resourceName="My Team"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['fn', 'sn'], 
                title: <span><h2>My Team</h2><p>View your currently assigned workforce</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default MyTeam;
