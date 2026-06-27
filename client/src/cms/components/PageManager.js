import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useModal } from '../../context/ModalContext';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';
import { usePopupMenu } from '../../context/PopupMenuContext';

const PageActionsMenu = ({ page, onDraft, onPublish, onDelete, onClose }) => (
    <div className='popup-menu-content' >
        {page.status === 'published' ? (
            <button onClick={() => { onClose(); onDraft(page); }}><Icon icon={icons.archive} />Draft</button>
        ) : (
            <button onClick={() => { onClose(); onPublish(page); }}><Icon icon={icons.send} />Publish</button>
        )}
        <button className='danger' onClick={() => { onClose(); onDelete(page); }}><Icon icon={icons.delete} />Delete</button>
    </div>
);

const PageManager = () => {
    const {
        pages,
        activePage,
        selectPage,
        publishPageById,
        handleAddPage,
        handleEditPage,
        confirmDelete,
        confirmDraft,
        confirmPublish
    } = useCMS();
    const { showAlert } = useModal();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();
    const [subTab, setSubTab] = useState(localStorage.getItem('cms_pages_subtab') || 'Published');

    const handleTabChange = (tab) => {
        setSubTab(tab);
        localStorage.setItem('cms_pages_subtab', tab);
    };

    const filteredPages = pages.filter(page => {
        if (subTab === 'Published') return page.status === 'published';
        return page.status === 'draft';
    });

    const handlePublish = async (page) => {
        confirmPublish(page, async (p) => {
            const success = await publishPageById(p.id);
            if (success) {
                showAlert({ title: 'Success', content: 'Page published successfully.', style: 'success', duration: 3000 });
            } else {
                showAlert({ title: 'Error', content: 'Failed to publish page.', style: 'error' });
            }
        });
    };

    return (
        <div className='cms-props-tab-case'>
            <div className='cms-props-tab-head'>
                <button className={`cms-props-tab-btn ${subTab === 'Published' ? 'active' : ''}`} onClick={() => handleTabChange('Published')}>Published</button>
                <button className={`cms-props-tab-btn ${subTab === 'Draft' ? 'active' : ''}`} onClick={() => handleTabChange('Draft')}>Draft</button>
                <button className='cms-props-btn' onClick={handleAddPage} title='Add Page'> <Icon icon={icons.add} /> </button>
            </div>
            <div className='cms-props-tab-body scrollbar-admin'>
                <div className='cms-props-list-case'>
                    <div className='cms-props-list-body'>
                        {filteredPages.length === 0 ? (
                            <div className='cms-empty-state'>No {subTab.toLowerCase()} pages found.</div>
                        ) : (
                            filteredPages.map(page => (
                                <div key={page.id} className={`cms-props-list-item cms-props-page ${activePage?.id === page.id ? 'active' : ''}`} onClick={() => selectPage(page)}>
                                    <div className='item-info'><Icon icon={icons.fileText} /> <p>{page.title}</p> </div>
                                    <div className='item-actions' onClick={(e) => e.stopPropagation()}>
                                        <button className='cms-props-btn' onClick={() => handleEditPage(page)} title='Edit'>
                                            <Icon icon={icons.edit} size={14} />
                                        </button>
                                        <button
                                            className='cms-props-btn'
                                            onClick={(e) => openPopupMenu({
                                                referenceElement: e.currentTarget,
                                                content: (
                                                    <PageActionsMenu
                                                        page={page}
                                                        onDraft={confirmDraft}
                                                        onPublish={handlePublish}
                                                        onDelete={confirmDelete}
                                                        onClose={closePopupMenu}
                                                    />
                                                ),
                                                placement: 'bottom-end'
                                            })}
                                        >
                                            <Icon icon={icons.ellipsisV} size={14} />
                                        </button>
                                        {/* <div className='cms-dropdown-case'>
                                            <button
                                                className='cms-props-btn'
                                                onClick={(e) => openPopupMenu({
                                                    referenceElement: e.currentTarget,
                                                    content: (
                                                        <PageActionsMenu
                                                            page={page}
                                                            onDraft={confirmDraft}
                                                            onPublish={handlePublish}
                                                            onDelete={confirmDelete}
                                                            onClose={closePopupMenu}
                                                        />
                                                    ),
                                                    placement: 'bottom-end'
                                                })}
                                            >
                                                <Icon icon={icons.ellipsisV} size={14} />
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PageManager;
