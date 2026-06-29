import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import DataTable from '../../../components/common/DataTable';
import Icon from '../../../components/common/Icon';
import { icons } from '../../../config/icons';
import useForm from '../../../hooks/useForm';
import { useModal } from '../../../context/ModalContext';
import { FormInput, FormSelect, FormTextarea } from '../../../components/common/FormFields';

const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>{part}</a>;
        }
        return part;
    });
};

const TableForm = ({ item, onSave, onRefresh }) => {
    const isEditMode = Boolean(item);
    const [existingFiles, setExistingFiles] = React.useState(item?.files || []);
    const [confirmDelete, setConfirmDelete] = React.useState(null);

    const schema = {
        title: { required: true, label: 'Title' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        title: isEditMode ? item.title ?? '' : '',
        description: isEditMode ? item.description ?? '' : '',
        sort_order: isEditMode ? item.sort_order ?? 0 : 0,
        status: isEditMode ? item.status ?? 'active' : 'active',
        files: null
    }, schema);

    const handleSave = (formValues) => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            if (key === 'files' && formValues[key]) {
                for (let i = 0; i < formValues[key].length; i++) {
                    formData.append('files', formValues[key][i]);
                }
            } else if (formValues[key] !== null && formValues[key] !== undefined) {
                formData.append(key, formValues[key]);
            }
        });
        onSave(formData, item?.id);
    };

    const handleDeleteFile = (file) => {
        setConfirmDelete(file);
    };

    const proceedDelete = async (file) => {
        try {
            await api.delete(`/api/v1/lms/courses/modules/file/${file.id}`);
            setExistingFiles(prev => prev.filter(f => f.id !== file.id));
            if (onRefresh) onRefresh();
        } catch (error) {
            alert('Failed to delete file');
        } finally {
            setConfirmDelete(null);
        }
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            {confirmDelete && (
                <div className="modal-backdrop" style={{ zIndex: 9999 }}>
                    <div className="modal-panel w-md">
                        <div className="modal-content-wrapper modal-animation-slide">
                            <header className="modal-header">
                                <h2>Confirm File Deletion</h2>
                                <button type="button" className="modal-close-btn" onClick={() => setConfirmDelete(null)}>&times;</button>
                            </header>
                            <main className="modal-content">
                                <p>You are about to permanently delete the attached file: <strong>{confirmDelete.original_name}</strong>. <br />This action cannot be undone. Are you sure you want to proceed?</p>
                            </main>
                            <footer className="modal-actions">
                                <button type="button" className="button btn-secondary" onClick={() => setConfirmDelete(null)}><Icon icon={icons.times} /> Cancel</button>
                                <button type="button" className="button btn-danger" onClick={() => proceedDelete(confirmDelete)}><Icon icon={icons.trash} /> Yes, Delete</button>
                            </footer>
                        </div>
                    </div>
                </div>
            )}
            <div className="form-row">
                <FormInput label="Title" name="title" value={values.title} error={errors.title} onChange={handleChange} required className="w100" />
            </div>
            
            <FormTextarea label="Description" name="description" value={values.description} error={errors.description} onChange={handleChange} rows={3} className="w100" />
            
            <div className="form-row">
                <div className="input-case w100">
                    <label>Resource Files</label>
                    <div className="input-group">
                        <input type="file" name="files" multiple onChange={(e) => handleChange({ target: { name: 'files', value: e.target.files } })} />
                    </div>
                    {existingFiles.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block' }}>Existing Attached Files:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {existingFiles.map(file => (
                                    <div key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Icon icon={icons.file} />
                                            <span>{file.original_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <a href={`/api/v1/lms/courses/modules/file/${file.file_path}`} target="_blank" rel="noopener noreferrer" className="button small secondary">
                                                View
                                            </a>
                                            <button type="button" className="button small danger" onClick={() => handleDeleteFile(file)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="form-row">
                <FormInput label="Sort Order" name="sort_order" type="number" value={values.sort_order} error={errors.sort_order} onChange={handleChange} className="w5" />
                <FormSelect label="Status" name="status" value={values.status} error={errors.status} onChange={handleChange} options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                ]} className="w5" />
            </div>
        </form>
    );
};

const CourseModules = () => {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = React.useState(null);

    React.useEffect(() => {
        api.get(`/api/v1/lms/courses`).then(res => {
            const c = res.data?.data?.find(x => String(x.id) === String(courseId));
            if (c) setCourse(c);
        });
    }, [courseId]);

    const tableService = {
        getAll: async (params) => api.get(`/api/v1/lms/courses/${courseId}/modules`, { params }),
        create: async (data) => api.post(`/api/v1/lms/courses/${courseId}/modules`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        update: async (id, data) => api.put(`/api/v1/lms/courses/modules/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        remove: async (id) => api.patch(`/api/v1/lms/courses/modules/${id}/delete`)
    };

    const tableColumns = React.useMemo(() => [
        { key: 'sort_order', label: 'Order', type: 1, sortable: true, render: (item) => <div style={{width:'40px',textAlign:'center'}}><b>{item.sort_order}</b></div> },
        {
            key: 'title', label: 'Lesson Info', type: 0, sortable: true, render: (item) => (
                <div className='tr-name' style={{ maxWidth: '450px' }}>
                    <b>{item.title}</b>
                    <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', margin: '5px 0 0 0', color: 'var(--text-muted)' }}>
                        {item.description ? renderTextWithLinks(item.description) : ''}
                    </p>
                </div>
            )
        },
        { key: 'files', label: 'Attachments', type: 1, sortable: false, render: (item) => {
            if (!item.files || item.files.length === 0) return <span className="td-badge">No files</span>;
            return (
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {item.files.map(f => {
                        const iconMap = {
                            video: { icon: icons.video, class: 'badge-blue' },
                            pdf: { icon: icons.filePdf, class: 'badge-red' },
                            word: { icon: icons.fileWord, class: 'badge-primary' },
                            excel: { icon: icons.fileExcel, class: 'badge-green' },
                            ppt: { icon: icons.filePowerpoint, class: 'badge-orange' },
                            image: { icon: icons.image, class: 'badge-purple' },
                            other: { icon: icons.file, class: 'badge-gray' },
                        };
                        const mapData = iconMap[f.file_type] || iconMap.other;
                        return (
                            <span key={f.id} className={`badge ${mapData.class}`} style={{textTransform:'uppercase', fontSize: '10px'}} title={f.original_name}>
                                <i className={mapData.icon} /> {f.file_type}
                            </span>
                        );
                    })}
                </div>
            );
        } },
        { key: 'status', label: 'Status', type: 1, sortable: true, render: (item) => <span className={`td-badge ${item.status === 'active' ? 'success' : 'danger'}`}>{item.status}</span> },
    ], []);

    return (
        <DataTable
            resourceName="Lesson"
            apiService={tableService}
            columns={tableColumns}
            FormComponent={TableForm}
            config={{ 
                searchables: ['title', 'description'], 
                title: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button className="button icon btn-outlined" onClick={() => navigate('/admin/lms/courses')}>
                            <Icon icon={icons.arrowLeft} />
                        </button>
                        <span>
                            <h2>Course Lessons</h2>
                            <p>{course ? `Manage lessons for: ${course.title}` : 'Loading...'}</p>
                        </span>
                    </span>
                ), 
                modalWidth: 'w-lg' 
            }}
        />
    );
};

export default CourseModules;
