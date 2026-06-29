import React, { useState, useEffect, useRef, useMemo, useCallback, forwardRef, useImperativeHandle, isValidElement } from 'react';
import { useModal } from '../../context/ModalContext';
import { useNotifier } from '../../context/NotificationContext';
import { usePopupMenu } from '../../context/PopupMenuContext';
import Icon from './Icon';
import { icons } from '../../config/icons';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };
    if (totalPages <= 1) return null;
    return (
        <div className='table-pagination'>
            <button title='First' onClick={() => onPageChange(1)} disabled={currentPage === 1}><Icon icon={icons.chevronDoubleLeft} /></button>
            <button title='Prev' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><Icon icon={icons.chevronLeft} />
            </button>
            {getPageNumbers().map((page, index) => page === '...' ? (<span key={`ellipsis-${index}`} className='page-ellipsis'>...</span>) : (<button key={page} onClick={() => onPageChange(page)} className={`${currentPage === page ? 'pagi-active' : ''}`}>{page}</button>))}
            <button title='Next' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><Icon icon={icons.chevronRight} />
            </button>
            <button title='Last' onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}><Icon icon={icons.chevronDoubleRight} /></button>
        </div>
    );
});

const DataTable = forwardRef(({
    resourceName,
    apiService,
    columns,
    FormComponent,
    filters,
    config = {},
    gridView = null,
    defaultViewType = 'table',
    hideViewToggle = false,
    formProps = {},
}, ref) => {
    const { openPopup, closePopup } = useModal();
    const { notify } = useNotifier();
    const { openPopupMenu, closePopupMenu } = usePopupMenu();

    const [viewType, setViewType] = useState(() => localStorage.getItem(`${resourceName}_view_type`) || defaultViewType);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(config.defaultLimit || 25);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(config.defaultSortBy || 'id');
    const [sortOrder, setSortOrder] = useState(config.defaultSortOrder || 'asc');
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleViewChange = (newView) => {
        setViewType(newView);
        localStorage.setItem(`${resourceName}_view_type`, newView);
    };

    const params = useMemo(() => {
        const defParams = { add: true, edit: true, delete: true, deleted: '0', deleteLog: true, archive: false, archived: '0', archivedLog: true, updateLog: false, hasTHead: true, hasRowAction: true, class: '', tableClass: '', modalWidth: 'w-md', hasHeader: true, hasFooter: true, hasPagination: true, tableControls: true, searchables: [], rowActions: [], headerActions: [], bulkActions: [], showCheckbox: false, customControls: null, hideTable: false, manualClose: false };
        return { ...defParams, ...config };
    }, [config]);

    useEffect(() => {
        const timer = setTimeout(() => { setDebouncedSearchTerm(searchTerm); setPage(1); }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const queryParams = useMemo(() => {
        const pars = { page, limit, search: debouncedSearchTerm, sortBy, sortOrder, ...activeFilters };
        if (params.searchables.length > 0) { pars.searchableColumns = params.searchables.join(','); }
        if (params.archived) { pars.archived = params.archived; }
        if (params.deleted) { pars.deleted = params.deleted; }
        return pars;
    }, [page, limit, debouncedSearchTerm, sortBy, sortOrder, activeFilters, params.searchables, params.archived, params.deleted]);

    const { data: queryData, isLoading: loading, error, refetch } = useQuery({
        queryKey: [resourceName, queryParams],
        queryFn: async () => {
            const response = await apiService.getAll(queryParams);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const data = queryData?.data || [];
    const totalRecords = queryData?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    const configRef = useRef(config);
    configRef.current = config;

    useEffect(() => {
        if (configRef.current.onStateChange) {
            configRef.current.onStateChange({
                search: debouncedSearchTerm,
                sortBy,
                sortOrder,
                filters: activeFilters
            });
        }
    }, [debouncedSearchTerm, sortBy, sortOrder, activeFilters]);

    const handleLimitChange = useCallback((newLimit) => { setLimit(Number(newLimit)); setPage(1); }, []);
    const handleSearchTermChange = useCallback((newSearchTerm) => { setSearchTerm(newSearchTerm); }, []);

    const queryClient = useQueryClient();

    const handleRefetch = useCallback(() => {
        queryClient.removeQueries({ queryKey: [resourceName] });
        refetch();
    }, [queryClient, resourceName, refetch]);

    useImperativeHandle(ref, () => ({
        refreshData: () => handleRefetch(),
        clearSelection: () => clearSelection(),
        setTableLimit: handleLimitChange,
        setTableSearch: handleSearchTermChange,
        updateRow: () => refetch(),
        createRow: () => refetch()
    }));

    const handleSave = useCallback(async (formData, itemId) => {
        try {
            if (itemId) {
                if (params.updateLog) { formData.append('updateLog', true); }
                await apiService.update(itemId, formData);
                notify({ message: `Successfully Updated`, style: 'success' });
            } else {
                const response = await apiService.create(formData);
                itemId = response.data?.id || response.data?.data?.id;
                notify({ message: `Successfully Created`, style: 'success' });
            }

            if (config.onSaveSuccess && typeof config.onSaveSuccess === 'function') {
                config.onSaveSuccess(itemId, formData);
            }

            refetch();
            if (!params.manualClose) closePopup();
            return { success: true, itemId };
        } catch (err) {
            notify({ message: `Failed to save ${resourceName}.`, style: 'error' });
            return { success: false, error: err.message };
        }
    }, [apiService, resourceName, notify, refetch, closePopup, config, params]);

    const handleSelectAll = useCallback((e) => {
        if (e.target.checked) {
            const allIds = data.map(item => item.id);
            setSelectedIds(new Set([...selectedIds, ...allIds]));
        } else {
            const currentPageIds = new Set(data.map(item => item.id));
            const newSelectedIds = new Set([...selectedIds].filter(id => !currentPageIds.has(id)));
            setSelectedIds(newSelectedIds);
        }
    }, [data, selectedIds]);

    const handleSelectRow = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    const handleSort = useCallback((key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    }, [sortBy, sortOrder]);

    const handleDelete = useCallback((itemId, itemName) => {
        const proceed = async () => {
            try {
                await apiService.remove(itemId, params.deleteLog);
                notify({ title: 'Deleted', message: `Removed successfully`, style: 'warning' });
                refetch();
            }
            catch (err) { notify({ message: `Failed to delete ${itemName}.`, style: 'error' }); }
            finally { closePopup(); }
        };
        openPopup({
            title: `Confirm Deletion`,
            widthClass: 'w-md',
            content: <p>You are about to permanently delete: <strong>{itemName}</strong>. <br />This action cannot be undone. Are you sure you want to proceed?</p>,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, { text: 'Yes, Delete', icon: icons.delete, className: 'btn-danger', onClick: proceed }]
        });
    }, [apiService, notify, refetch, closePopup, openPopup, params.deleteLog]);

    const handleUndelete = useCallback((itemId, itemName) => {
        const proceed = async () => {
            try {
                await apiService.undelete(itemId);
                notify({ title: 'Restored', message: `Restored successfully`, style: 'success' });
                refetch();
            }
            catch (err) { notify({ message: `Failed to restore ${itemName}.`, style: 'error' }); }
            finally { closePopup(); }
        };
        openPopup({
            title: `Confirm Restore`,
            widthClass: 'w-md',
            content: <p>You are about to restore: <strong>{itemName}</strong>. <br />This will move the record back. Are you sure you want to proceed?</p>,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, { text: 'Yes, Restore', icon: icons.rotate, className: 'btn-primary', onClick: proceed }]
        });
    }, [apiService, notify, refetch, closePopup, openPopup]);

    const handleArchive = useCallback((itemId, itemName) => {
        const proceed = async () => {
            try {
                //await apiService.remove(itemId);
                await apiService.archive(itemId, params.archivedLog);
                notify({ title: 'Archive', message: `Archived successfully`, style: 'warning' });
                refetch();
            }
            catch (err) { notify({ message: `Failed to archive ${itemName}.`, style: 'error' }); }
            finally { closePopup(); }
        };
        openPopup({
            title: `Confirm Archive`,
            widthClass: 'w-md',
            content: <p>You are about to Archive: <strong>{itemName}</strong>. <br />Are you sure you want to proceed?</p>,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, { text: 'Yes, Archive', icon: icons.archive, className: 'btn-danger', onClick: proceed }]
        });
    }, [apiService, notify, refetch, closePopup, openPopup, params.archivedLog]);

    const handleUnarchive = useCallback((itemId, itemName) => {
        const proceed = async () => {
            try {
                await apiService.unarchive(itemId);
                notify({ title: 'Unarchive', message: `Unarchived successfully`, style: 'success' });
                refetch();
            }
            catch (err) { notify({ message: `Failed to unarchive ${itemName}.`, style: 'error' }); }
            finally { closePopup(); }
        };
        openPopup({
            title: `Confirm Unarchive`,
            widthClass: 'w-md',
            content: <p>You are about to unarchive: <strong>{itemName}</strong>. <br />This will move the record back. Are you sure you want to proceed?</p>,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, { text: 'Yes, Unarchive', icon: icons.unarchive, className: 'btn-primary', onClick: proceed }]
        });
    }, [apiService, notify, refetch, closePopup, openPopup]);

    const handleAddClick = useCallback(() => {
        openPopup({
            title: `Add ${resourceName}`,
            widthClass: params.modalWidth,
            content: <FormComponent onSave={handleSave} item={null} onClose={closePopup} onRefresh={refetch} {...formProps} />,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, {
                text: 'Create', icon: icons.add, className: 'btn-primary', onClick: () => {
                    const form = document.getElementById('admin_resource_form') || document.querySelector('.modal-content form') || document.getElementById(`${resourceName}_form`);
                    form?.requestSubmit();
                }
            }]
        });
    }, [openPopup, resourceName, params.modalWidth, handleSave, closePopup, refetch, formProps]);

    const handleEditClick = useCallback((item) => {
        openPopup({
            title: `Edit ${resourceName}`,
            widthClass: params.modalWidth,
            content: <FormComponent onSave={handleSave} item={item} apiService={apiService} onClose={closePopup} onRefresh={refetch} {...formProps} />,
            actions: [{ text: 'Cancel', icon: icons.times, className: 'btn-secondary', onClick: closePopup }, {
                text: 'Save Changes', icon: icons.save, className: 'btn-primary', onClick: () => {
                    const form = document.getElementById('admin_resource_form') || document.querySelector('.modal-content form') || document.getElementById(`${resourceName}_form`);
                    form?.requestSubmit();
                }
            }]
        });
    }, [openPopup, resourceName, params.modalWidth, handleSave, apiService, closePopup, refetch, formProps]);

    const isArchivedView = params.archived === '1';
    const isDeletedView = params.deleted === '1';

    // Removed renderRowActions and consolidated into setRowActions

    const renderHeaderActions = useCallback(() => {
        if (selectedIds.size > 0 && params.bulkActions.length > 0) {
            return (
                <div className='admin-pager-bulk-navs'>
                    <span>{selectedIds.size} <b>Selected</b></span>
                    {params.bulkActions.map((a, i) => (
                        <button key={i} className={`button ${a.className || ''}`} onClick={() => a.onClick(Array.from(selectedIds), clearSelection, refetch)}>
                            {a.icon && <Icon icon={a.icon} />} {a.text}
                        </button>
                    ))}
                    <button className='button icon btn-outlined' onClick={clearSelection}><Icon icon={icons.close} /></button>
                    <div className='head-dvr'></div>
                </div>
            );
        }

        const before = params.headerActions?.filter(a => a.position === 'before') || [];
        const after = params.headerActions?.filter(a => a.position !== 'before') || [];
        return (
            <>
                {gridView && !hideViewToggle && (
                    <div className='view-toggle'>
                        <button title='Table View' className={viewType === 'table' ? 'active' : ''} onClick={() => handleViewChange('table')}><Icon icon={icons.table} /></button>
                        <button title='Grid View' className={viewType === 'card' ? 'active' : ''} onClick={() => handleViewChange('card')}><Icon icon={icons.layoutGrid} /></button>
                    </div>
                )}
                {before.map((a, i) => (
                    a.element ? <React.Fragment key={i}>{a.element}</React.Fragment> :
                        <button key={i} className={`button ${a.className || ''}`} onClick={a.onClick}> {a.icon && <Icon icon={a.icon} />} {a.text} </button>
                ))}
                {params.add && (<button className='button' onClick={handleAddClick}> <Icon icon={icons.add} />Add New</button>)}
                {after.map((a, i) => (
                    a.element ? <React.Fragment key={i}>{a.element}</React.Fragment> :
                        <button key={i} className={`button ${a.className || ''}`} onClick={a.onClick}> {a.icon && <Icon icon={a.icon} />} {a.text} </button>
                ))}
            </>
        );
    }, [params.headerActions, params.add, handleAddClick, selectedIds, params.bulkActions, clearSelection, refetch, gridView, hideViewToggle, viewType]);

    const setRowActions = useCallback((item) => {
        if (params.hasRowAction === false) { return null; }

        const allActions = [];

        // Edit Action
        if (params.edit) {
            allActions.push({
                id: 'edit',
                label: 'Edit',
                icon: icons.edit,
                onClick: () => handleEditClick(item),
                className: 'td-btn-edit',
                type: 'button'
            });
        }

        // Custom Row Actions
        if (params.rowActions && Array.isArray(params.rowActions)) {
            params.rowActions.forEach((a, i) => {
                const isDisabled = typeof a.disabled === 'function' ? a.disabled(item) : a.disabled;
                if (!isDisabled || a.showWhenDisabled) {
                    allActions.push({
                        ...a,
                        id: `custom-${i}`,
                        label: a.text,
                        onClick: () => a.onClick(item),
                        isDisabled
                    });
                }
            });
        }

        // Archive Action
        if (params.archive) {
            if (isArchivedView) {
                allActions.push({
                    id: 'unarchive',
                    label: 'Unarchive',
                    icon: icons.unarchive,
                    onClick: () => handleUnarchive(item.id, item.name || item.fn),
                    className: 'td-btn-unarchive'
                });
            } else {
                allActions.push({
                    id: 'archive',
                    label: 'Archive',
                    icon: icons.archive,
                    onClick: () => handleArchive(item.id, item.name || item.fn),
                    className: 'td-btn-archive'
                });
            }
        }

        // Delete Action
        if (params.delete) {
            if (isDeletedView) {
                allActions.push({
                    id: 'restore',
                    label: 'Restore',
                    icon: icons.rotate,
                    onClick: () => handleUndelete(item.id, item.name || item.fn),
                    className: 'td-btn-restore'
                });
            } else {
                allActions.push({
                    id: 'delete',
                    label: 'Delete',
                    icon: icons.delete,
                    onClick: () => handleDelete(item.id, item.name || item.fn),
                    className: 'td-btn-delete'
                });
            }
        }

        if (allActions.length === 0) return <div className='td td-action'></div>;

        // If actions <= 2, show all as single buttons
        if (allActions.length <= 2) {
            return (
                <div className='td td-action'>
                    <div className='td-action-in'>
                        {allActions.map(a => (
                            <button key={a.id} className={`td-btn ${a.className || ''}`} title={a.label} onClick={() => { a.onClick(); closePopupMenu(); }} disabled={a.isDisabled}>
                                {a.icon && <Icon icon={a.icon} />}<p>{a.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // If actions > 2, use popup-menu
        // Primary actions are explicitly marked as 'button' type
        const directButtons = allActions.filter(a => a.type === 'button');
        const menuActions = allActions.filter(a => a.type !== 'button');

        const menuBtn = menuActions.length > 0 ? (
            <button className='td-btn' onClick={(e) => openPopupMenu({
                referenceElement: e.currentTarget,
                content: (
                    <div className='popup-menu-content'>
                        {menuActions.map(a => (
                            <button key={a.id} onClick={() => { a.onClick(); closePopupMenu(); }} disabled={a.isDisabled}>
                                {a.icon && <Icon icon={a.icon} />}{a.label}
                            </button>
                        ))}
                    </div>
                ),
                placement: 'left-start',
            })} >
                <Icon icon={icons.ellipsisV} />
            </button>
        ) : null;

        return (
            <div className='td td-action'>
                <div className='td-action-in'>
                    {directButtons.map(a => (
                        <button key={a.id} className={`td-btn ${a.className || ''}`} title={a.label} onClick={() => { a.onClick(); closePopupMenu(); }} disabled={a.isDisabled}>
                            {a.icon && <Icon icon={a.icon} />}<p>{a.label}</p>
                        </button>
                    ))}
                    {menuBtn}
                </div>
            </div>
        );

    }, [params.hasRowAction, params.edit, params.delete, params.archive, isArchivedView, isDeletedView, params.rowActions, handleEditClick, handleDelete, handleUndelete, handleArchive, handleUnarchive, closePopupMenu, openPopupMenu, icons]);

    const renderCell = useCallback((item, col) => {
        if (col.render) return col.render(item, item.photoUrl);
        return item[col.key];
    }, []);

    const handleFilterChange = useCallback((filterKey, value, type) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (type === 'date-range-from') {
                const baseKey = filterKey.replace('_from', '');
                if (value) newFilters[baseKey + '_from'] = value;
                else delete newFilters[baseKey + '_from'];
            }
            else if (type === 'date-range-to') {
                const baseKey = filterKey.replace('_to', '');
                if (value) newFilters[baseKey + '_to'] = value;
                else delete newFilters[baseKey + '_to'];
            }
            else {
                if (value) newFilters[filterKey] = value;
                else delete newFilters[filterKey];
            }
            return newFilters;
        });
        setPage(1);
    }, []);

    const renderFilter = useCallback((filter) => {
        if (filter.type === 'date') { return (<div key={filter.key} className={`table-filters ${filter.class}`}> {filter.label && (filter.label !== '') ? <p>{filter.label}</p> : ''} <input type='date' name={filter.key} className={filter.class} value={activeFilters[filter.key] || ''} placeholder={filter.placeholder} onChange={e => handleFilterChange(filter.key, e.target.value)} /> </div>); }
        if (filter.type === 'text') { return (<div key={filter.key} className={`table-filters ${filter.class}`}> {filter.label && (filter.label !== '') ? <p>{filter.label}</p> : ''} <input type='text' name={filter.key} className={filter.class} value={activeFilters[filter.key] || ''} placeholder={filter.placeholder} onChange={e => handleFilterChange(filter.key, e.target.value)} /> </div>); }
        if (filter.type === 'datetime-local') { return (<div key={filter.key} className={`table-filters ${filter.class}`}>{filter.label && (filter.label !== '') ? <p>{filter.label}</p> : ''} <input type='datetime-local' name={filter.key} className={filter.class} value={activeFilters[filter.key] || ''} onChange={e => handleFilterChange(filter.key, e.target.value)} /> </div>); }
        if (filter.type === 'daterange') {
            return (
                <div key={filter.key} className={`table-filters ${filter.class}`}>
                    {filter.label && (filter.label !== '') ? <p>{filter.label}</p> : ''}
                    <input type='date' name={filter.key + '_from'} value={activeFilters[filter.key + '_from'] || ''} onChange={e => handleFilterChange(filter.key + '_from', e.target.value, 'date-range-from')} />
                    {filter.separator && (filter.separator !== '') ? <p>{filter.separator}</p> : ''}
                    <input type='date' name={filter.key + '_to'} value={activeFilters[filter.key + '_to'] || ''} onChange={e => handleFilterChange(filter.key + '_to', e.target.value, 'date-range-to')} />
                </div>);
        }
        return (
            <div key={filter.key} className={`table-filters ${filter.class}`}>
                {filter.label && (filter.label !== '') ? <p>{filter.label}</p> : ''}
                <select name={filter.key} value={activeFilters[filter.key] || ''} className={filter.class} onChange={e => handleFilterChange(filter.key, e.target.value)} >
                    <option value=''>{filter.placeholder}</option>
                    {filter.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
            </div>);
    }, [activeFilters, handleFilterChange]);

    return (
        <div className={`admin-pager ${params.class}`}>
            {params.hasHeader &&
                (<header className='admin-pager-head'>
                    <div className='admin-pager-title'> {params.title && (params.title !== '') ? params.title : <h2>{resourceName}s</h2>} </div>
                    <div className='admin-pager-navs'>{renderHeaderActions()}</div>
                </header>)}

            {params.customControls && isValidElement(params.customControls) && React.cloneElement(params.customControls, { limit, searchTerm, activeFilters, onLimitChange: handleLimitChange, onSearchChange: handleSearchTermChange, onFilterChange: handleFilterChange, onRefresh: refetch, data, totalRecords, totalPages })}

            {viewType === 'card' && gridView && isValidElement(gridView) ? (
                <div className='grid-container'>
                    {React.cloneElement(gridView, {
                        data, loading, refetch, handleEditClick, handleDelete, activeFilters, searchTerm, page, limit, totalRecords, totalPages, onPageChange: setPage
                    })}
                </div>
            ) : (!params.hideTable && (
                error ? (<div className='pagelet'> <div className='table-error'><Icon icon={icons.invalid} /> <p>{error.message || 'Failed to fetch data.'} Please try again later.</p> <u className='link' onClick={(e) => { e.preventDefault(); refetch(); }} >Try Again</u></div> </div>) : (
                    <div className='table-container'>
                        {params.tableControls && (
                            <div className='table-controls'>
                                <div className='table-limit'>
                                    <p>Show</p>
                                    <select value={limit} name={`${resourceName} limit`} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <p>Entries</p>
                                </div>
                                <div className='table-action'>
                                    <div className='table-data-count'>{totalRecords.toLocaleString()}<b> Item{(totalRecords > 1 || totalPages > 1) ? 's' : ''}</b></div>
                                    <div className='table-search'> {<Icon icon={icons.search} />}<input type='search' id='datatable-search' placeholder='Search...' autoComplete='off' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /> </div>
                                    <button className='button icon' onClick={() => refetch()} ><Icon icon={icons.rotate} /></button>
                                    {filters && filters.map(filter => renderFilter(filter))}
                                </div>
                            </div>)}
                        <div className='table-body'>
                            <div className={`table ${params.tableClass}`}>
                                {params.hasTHead && (
                                    <div className='thead'>
                                        {params.showCheckbox && <div className='th tr-td-chk'><input type='checkbox' className='tr-td-chk-input' onChange={handleSelectAll} checked={data.length > 0 && data.every(item => selectedIds.has(item.id))} /></div>}
                                        <div className='th tr-td-no'>#</div>
                                        {columns.map((col) => (<div className={`th ${col.sortable ? 'sortable' : ''} ${col.class ? col.class : ''}`} key={col.key} title={col.title ?? undefined} onClick={col.sortable ? () => handleSort(col.key) : undefined} >{col.label} <u className={`${sortBy === col.key ? 'act ' : ''} ${sortOrder}`}>▼</u> </div>))}
                                        {(params.hasRowAction) ? (<div className='th th-action'>Action</div>) : ''}
                                    </div>)}

                                <div className='tbody'>{
                                    loading ? (<div className='tr-loading'>Loading...</div>) : data.length > 0 ?
                                        (data.map((item, index) => (
                                            <div className={`tr ${index % 2 === 0 ? 'tr-dvr' : ''} ${selectedIds.has(item.id) ? 'tr-selected' : ''}`} key={item.id}>
                                                {params.showCheckbox && <div className='td tr-td-chk'><input type='checkbox' className='tr-td-chk-input' checked={selectedIds.has(item.id)} onChange={() => handleSelectRow(item.id)} /></div>}
                                                <div className='td tr-td-no'>{((page - 1) * limit) + index + 1}</div>
                                                {columns.map(col =>
                                                    <div className={`td ${(col.type === 1 ? 'mob-full' : (col.type === 0 ? 'mob-flex' : ''))} ${(col.class ? col.class : '')}`} key={col.key}>
                                                        {(col.type === 1 ? <b className='td-label'>{col.label} : </b> : '')}
                                                        {renderCell(item, col)}
                                                    </div>
                                                )}
                                                {setRowActions(item)}
                                            </div>
                                        ))) :
                                        (<div className='tr-no-records'>No records found</div>)
                                }</div>
                            </div>
                        </div>

                        {/* Classic Footer - INSIDE Table Container */}
                        {params.hasFooter && viewType === 'table' && (
                            <div className='table-foot'>
                                <div className='table-foot-items'>
                                    <span>{data.length > 0 ? ((page - 1) * limit) + 1 : 0} - {((page - 1) * limit) + data.length} of {totalRecords.toLocaleString()} Result{(totalRecords > 1 || totalPages > 1) ? 's' : ''}</span>
                                </div>
                                {params.hasPagination && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
                            </div>
                        )}

                    </div>
                )))}

            {/* Premium Footer - OUTSIDE, at the bottom (Card View only) */}
            {params.hasFooter && viewType === 'card' && (
                <div className='grid-footer center'>
                    <div className='grid-foot-items'>
                        <span>Showing <b>{data.length > 0 ? ((page - 1) * limit) + 1 : 0}</b> to <b>{((page - 1) * limit) + data.length}</b> of <b>{totalRecords.toLocaleString()}</b> Result{(totalRecords > 1) ? 's' : ''}</span>
                    </div>
                    {params.hasPagination && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
                </div>
            )}

        </div>
    );
});

export default DataTable;