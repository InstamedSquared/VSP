import React from 'react';

const blueprints = {
    profile: [
        [{ type: 'avatar' }, { type: 'group', children: [{ width: 5 }, { width: 6 }] }],
        [{ type: 'line', width: 9 }],
        [{ type: 'line', width: 8 }],
    ],
    profileSquare: [
        [{ type: 'profile' }, { type: 'group', children: [{ width: 5 }, { width: 6 }] }],
        [{ type: 'line', width: 9 }],
        [{ type: 'line', width: 8 }],
    ],
    list: [{ count: 1, row: [{ type: 'line', width: 100 }] }],
    column: [{ count: 1, row: [{ type: 'line', width: 5 }, { type: 'line', width: 5 }] }],
    cards: [{ count: 1, row: [{ type: 'line', width: 25 }, { type: 'line', width: 25 }, { type: 'line', width: 25 }, { type: 'line', width: 25 }] }],
    table: [
        { count: 1, row: [{ type: 'line', width: 100 }] },
        { count: 6, row: [{ type: 'line', width: 4 }, { type: 'line', width: 6 }] },
    ],
    form: [
        { count: 1, row: [{ type: 'line', width: 3 }] },
        { count: 4, row: [{ type: 'line', width: 5 }, { type: 'line', width: 5 }] },
        { count: 2, row: [{ type: 'line', width: 100 }] },
    ],
};

const LoaderCell = ({ cell }) => {
    switch (cell.type) {
        case 'avatar':
            return <i className='is-loading avatar'></i>;
        case 'profile':
            return <i className='is-loading profile'></i>;
        case 'group':
            return (<span> {cell.children.map((child, index) => (<i key={index} className={`is-loading w${child.width}`}></i>))}</span>);
        default:
            const widthClass = cell.width === 100 ? 'w100' : `w${cell.width}`;
            return <i className={`is-loading ${widthClass}`}></i>;
    }
};


const PageLoader = ({ type, blueprint, count = 1, asPagelet = false, className = '' }) => {
    const finalBlueprint = blueprint || blueprints[type] || [];

    const renderBlueprint = () => {
        return finalBlueprint.map((rowItem, rowIndex) => {
            if (rowItem.count && rowItem.row) {
                return Array.from({ length: rowItem.count }).map((_, i) => (
                    <div key={`${rowIndex}-${i}`} className='is-loading-row'>
                        {rowItem.row.map((cell, cellIndex) => (<LoaderCell key={cellIndex} cell={cell} />))}
                    </div>));
            }
            if (Array.isArray(rowItem)) {
                return (
                    <div key={rowIndex} className='is-loading-row'>
                        {rowItem.map((cell, cellIndex) => (
                            <LoaderCell key={cellIndex} cell={cell} />
                        ))}
                    </div>);
            }
            return null;
        });
    };

    const loaderContent = (
        <div className={`is-loading-wrap ${className}`}>
            {Array.from({ length: count }).map((_, i) => (<React.Fragment key={i}>{renderBlueprint()}</React.Fragment>))}
        </div>);

    if (asPagelet) {
        return (<div className='pagelet'><div className='pagelet-in'>{loaderContent}</div></div>);
    }

    return loaderContent;
};

export default React.memo(PageLoader);