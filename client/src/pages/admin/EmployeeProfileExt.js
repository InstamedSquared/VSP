import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const EmployeeProfileExt = ({ user, handleToggle }) => {
    return (
        <div className='flex-row'>
            <div className='pagelet'>
                <div className='pagelet-head'> <h4><Icon icon={icons.users} />Workforce Information</h4> </div>
                <div className='pagelet-in'>
                    <ul>
                        <li>
                            <Icon icon={icons.layoutDashboard} />
                            <span>
                                <p>Bench Status</p>
                                <h4>{user.bench_status?.status || 'No Status Set'}</h4>
                            </span>
                        </li>
                        <li>
                            <Icon icon={icons.book} />
                            <span>
                                <p>Skills Inventory</p>
                                <h4>{user.skills?.length > 0 ? user.skills.map(s => s.skill_name).join(', ') : 'No skills listed'}</h4>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfileExt;
