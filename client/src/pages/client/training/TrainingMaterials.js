import React from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const tableService = createResourceService('v1/client/my-training');

const TrainingMaterials = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'title', label: 'Title', type: 1, sortable: true, render: (item) => <b>{item.title}</b> },
        { key: 'file_type', label: 'Type', type: 1, sortable: true, render: (item) => <span style={{ textTransform: 'uppercase', color: 'gray', fontSize: '0.9em' }}>{item.file_type}</span> },
        { key: 'description', label: 'Description', type: 1, sortable: false, render: (item) => <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div> },
        { key: 'created_at', label: 'Date Uploaded', type: 1, sortable: true, render: (item) => moment(item.created_at).format('MMM DD, YYYY') },
        { key: 'file_path', label: 'Action', type: 1, sortable: false, render: (item) => (
            item.file_path ? <a href={`/api/v1/operations/compliance/${item.id}/download`} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>Download</a> : '-'
        ) }
    ], []);

    return (
        <DataTable
            resourceName="Training Materials"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'description'], 
                title: <span><h2>Training & SOPs</h2><p>View standard operating procedures and training material for your team</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default TrainingMaterials;
