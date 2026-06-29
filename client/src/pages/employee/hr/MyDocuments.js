import React, { useState } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput } from '../../../components/common/FormFields';
import api from '../../../api/api';
import { useNotifier } from '../../../context/NotificationContext';

const tableService = createResourceService('v1/workforce/my-documents');

const TableForm = ({ item, onSave, onClose }) => {
    const isEditMode = Boolean(item);
    
    const schema = {
        title: { required: true, label: 'Document Title' },
        document_type: { required: true, label: 'Document Type' }
    };

    const { values, errors, handleChange } = useForm({
        title: isEditMode ? item.title ?? '' : '',
        document_type: isEditMode ? item.document_type ?? 'other' : 'other',
    }, schema);

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file && !isEditMode) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('document_type', values.document_type);
        if (file) {
            formData.append('file', file);
        }

        onSave(formData, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
                <FormInput label="Document Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required className="w100" />
            </div>
            <div className="form-row">
                <FormSelect label="Document Type" name="document_type" value={values.document_type} error={errors.document_type} onChange={handleChange} required options={[
                    { value: 'resume', label: 'Resume' },
                    { value: 'government_id', label: 'Government ID' },
                    { value: 'certification', label: 'Certification' },
                    { value: 'contract', label: 'Contract/NDA' },
                    { value: 'other', label: 'Other' }
                ]} className="w100" />
            </div>
            
            {!isEditMode && (
                <div className="form-row">
                    <div className="input-case w100">
                        <label>Upload File <b>*</b></label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />
                    </div>
                </div>
            )}
        </form>
    );
};

const MyDocuments = () => {
    const tableColumns = React.useMemo(() => [
        { key: 'title', label: 'Title', type: 1, sortable: true, render: (item) => <b>{item.title}</b> },
        { key: 'document_type', label: 'Type', type: 1, sortable: true, render: (item) => <span style={{ textTransform: 'uppercase', color: 'gray', fontSize: '0.9em' }}>{item.document_type.replace('_', ' ')}</span> },
        { key: 'created_at', label: 'Date Uploaded', type: 1, sortable: true, render: (item) => moment(item.created_at).format('MMM DD, YYYY') },
        { key: 'file_path', label: 'Action', type: 1, sortable: false, render: (item) => (
            item.file_path ? <a href={`/uploads/${item.file_path}`} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>Download</a> : '-'
        ) }
    ], []);

    return (
        <DataTable
            resourceName="Document"
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['title'], 
                title: <span><h2>My Documents</h2><p>Upload and manage your HR documents</p></span>, 
                modalWidth: 'w-md',
                useJson: false,
                edit: false,
            }}
        />
    );
};

export default MyDocuments;
