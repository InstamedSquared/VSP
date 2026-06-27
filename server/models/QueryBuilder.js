const db = require('../config/db');

class QueryBuilder {
    constructor(tableNameOrAlias) {
        if (typeof tableNameOrAlias === 'string') {
            this.tableName = tableNameOrAlias;
            this.tableRef = tableNameOrAlias;
            this.tableAlias = tableNameOrAlias;
        } 
        else if (typeof tableNameOrAlias === 'object' && tableNameOrAlias !== null) {
            const alias = Object.keys(tableNameOrAlias)[0];
            const name = tableNameOrAlias[alias];
            if (!alias || !name) {
                throw new Error('Invalid alias object. Must be in the format { alias: "tableName" }');
            }
            this.tableName = name;                  // The real table name, e.g., 'users'
            this.tableRef = { [alias]: name };      // The reference Knex will use, e.g., { u: 'users' }
            this.tableAlias = alias;                // The alias, e.g., 'u'
        } 
        else { throw new Error('Invalid argument for ResourceModel. Must be a string or an alias object.'); }
    }

    _toSql(query, toSqlFlag) { if(toSqlFlag){ return query.toSQL().toNative(); } return query; }
    
    insert(data, toSql = false)         { const query = db(this.tableName).insert(data); return this._toSql(query, toSql); }
    update(where, data, toSql = false)  { const query = db(this.tableRef).where(where).update(data); return this._toSql(query, toSql); }
    delete(where, toSql = false)        { const query = db(this.tableRef).where(where).del(); return this._toSql(query, toSql); }
    async query(sql, bindings = [])     { const [results] = await db.raw(sql, bindings); return results; }

    select(columns = '*', where = {}, joins = [], toSql = false)
    { 
        const query = db(this.tableRef).where(where);

        if (Array.isArray(joins) && joins.length > 0) {
            joins.forEach(join => {
                const { type, table, on } = join;
                
                // Ensure the 'on' clause is correctly formatted
                if (!table || !Array.isArray(on) || on.length !== 3) { throw new Error(`Invalid join object provided for table '${this.tableName}'. A join must have a 'table' and an 'on' array with 3 elements.`); }
                
                const [column1, operator, column2] = on;

                switch (type.toLowerCase()) {
                    case 'left':
                        query.leftJoin(table, column1, operator, column2);
                        break;
                    case 'right':
                        query.rightJoin(table, column1, operator, column2);
                        break;
                    case 'outer':
                        query.outerJoin(table, column1, operator, column2);
                        break;
                    case 'full_outer':
                        query.fullOuterJoin(table, column1, operator, column2);
                        break;
                    case 'cross':
                        query.crossJoin(table);
                        break;
                    case 'inner':
                    default:
                        query.innerJoin(table, column1, operator, column2);
                        break;
                }
            });
        }
        
        query.select(columns);
        return this._toSql(query, toSql);    
    }    
    
}

module.exports = QueryBuilder;