const path = require('path');
const fs = require('fs').promises;
const QueryBuilder = require('./QueryBuilder');
const db = require('../config/db');

class ResourceModel extends QueryBuilder {
    // Accepts an optional file configuration
    constructor(tableNameOrAlias, fileConfig = null, allowedColumns = '*', countFields = [], joinFields = [], relatedTables = [], mediaScan = null) { super(tableNameOrAlias); this.fileConfig = fileConfig; this.allowedColumns = allowedColumns; this.countFields = countFields; this.joinFields = joinFields; this.relatedTables = relatedTables; this.mediaScan = mediaScan; }

    async _handleFileUpload(file, entityId) {
        if (!this.fileConfig) throw new Error('File configuration not set for this model.');

        const destinationDir = path.resolve(
            process.env.PHOTO_STORAGE_PATH,
            this.fileConfig.folderName, // e.g., 'users'
            String(entityId),
            this.fileConfig.subfolder    // e.g., 'profile'
        );
        await fs.mkdir(destinationDir, { recursive: true });

        const files = await fs.readdir(destinationDir);
        for (const oldFile of files) { await fs.unlink(path.join(destinationDir, oldFile)); }

        const finalPath = path.join(destinationDir, file.originalname);
        await fs.rename(file.path, finalPath);

        return file.originalname;
    }

    async select(columns = this.allowedColumns, where = {}, options = {}) {
        const { joins = [], withPhotoUrl = false, toSql = false } = options;
        const results = await super.select(columns, where, joins, toSql);

        if (toSql) { console.log(results); return results; }

        if (withPhotoUrl && this.fileConfig) { return results.map(record => ({ ...record, photoUrl: record.photo_filename ? `/api/${this.fileConfig.folderName}/${record.id}/photo` : null, })); }

        return results;
    }

    async insert(data, file = null) {
        const [newRecord] = await super.insert(data).returning('id');
        const newId = newRecord.id || newRecord;

        if (file && this.fileConfig) { const filename = await this._handleFileUpload(file, newId); await super.update({ id: newId }, { photo_filename: filename }); }
        return await this.select(this.allowedColumns, { id: newId });
    }

    async update(where, data, file = null, logData = null) {
        if (file && this.fileConfig) {
            const [recordToUpdate] = await super.select('id', where);
            if (recordToUpdate) {
                const filename = await this._handleFileUpload(file, recordToUpdate.id);
                data.photo_filename = filename; // Add the new filename to the data being updated
            }
        }

        // Changelog logging
        if (logData) {
            const excludedColumns = ['pw', 'photo_filename', 'changelog', 'deleted_at', 'deleted_by', 'archived_at', 'archived_by', 'inactive', 'archived'];
            const [oldRecord] = await super.select('*', where);
            if (oldRecord) {
                const changes = {};
                for (const key of Object.keys(data)) {
                    if (excludedColumns.includes(key)) continue;
                    const oldVal = oldRecord[key] ?? null;
                    const newVal = data[key] ?? null;
                    if (String(oldVal) !== String(newVal)) {
                        changes[key] = { from: oldVal, to: newVal };
                    }
                }
                if (Object.keys(changes).length > 0) {
                    let existing = [];
                    try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
                    existing.unshift({ timestamp: new Date().toISOString(), userId: logData.userId, changes });
                    data.changelog = JSON.stringify(existing);
                }
            }
        }

        return await super.update(where, data);
    }

    async softDelete(where, logData = null) {
        const data = { inactive: 1 };
        if (logData) {
            data.deleted_by = logData.userId;
            data.deleted_at = db.fn.now();
        }
        return super.update(where, data);
    }

    async undelete(where) {
        return super.update(where, { inactive: 0 });
    }

    async archive(where, logData = null) {
        const data = { archived: 1 };
        if (logData) {
            data.archived_by = logData.userId;
            data.archived_at = db.fn.now();
        }
        return super.update(where, data);
    }

    async unarchive(where) {
        return super.update(where, { archived: 0 });
    }

    async query(sql, bindings = []) {
        const [results] = await db.raw(sql, bindings);
        return results;
    }

    async getPaged({
        page = 1,
        limit = 10,
        search = '',
        filters = {},
        searchableColumns = [],
        sortBy = 'id',
        sortOrder = 'asc',
    }) {
        // Security: Validate sortOrder
        const validSortOrders = ['asc', 'desc'];
        if (!validSortOrders.includes(sortOrder.toLowerCase())) {
            sortOrder = 'asc';
        }
        // Security: Validate sortBy (basic check to ensure it's a valid column name format)
        if (!/^[a-zA-Z0-9_]+$/.test(sortBy)) { sortBy = 'id'; }

        const { archived, deleted, ...remainingFilters } = filters;
        const baseWhere = {};
        if (deleted !== undefined && deleted !== 'all') {
            baseWhere[`${this.tableAlias}.inactive`] = deleted === '1' ? 1 : 0;
        } else if (deleted === undefined) {
            baseWhere[`${this.tableAlias}.inactive`] = 0;
        }
        if (archived !== 'all') {
            baseWhere[`${this.tableAlias}.archived`] = archived === '1' ? 1 : 0;
        }
        const query = db(this.tableRef).where(baseWhere);
        const rangeFilters = {};
        const standardFilters = {};

        Object.entries(remainingFilters).forEach(([key, value]) => {
            if (key.endsWith('_from')) {
                const field = key.replace('_from', '');
                if (!rangeFilters[field]) rangeFilters[field] = {};
                rangeFilters[field].from = value;
            }
            else if (key.endsWith('_to')) {
                const field = key.replace('_to', '');
                if (!rangeFilters[field]) rangeFilters[field] = {};
                rangeFilters[field].to = value;
            }
            else if (value === 'null') { query.whereNull(key); }
            else { standardFilters[key] = value; }
        });

        query.andWhere(standardFilters);

        Object.entries(rangeFilters).forEach(([field, range]) => {
            if (range.from && range.to) {
                const toDate = new Date(range.to);
                toDate.setDate(toDate.getDate() + 1);
                query.whereBetween(field, [range.from, toDate]);
            }
            else if (range.from) { query.andWhere(field, '>=', range.from); }
            else if (range.to) {
                const toDate = new Date(range.to);
                toDate.setDate(toDate.getDate() + 1);
                query.andWhere(field, '<=', toDate);
            }
        });

        if (search && searchableColumns.length > 0) {
            query.andWhere(builder => {
                searchableColumns.forEach(column => {
                    const operator = db.client.config.client === 'pg' ? 'ilike' : 'like';
                    if (column.includes('|')) {
                        const columnsToConcat = column.split('|').map(c => `${this.tableAlias}.${c}`);
                        const concatExpression = `CONCAT_WS(' ', ${columnsToConcat.join(', ')})`;
                        builder.orWhere(db.raw(concatExpression), operator, `%${search}%`);
                    }
                    else { builder.orWhere(`${this.tableAlias}.${column}`, operator, `%${search}%`); }
                });
            });
        }

        const countQuery = query.clone().count(`${this.tableAlias}.id as total`).first();
        //const countQuery = query.clone().count('* as total').first();
        const { total } = await countQuery;
        const totalRecords = parseInt(total, 10);

        const offset = (page - 1) * limit;
        const dataQuery = query.offset(offset).limit(limit).orderBy(`${this.tableAlias}.${sortBy}`, sortOrder);

        const columnsToSelect = Array.isArray(this.allowedColumns)
            ? this.allowedColumns.map(c => `${this.tableAlias}.${c}`)
            : [`${this.tableAlias}.*`];

        if (this.tableName === 'users') {
            const concatExpression = `CONCAT_WS(' ', ${this.tableAlias}.fn, ${this.tableAlias}.mn, ${this.tableAlias}.sn)`;
            dataQuery.select([...columnsToSelect, db.raw(`${concatExpression} as name`)]);
        }
        else { dataQuery.select(columnsToSelect); }

        const data = await dataQuery;
        const finalData = (this.fileConfig) ? data.map(record => ({ ...record, photoUrl: record.photo_filename ? `/api/${this.fileConfig.folderName}/${record.id}/photo` : null, })) : data;

        return { data: finalData, totalRecords };
    }
}

module.exports = ResourceModel;