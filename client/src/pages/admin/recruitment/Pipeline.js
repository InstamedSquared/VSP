import React, { useState, useEffect } from 'react';
import '../../../assets/css/kanban.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import moment from 'moment';
import api from '../../../api/api';
import { useNotifier } from '../../../context/NotificationContext';
import { useModal } from '../../../context/ModalContext';
import useForm from '../../../hooks/useForm';
import { FormSelect, FormInput, FormTextarea } from '../../../components/common/FormFields';

const STAGES = {
    applied: 'Applied',
    screening: 'Screening',
    assessment: 'Assessment',
    interview: 'Interview',
    client_interview: 'Client Interview',
    hired: 'Hired',
    pool: 'Talent Pool',
    reprofile: 'Reprofile'
};

const TableForm = ({ item, onSave, onCancel, onConvert }) => {
    const isEditMode = Boolean(item);
    const [applicants, setApplicants] = useState([]);

    const schema = {
        id_applicant: { required: true, label: 'Applicant' },
        stage: { required: true, label: 'Stage' }
    };

    const { values, errors, handleChange, handleSubmit } = useForm({
        id_applicant: isEditMode ? item.id_applicant ?? '' : '',
        stage: isEditMode ? item.stage ?? 'screening' : 'screening',
        interviewer: isEditMode ? item.interviewer ?? '' : '',
        scheduled_at: isEditMode ? (item.scheduled_at ? moment(item.scheduled_at).format('YYYY-MM-DDTHH:mm') : '') : '',
        completed_at: isEditMode ? (item.completed_at ? moment(item.completed_at).format('YYYY-MM-DDTHH:mm') : '') : '',
        notes: isEditMode ? item.notes ?? '' : '',
    }, schema);

    useEffect(() => {
        let isMounted = true;
        api.get('/api/v1/recruitment/applicants?limit=1000')
            .then(res => {
                if (isMounted && res.data.data) {
                    const mapped = res.data.data.map(app => ({
                        value: app.id,
                        label: `${app.fn} ${app.sn} (${app.email})`
                    }));
                    setApplicants(mapped);
                }
            })
            .catch(err => console.error("Error fetching applicants", err));
        return () => { isMounted = false; };
    }, []);

    const handleSave = (formValues) => {
        onSave(formValues, item?.id);
    };

    return (
        <form className="form-case" noValidate onSubmit={handleSubmit(handleSave)}>
            <div className="form-row">
                <FormSelect label="Applicant" name="id_applicant" value={values.id_applicant} error={errors.id_applicant} onChange={handleChange} required options={applicants} className="w100" disabled={isEditMode} />
            </div>
            <div className="form-row">
                <FormSelect label="Stage" name="stage" value={values.stage} error={errors.stage} onChange={handleChange} required options={Object.entries(STAGES).map(([k, v]) => ({ value: k, label: v }))} className="w5" />
                <FormInput label="Interviewer" name="interviewer" value={values.interviewer} error={errors.interviewer} onChange={handleChange} placeholder="Interviewer Name" className="w5" />
            </div>
            <div className="form-row">
                <FormInput label="Scheduled At" name="scheduled_at" type="datetime-local" value={values.scheduled_at} error={errors.scheduled_at} onChange={handleChange} className="w5" />
                <FormInput label="Completed At" name="completed_at" type="datetime-local" value={values.completed_at} error={errors.completed_at} onChange={handleChange} className="w5" />
            </div>
            <FormTextarea label="Notes" name="notes" placeholder="Interview feedback or notes..." rows={3} value={values.notes} onChange={handleChange} autoComplete="off" />
            
            <div className="form-action" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div>
                    {isEditMode && item?.stage === 'hired' && (
                        <button type="button" className="button btn-success" onClick={() => onConvert(item.id_applicant, [item.applicant_fn, item.applicant_sn].filter(Boolean).join(' ') || `Applicant ${item.id_applicant}`)} style={{ backgroundColor: '#10b981', color: 'white' }}>
                            <i className="fi fi-rr-user-add"></i> Convert to Employee
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="button btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="button btn-primary">Save Pipeline</button>
                </div>
            </div>
        </form>
    );
};

const KanbanCard = ({ item, index, onClick }) => {
    const fullName = [item.applicant_fn, item.applicant_sn].filter(Boolean).join(' ') || `Applicant ${item.id_applicant}`;

    return (
        <Draggable draggableId={String(item.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    style={{ ...provided.draggableProps.style, cursor: 'pointer' }}
                >
                    <div className="kanban-card-header">
                        <div className="kanban-card-avatar">
                            {item.photoUrl ? (
                                <img src={item.photoUrl} alt={fullName} className="kanban-card-avatar" style={{width: '32px', height: '32px', borderRadius: '50%'}} />
                            ) : (
                                <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <i className="fi fi-rr-user" style={{color: '#718096', fontSize: '14px'}}></i>
                                </div>
                            )}
                        </div>
                        <div className="kanban-card-title">{fullName}</div>
                    </div>
                    
                    <div className="kanban-card-body">
                        {item.interviewer && (
                            <div className="kanban-card-meta">
                                <i className="fi fi-rr-user"></i> {item.interviewer}
                            </div>
                        )}
                        {item.scheduled_at && (
                            <div className="kanban-card-meta">
                                <i className="fi fi-rr-calendar"></i> {moment(item.scheduled_at).format('MMM D, h:mm A')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

const PipelineKanban = () => {
    const [data, setData] = useState({ items: [], columns: {} });
    const [loading, setLoading] = useState(true);
    const { notify } = useNotifier();
    const { openPopup, closePopup } = useModal();

    const fetchPipeline = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/recruitment/pipeline?limit=1000');
            if (res.data && res.data.data) {
                const items = res.data.data;
                const columns = {};
                Object.keys(STAGES).forEach(key => { columns[key] = []; });
                
                items.forEach(item => {
                    if (columns[item.stage]) {
                        columns[item.stage].push(item);
                    } else {
                        // Fallback if stage doesn't match
                        if (!columns.applied) columns.applied = [];
                        columns.applied.push(item);
                    }
                });
                
                setData({ items, columns });
            }
        } catch (error) {
            console.error("Error fetching pipeline", error);
            notify({ message: 'Error fetching pipeline data', style: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPipeline();
    }, []);

    const handleSavePipeline = async (formData, id) => {
        try {
            if (id) {
                await api.put(`/api/v1/recruitment/pipeline/${id}`, formData);
                notify({ message: 'Pipeline stage updated successfully', style: 'success' });
            } else {
                await api.post('/api/v1/recruitment/pipeline', formData);
                notify({ message: 'Added to pipeline successfully', style: 'success' });
            }
            closePopup();
            fetchPipeline();
        } catch (error) {
            console.error("Error saving pipeline", error);
            notify({ message: 'Failed to save pipeline', style: 'error' });
        }
    };

    const handleAddNew = () => {
        openPopup({
            title: 'Add to Pipeline',
            widthClass: 'w-mm',
            content: (
                <TableForm 
                    onSave={handleSavePipeline} 
                    onCancel={() => closePopup()} 
                />
            )
        });
    };

    const handleConvertApplicant = (applicantId, applicantName = 'this applicant') => {
        const proceed = async () => {
            try {
                const res = await api.post(`/api/v1/recruitment/applicants/${applicantId}/convert`);
                if (res.data.success) {
                    notify({ message: 'Applicant converted to employee successfully. Temporary Password: ' + res.data.tempPassword, style: 'success' });
                    closePopup();
                    fetchPipeline();
                }
            } catch (error) {
                console.error("Error converting applicant", error);
                notify({ message: error.response?.data?.message || 'Failed to convert applicant', style: 'error' });
                closePopup();
            }
        };

        const icons = require('../../../config/icons').icons;

        openPopup({
            title: `Confirm Conversion`,
            widthClass: 'w-md',
            content: <p>Are you sure you want to convert <strong>{applicantName}</strong> to an employee? <br />This will generate their account and send a welcome email.</p>,
            actions: [
                { text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup },
                { text: 'Yes, Convert', icon: icons.userPlus, className: 'btn-primary', onClick: proceed }
            ]
        });
    };

    const handleEditCard = (item) => {
        openPopup({
            title: 'Update Pipeline Card',
            widthClass: 'w-mm',
            content: (
                <TableForm 
                    item={item}
                    onSave={handleSavePipeline} 
                    onCancel={() => closePopup()} 
                    onConvert={handleConvertApplicant}
                />
            )
        });
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside a column
        if (!destination) return;

        // Dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic UI Update
        const startColumn = [...data.columns[source.droppableId]];
        const finishColumn = [...data.columns[destination.droppableId]];
        const [movedItem] = startColumn.splice(source.index, 1);
        movedItem.stage = destination.droppableId;
        finishColumn.splice(destination.index, 0, movedItem);

        setData(prev => ({
            ...prev,
            columns: {
                ...prev.columns,
                [source.droppableId]: startColumn,
                [destination.droppableId]: finishColumn
            }
        }));

        // Persist to database
        try {
            await api.put(`/api/v1/recruitment/pipeline/${draggableId}`, { stage: destination.droppableId });
            notify({ message: 'Pipeline updated successfully', style: 'success' });
        } catch (error) {
            console.error('Error updating pipeline', error);
            notify({ message: 'Failed to update pipeline stage', style: 'error' });
            // Revert on error
            fetchPipeline();
        }
    };

    return (
        <div className="admin-pager">
            <header className="admin-pager-head">
                <div className="admin-pager-title">
                    <h2>Pipeline Tracking</h2>
                    <span style={{ clear:'both', float:'left', fontSize:'0.85em', opacity:0.7 }}>Drag and drop applicants through the recruitment stages</span>
                </div>
                <div className="admin-pager-navs">
                    <button className="btn btn-new button btn-primary" onClick={handleAddNew}>
                        <i className="fi fi-rr-plus"></i> Add New
                    </button>
                </div>
            </header>
            
            {loading ? (
                <div style={{ padding: '20px' }}>Loading pipeline...</div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="kanban-board">
                        {Object.entries(STAGES).map(([columnId, columnTitle]) => (
                            <div className="kanban-column" key={columnId}>
                                <div className="kanban-column-header">
                                    {columnTitle}
                                    <span className="count">{data.columns[columnId]?.length || 0}</span>
                                </div>
                                <Droppable droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            className="kanban-column-list"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.02)' : 'transparent'
                                            }}
                                        >
                                            {data.columns[columnId]?.map((item, index) => (
                                                <KanbanCard 
                                                    key={item.id} 
                                                    item={item} 
                                                    index={index} 
                                                    onClick={() => handleEditCard(item)}
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default PipelineKanban;
