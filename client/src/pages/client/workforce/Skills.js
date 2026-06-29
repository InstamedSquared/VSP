import React from 'react';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';

const p_table = "Skills Inventory";
const tableService = createResourceService('v1/client/my-skills');

const Skills = () => {
    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.employee_fn} ${item.employee_sn}`}</b></div>
                </div>
            )
        },
        { key: 'skill_name', label: 'Skill', type: 1, sortable: true, render: (item) => <b>{item.skill_name}</b> },
        { key: 'proficiency_level', label: 'Proficiency', type: 1, sortable: true, render: (item) => {
            const map = {
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
                expert: 'Expert'
            };
            return map[item.proficiency_level] || item.proficiency_level;
        } },
        { key: 'years_experience', label: 'Experience (Years)', type: 1, sortable: true, render: (item) => { return item.years_experience ? `${item.years_experience} yrs` : '-'; } },
    ], []);

    return (
        <DataTable
            resourceName={p_table}
            apiService={tableService}
            columns={tableColumns}
            config={{ 
                searchables: ['employee_fn', 'employee_sn', 'skill_name', 'proficiency_level'], 
                title: <span><h2>Skills Inventory</h2><p>View the skills and proficiencies of your assigned workforce</p></span>, 
                add: false,
                edit: false,
                delete: false,
                hasRowAction: false
            }}
        />
    );
};

export default Skills;
