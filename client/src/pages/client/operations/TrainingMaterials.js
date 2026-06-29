import React, { useRef } from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';

const p_table = "Training Materials";
const tableService = createResourceService('v1/client/my-training-materials');

const TrainingMaterials = () => {
    const dataTableRef = useRef(null);

    const tableColumns = React.useMemo(() => [
        { key: 'title', label: 'Title', type: 1, sortable: true, render: (item) => (
            <b>{item.title}</b>
        ) },
        { key: 'description', label: 'Description', type: 1, sortable: false },
        { key: 'category', label: 'Category', type: 1, sortable: true, render: (item) => (
            <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
        ) },
        { key: 'material', label: 'Material', type: 1, sortable: false, render: (item) => (
            item.file_path ? (
                <a href={`/api/v1/client/my-training-materials/${item.id}/download`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    <i className="fi fi-rr-download" style={{ marginRight: '5px' }}></i> Access Material
                </a>
            ) : (
                item.external_link ? (
                    <a href={item.external_link} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
                        <i className="fi fi-rr-link" style={{ marginRight: '5px' }}></i> External Link
                    </a>
                ) : <span className="gray-text">Not Available</span>
            )
        ) }
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'description', 'category'], 
                title: <span><h2>Training Materials</h2><p>Access onboarding and training resources</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default TrainingMaterials;
