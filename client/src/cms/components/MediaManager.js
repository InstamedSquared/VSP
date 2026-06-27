import React, { useEffect, useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useModal } from '../../context/ModalContext';
import { useNotifier } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import api from '../../api/api';

const MediaManager = () => {
    const { activePage, selectedElement, updateBlockProperty, addBlock } = useCMS();
    const { showAlert, closePopup } = useModal();
    const { notify } = useNotifier();
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    const projectId = activePage?.id_project || null;

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/media', {
                params: { id_project: projectId }
            });
            if (response.data.success) {
                setPhotos(response.data.photos || []);
                setVideos(response.data.videos || []);
            }
        } catch (err) {
            console.error('Failed to load media files:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [projectId]);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        let uploadedCount = 0;
        let failedCount = 0;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            if (projectId) {
                formData.append('id_project', projectId);
            }

            try {
                const res = await api.post('/api/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data.success) {
                    uploadedCount++;
                } else {
                    failedCount++;
                }
            } catch (err) {
                console.error(`Upload error for ${file.name}:`, err);
                failedCount++;
            }
        }

        if (uploadedCount > 0) {
            showAlert({
                title: 'Upload Successful',
                content: `Successfully uploaded ${uploadedCount} file(s).` + (failedCount > 0 ? ` (${failedCount} failed)` : ''),
                style: 'success',
                duration: 3000
            });
        } else if (failedCount > 0) {
            showAlert({
                title: 'Upload Failed',
                content: 'Failed to upload selected file(s). Please check format and sizes (500MB max).',
                style: 'error'
            });
        }

        // Reset file input
        e.target.value = '';
        fetchMedia();
    };

    const handleDelete = (file) => {
        showAlert({
            title: 'Confirm Delete',
            content: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
            isAlert: true,
            style: 'error',
            actions: [
                { text: 'Cancel', onClick: () => closePopup(), className: 'btn-outlined' },
                {
                    text: 'Delete',
                    icon: icons.delete,
                    className: 'btn-danger',
                    onClick: async () => {
                        try {
                            const res = await api.delete(`/api/media/${file.name}`, {
                                params: { id_project: projectId }
                            });
                            if (res.data.success) {
                                showAlert({
                                    title: 'Deleted',
                                    content: 'File has been deleted from disk.',
                                    style: 'success',
                                    duration: 2000
                                });
                                fetchMedia();
                            } else {
                                showAlert({
                                    title: 'Error',
                                    content: res.data.message || 'Failed to delete file.',
                                    style: 'error'
                                });
                            }
                        } catch (err) {
                            console.error('Delete error:', err);
                            showAlert({
                                title: 'Error',
                                content: 'Server error encountered while deleting file.',
                                style: 'error'
                            });
                        } finally {
                            closePopup();
                        }
                    }
                }
            ]
        });
    };

    const handleMediaClick = (file, isPhoto = false) => {
        const { type, sectionId, id } = selectedElement;

        // If an image or video block is selected, update its src directly
        if (type === 'image' || type === 'video') {
            updateBlockProperty(sectionId, id, 'src', file.url);
            closePopup();
            return;
        }

        // Determine block template from file type (detect by extension as fallback)
        const detectedIsPhoto = isPhoto || /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff?|ico)$/i.test(file.name);
        const blockTemplate = detectedIsPhoto
            ? { block_type: 'image', properties: { src: file.url } }
            : { block_type: 'video', properties: { src: file.url, controls: true, muted: true } };

        // Check if there's a valid context to add the block into
        const hasContext = type === 'section' || type === 'footer' || type === 'header'
            || type === 'container' || !!sectionId;

        if (hasContext) {
            addBlock(blockTemplate);
            closePopup();
        }
    };

    const handleCopyUrl = (file) => {
        const fullUrl = window.location.origin + file.url;
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                notify({
                    title: 'Copied',
                    message: 'Asset URL copied to clipboard!',
                    style: 'warning',
                    solid: true,
                    duration: 2000
                });
            })
            .catch((err) => {
                console.error('Failed to copy URL:', err);
            });
    };

    // Filter media by search term (case-insensitive)
    const query = searchTerm.toLowerCase().trim();
    const filteredPhotos = query
        ? photos.filter(p => p.name.toLowerCase().includes(query))
        : photos;
    const filteredVideos = query
        ? videos.filter(v => v.name.toLowerCase().includes(query))
        : videos;

    return (
        <div className='cms-props-tab-case'>
            <div className='cms-props-tab-head'>
                <div className='cms-props-list-search'>
                    <Icon icon={icons.search} size={14} />
                    <input name='cmsSearch_media' type='text' placeholder='Search media...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus={false}
                    />
                    {searchTerm && (
                        <button className='search-clear-btn' onClick={() => setSearchTerm('')} title='Clear search'>
                            <Icon icon={icons.times} size={12} />
                        </button>
                    )}
                </div>
                <button className='cms-props-btn' onClick={() => fileInputRef.current?.click()} title='Add Media'><Icon icon={icons.add} /></button>
                <input type='file' ref={fileInputRef} onChange={handleUpload} accept='image/*,video/*' multiple style={{ display: 'none' }} />

            </div>
            <div className='cms-props-body scrollbar-admin'>
                <div className='cms-props-list-case'>
                    {loading ? (<div className='cms-empty-state'>Loading media assets...</div>
                    ) : (<>
                        {/* Photos Category */}
                        <div className='cms-props-list-head'>
                            <h4>Photos {searchTerm && <span className='filter-count'>({filteredPhotos.length})</span>}</h4>

                        </div>
                        <div className='cms-props-grid-body'>
                            {filteredPhotos.length === 0 ? (
                                <div className='cms-empty-state'>{searchTerm ? 'No matching photos.' : 'No photos found.'}</div>
                            ) : (
                                filteredPhotos.map((photo) => (
                                    <div
                                        key={photo.name}
                                        className='cms-props-grid-item'
                                        title={`Click to apply: ${photo.name}`}
                                        onClick={() => handleMediaClick(photo, true)}
                                    >
                                        <div className='item-preview'>
                                            <img src={photo.url} alt={photo.name} loading='lazy' />
                                        </div>
                                        <div className='item-info'>
                                            <b>{photo.name}</b>
                                            <p>{(photo.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <div className='cms-props-grid-item-btn-wrap'>
                                            <button title='Copy URL' onClick={(e) => { e.stopPropagation(); handleCopyUrl(photo); }} ><Icon icon={icons.link} size={12} /></button>
                                            <button title='Delete Photo' className='cms-props-btn-delete' onClick={(e) => { e.stopPropagation(); handleDelete(photo); }} ><Icon icon={icons.delete} size={12} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Videos Category */}
                        <div className='cms-props-list-head'>
                            <h4>Videos {searchTerm && <span className='filter-count'>({filteredVideos.length})</span>}</h4>
                        </div>
                        <div className='cms-props-grid-body'>
                            {filteredVideos.length === 0 ? (
                                <div className='cms-empty-state'>{searchTerm ? 'No matching videos.' : 'No videos found.'}</div>
                            ) : (
                                filteredVideos.map((video) => (
                                    <div
                                        key={video.name}
                                        className='cms-props-grid-item'
                                        title={`Click to apply: ${video.name}`}
                                        onClick={() => handleMediaClick(video)}
                                    >
                                        <div className='item-preview'>
                                            <video src={video.url} preload='metadata' muted playsInline />
                                        </div>
                                        <div className='item-info'>
                                            <b>{video.name}</b>
                                            <p>{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <div className='cms-props-grid-item-btn-wrap'>
                                            <button title='Copy URL' onClick={(e) => { e.stopPropagation(); handleCopyUrl(video); }}><Icon icon={icons.link} size={12} /></button>
                                            <button title='Delete Photo' className='cms-props-btn-delete' onClick={(e) => { e.stopPropagation(); handleDelete(video); }}><Icon icon={icons.delete} size={12} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaManager;
