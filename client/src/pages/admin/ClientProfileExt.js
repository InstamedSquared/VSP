import React from 'react';
import Icon from '../../components/common/Icon';
import { icons } from '../../config/icons';

const ClientProfileExt = ({ user }) => {
    return (
        <div className='flex-row'>
            <div className='pagelet'>
                <div className='pagelet-head'> <h4><Icon icon={icons.book} />Client Contracts & Materials</h4> </div>
                <div className='pagelet-in'>
                    <ul>
                        <li>
                            <Icon icon={icons.file} />
                            <span>
                                <p>Active Contracts</p>
                                <h4>{user.contracts?.length > 0 ? user.contracts.map(c => c.title).join(', ') : 'No active contracts'}</h4>
                            </span>
                        </li>
                        <li>
                            <Icon icon={icons.book} />
                            <span>
                                <p>Training Materials</p>
                                <h4>{user.training_materials?.length > 0 ? user.training_materials.map(t => t.title).join(', ') : 'No training materials uploaded'}</h4>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ClientProfileExt;
