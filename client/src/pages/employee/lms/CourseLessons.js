import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import Icon from '../../../components/common/Icon';
import { icons } from '../../../config/icons';
import { useNotifier } from '../../../context/NotificationContext';
import { useModal } from '../../../context/ModalContext';
import api from '../../../api/api';

const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>{part}</a>;
        }
        return part;
    });
};

const CourseLessons = () => {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const { notify } = useNotifier();
    const { openPopup, closePopup } = useModal();
    const dataTableRef = React.useRef(null);
    const [course, setCourse] = React.useState(null);

    React.useEffect(() => {
        api.get(`/api/v1/lms/my-courses`).then(res => {
            const c = res.data?.data?.find(x => String(x.id) === String(courseId));
            if (c) setCourse(c);
        });
    }, [courseId]);

    const handleComplete = async (item) => {
        try {
            const res = await api.patch(`/api/v1/lms/my-courses/modules/${item.id}/complete`, {});
            notify({ message: res.data.message || 'Marked as completed', style: 'success' });
            
            if (res.data.course_completed) {
                notify({ message: 'Congratulations! You have completed the entire course!', style: 'success' });
            }
            
            if (dataTableRef.current) {
                dataTableRef.current.refreshData();
            }
        } catch (error) {
            notify({ message: error.response?.data?.message || 'Failed to complete lesson', style: 'error' });
        }
    };

    const handleViewMedia = (file, itemTitle) => {
        const fileUrl = `/api/v1/lms/courses/modules/file/${file.file_path}`;
        let content = null;
        
        if (file.file_type === 'video') {
            content = <video src={fileUrl} controls autoPlay style={{ width: '100%', maxHeight: '70vh', borderRadius: '8px' }} />;
        } else if (file.file_type === 'image') {
            content = <img src={fileUrl} alt={file.original_name} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} />;
        }

        if (content) {
            openPopup({
                title: `${itemTitle} - ${file.original_name}`,
                widthClass: 'w-lg',
                content: <div style={{display:'flex',justifyContent:'center',padding:'10px'}}>{content}</div>,
                actions: [{ text: 'Close', className: 'btn-secondary', onClick: closePopup }]
            });
        }
    };

    const handleViewLesson = (item) => {
        openPopup({
            title: `Lesson: ${item.title}`,
            widthClass: 'w-lg',
            content: (
                <div style={{ padding: '20px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '10px', color: 'var(--text-color)', fontSize: '16px' }}>Lesson Overview</h3>
                    <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{item.description ? renderTextWithLinks(item.description) : 'No description available.'}</p>
                    </div>
                </div>
            ),
            actions: [{ text: 'Close', className: 'btn-secondary', onClick: closePopup }]
        });
    };

    const tableService = {
        getAll: async (params) => api.get(`/api/v1/lms/my-courses/${courseId}/modules`, { params }),
        create: null,
        update: null,
        remove: null
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
        { key: 'files', label: 'Resources', type: 1, sortable: false, render: (item) => {
            if (!item.files || item.files.length === 0) return '-';
            
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {item.files.map(f => {
                        const isMedia = f.file_type === 'video' || f.file_type === 'image';
                        if (isMedia) {
                            const iconMap = { video: icons.video, image: icons.image };
                            const textMap = { video: 'Watch Video', image: 'View Image' };
                            return (
                                <button key={f.id} className="button small primary" onClick={() => handleViewMedia(f, item.title)} title={f.original_name} style={{justifyContent: 'flex-start', whiteSpace: 'nowrap'}}>
                                    <Icon icon={iconMap[f.file_type]} /> {textMap[f.file_type]}
                                </button>
                            );
                        }
                        const docIconMap = {
                            pdf: icons.filePdf, word: icons.fileWord, excel: icons.fileExcel, ppt: icons.filePowerpoint, other: icons.file
                        };
                        return (
                            <a key={f.id} href={`/api/v1/lms/courses/modules/file/${f.file_path}`} target="_blank" rel="noopener noreferrer" className="button small btn-outlined" title={f.original_name} style={{justifyContent: 'flex-start', whiteSpace: 'nowrap'}}>
                                <Icon icon={docIconMap[f.file_type] || icons.file} /> Open Document
                            </a>
                        );
                    })}
                </div>
            );
        } },
        { key: 'progress_status', label: 'Status', type: 1, sortable: true, render: (item) => {
            if (item.progress_status === 'completed') {
                return <span className="badge badge-green"><i className={icons.check} /> COMPLETED</span>;
            }
            return <span className="badge badge-gray">PENDING</span>;
        } },
    ], []);

    return (
        <DataTable
            ref={dataTableRef}
            resourceName="Lesson"
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['title', 'description'], 
                title: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button className="button icon btn-outlined" onClick={() => navigate('/employee/lms/courses')}>
                            <Icon icon={icons.arrowLeft} />
                        </button>
                        <span>
                            <h2>Course Lessons</h2>
                            <p>{course ? `Lessons for: ${course.title}` : 'Loading...'}</p>
                        </span>
                    </span>
                ), 
                add: false,
                edit: false,
                delete: false,
                rowActions: [
                    {
                        type: 'button',
                        text: 'View Lesson',
                        icon: icons.eye,
                        className: 'td-btn-primary',
                        onClick: handleViewLesson
                    },
                    {
                        type: 'button',
                        text: 'Mark Complete',
                        icon: icons.check,
                        className: 'td-btn-success',
                        onClick: handleComplete,
                        disabled: (item) => item.progress_status === 'completed'
                    }
                ]
            }}
        />
    );
};

export default CourseLessons;
