import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { icons } from '../../config/icons';
import { validationRules } from '../../utils/validation';

const Lbl = ({ req, sfx }) => {
    if (typeof sfx !== 'undefined') return sfx ? <span className="suffix" dangerouslySetInnerHTML={{ __html: sfx }} /> : null;
    return req ? <span className="required">*</span> : null;
};
const getErr = (err, val) => {
    if (err === undefined || err === null || err === false) return { hasErr: false, msg: null };
    const msg = typeof err === 'string' ? err : ((val === '' || val == null) ? 'This field is required' : 'This field is invalid');
    return { hasErr: true, msg };
};

export const FormInput = ({ label, name, type = 'text', value, defaultValue, error, onChange, onBlur, placeholder, required, suffix, iconLeft, iconRight, onIconRightClick, hints, className = '', inputClass = '', inputRef, ...p }) => {
    const { hasErr, msg } = getErr(error, value);
    const isDouble = iconRight && hasErr;
    const rightClass = isDouble ? 'right-double' : (iconRight || hasErr ? 'right' : '');

    return (
        <div className={`input-case ${hasErr ? 'invalid' : ''} ${className}`}>
            {label && <p>{label} <Lbl req={required} sfx={suffix} /></p>}
            <div className={`input-group ${iconLeft ? 'left' : ''} ${rightClass}`}>
                <input ref={inputRef} type={type} name={name} value={value} defaultValue={defaultValue} onChange={onChange} onBlur={onBlur} placeholder={placeholder} className={`${iconLeft ? 'left' : ''} ${rightClass} ${inputClass}`} {...p} required={!!required} />
                {iconLeft && <Icon icon={iconLeft} className="input-icon" />}
                {iconRight && <Icon icon={iconRight} className="input-icon right" onClick={onIconRightClick} />}
                {hasErr && <Icon icon={icons.invalid} className={`input-icon right ${isDouble ? 'error-icon' : ''}`} />}
            </div>
            {msg && <em>{msg}</em>}
            {hints && <small>{hints}</small>}
        </div>
    );
};

export const FormSelect = ({ label, name, value, defaultValue, error, onChange, onBlur, options = [], required, suffix, placeholder = 'Select', className = '', inputClass = '', inputRef, ...p }) => {
    const { hasErr, msg } = getErr(error, value);
    return (
        <div className={`input-case ${hasErr ? 'invalid' : ''} ${className}`}>
            {label && <p>{label} <Lbl req={required} sfx={suffix} /></p>}
            <div className="input-group">
                <select ref={inputRef} name={name} value={value} defaultValue={defaultValue} onChange={onChange} onBlur={onBlur} className={inputClass} {...p} required={!!required}>
                    <option value="">{placeholder}</option>
                    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {hasErr && <Icon icon={icons.invalid} className="input-icon right" />}
            </div>
            {msg && <em>{msg}</em>}
        </div>
    );
};

export const FormTextarea = ({ label, name, value, defaultValue, error, onChange, onBlur, placeholder, required, suffix, className = '', inputClass = '', inputRef, rows = 3, ...p }) => {
    const { hasErr, msg } = getErr(error, value);
    return (
        <div className={`input-case ${hasErr ? 'invalid' : ''} ${className}`}>
            {label && <p>{label} <Lbl req={required} sfx={suffix} /></p>}
            <div className="input-group">
                <textarea ref={inputRef} name={name} value={value} defaultValue={defaultValue} onChange={onChange} onBlur={onBlur} placeholder={placeholder} rows={rows} className={inputClass} {...p} required={!!required} />
                {hasErr && <Icon icon={icons.invalid} className="input-icon right" />}
            </div>
            {msg && <em>{msg}</em>}
        </div>
    );
};

export const FormToggle = ({ label, name, checked, onChange, description, className = '', ...p }) => (
    <div className={`input-case ${className}`}>
        {label && <p>{label}</p>}
        {description && <small style={{ marginTop: '-5px' }}>{description}</small>}
        <div className="toggle-switch">
            <label><input type="checkbox" name={name} checked={!!checked} onChange={onChange} {...p} /><span></span></label>
        </div>
    </div>
);

export const FormSearchableSelect = ({ label, name, value, error, options = [], defaultOptions = [], loading = false, renderOption, onChange, placeholder = 'Search', required, suffix, iconRight, onIconRightClick, iconRightClass = '', className = '', inputRef, ...p }) => {
    const { hasErr, msg } = getErr(error, value);
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(query.toLowerCase())
    );

    const displayOptions = query ? filteredOptions : defaultOptions;

    const handleSelect = (option) => {
        setQuery(option.label);
        setIsOpen(false);
        if (onChange) {
            onChange({ target: { name, value: option.value } });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            const selected = options.find(opt => opt.value === value);
            if (selected) setQuery(selected.label);
            else setQuery(value);
        } else {
            setQuery('');
        }
    }, [value, options]);

    const handleInputChange = (e) => {
        const newVal = e.target.value;
        setQuery(newVal);
        setIsOpen(true);
        if (onChange) onChange({ target: { name, value: newVal } });
    };

    const isDouble = !!iconRight;
    const rightClass = isDouble ? 'right-double' : 'right';

    return (
        <div className={`input-case ${hasErr ? 'invalid' : ''} ${className}`} ref={containerRef}>
            {label && <p>{label} <Lbl req={required} sfx={suffix} /></p>}
            <div className='search-input-case'>
                <div className={`input-group left ${rightClass} ${isOpen ? 'active' : ''} ${hasErr ? 'invalid' : ''}`}>
                    <input ref={inputRef} type='text' name={name} placeholder={placeholder} value={query} onChange={handleInputChange} onFocus={() => setIsOpen(true)} autoComplete="off" {...p} />
                    <Icon icon={icons.search} className='input-icon' />
                    {iconRight && <Icon icon={iconRight} className={`input-icon right ${iconRightClass}`} onClick={onIconRightClick} />}
                    <Icon icon={isOpen ? icons.chevronUp : icons.chevronDown} className='input-icon right' />
                </div>
                {isOpen && (displayOptions.length > 0 || query || loading) && (
                    <ul className='search-input-dropdown scrollbar-small'>
                        {loading ? (
                            <li className='search-input-no-result'>Searching...</li>
                        ) : displayOptions.length > 0 ? (
                            displayOptions.map((opt, i) => (
                                <li key={i} className={`${query === opt.label ? 'selected' : ''}`} onClick={() => handleSelect(opt)} >
                                    {renderOption ? renderOption(opt) : <div className='search-input-item'>{opt.label}</div>}
                                </li>
                            ))
                        ) : (
                            query && <li className='search-input-no-result'>No matches found for "{query}"</li>
                        )}
                    </ul>
                )}
            </div>
            {msg && <em>{msg}</em>}
        </div>
    );
};


export const FormPassword = ({ label, name, value, error, onChange, onBlur, onFocus, placeholder = 'Password', required, suffix, iconLeft = icons.key, className = '', inputRef, minChars = 6, noHints = false, ...p }) => {
    const [show, setShow] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const validations = validationRules.passwordComplexity(value, minChars);

    const isAllValid = Object.values(validations).every(Boolean);
    const { hasErr } = getErr(error, value);
    const displayError = (!noHints && hasErr && !isAllValid) ? 'Password does not meet requirements' : error;

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <FormInput
            type={show ? 'text' : 'password'}
            label={label}
            name={name}
            value={value}
            error={displayError}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            suffix={suffix}
            iconLeft={iconLeft}
            iconRight={show ? icons.eyeSlash : icons.eye}
            onIconRightClick={() => setShow(!show)}
            className={className}
            inputRef={inputRef}
            hints={!noHints && (isFocused || hasErr || (value && !isAllValid)) && (
                <ul className="input-hints">
                    <li className={validations.length ? 'valid' : (hasErr ? 'invalid' : '')}>- Minimum {minChars} characters</li>
                    <li className={validations.uppercase ? 'valid' : (hasErr ? 'invalid' : '')}>- At least one uppercase letter</li>
                    <li className={validations.number ? 'valid' : (hasErr ? 'invalid' : '')}>- At least one number</li>
                    <li className={validations.special ? 'valid' : (hasErr ? 'invalid' : '')}>- At least one special character</li>
                </ul>
            )}
            {...p}
        />
    );
};

export const FormDateSelect = ({ label, name, value, error, onChange, required, suffix, className = '', ...p }) => {
    const { hasErr, msg } = getErr(error, value);

    // Internal state to track parts independently of the parent value
    // This prevents dropdowns from resetting when the parent value is '' (incomplete)
    const [parts, setParts] = useState(() => {
        const p = value ? value.split('-') : ['', '', ''];
        return { y: p[0] || '', m: p[1] || '', d: p[2] || '' };
    });

    // Sync internal state if the value prop changes from outside (e.g. form reset)
    useEffect(() => {
        const p = value ? value.split('-') : ['', '', ''];
        setParts({ y: p[0] || '', m: p[1] || '', d: p[2] || '' });
    }, [value]);

    const handlePartChange = (part, newVal) => {
        const newParts = { ...parts, [part]: newVal };
        setParts(newParts);

        // Only send the full date if all parts are present
        // If incomplete, we send '' so that parent 'required' validation fails
        const isComplete = newParts.y && newParts.m && newParts.d;
        const newDate = isComplete ? `${newParts.y}-${newParts.m.padStart(2, '0')}-${newParts.d.padStart(2, '0')}` : '';
        
        if (onChange) onChange({ target: { name, value: newDate } });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        { v: '01', l: 'January' }, { v: '02', l: 'February' }, { v: '03', l: 'March' },
        { v: '04', l: 'April' }, { v: '05', l: 'May' }, { v: '06', l: 'June' },
        { v: '07', l: 'July' }, { v: '08', l: 'August' }, { v: '09', l: 'September' },
        { v: '10', l: 'October' }, { v: '11', l: 'November' }, { v: '12', l: 'December' }
    ];

    const getDaysInMonth = (y, m) => {
        if (!y || !m) return 31;
        return new Date(y, m, 0).getDate();
    };
    const daysCount = getDaysInMonth(parts.y || 2000, parts.m || 1);
    const days = Array.from({ length: daysCount }, (_, i) => i + 1);

    return (
        <div className={`input-case ${hasErr ? 'invalid' : ''} ${className}`}>
            {label && <p>{label} <Lbl req={required} sfx={suffix} /></p>}
            <div className='select-date-group'>
                <select value={parts.m} onChange={(e) => handlePartChange('m', e.target.value)} className={`w-month ${!parts.m ? 'is-placeholder' : ''}`} name={`${name}_month`} autoComplete='off'>
                    <option value=''>Month</option>
                    {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
                <select value={parts.d} onChange={(e) => handlePartChange('d', e.target.value)} className={`w-day ${!parts.d ? 'is-placeholder' : ''}`} name={`${name}_day`} autoComplete='off'>
                    <option value=''>Day</option>
                    {days.map(d => <option key={d} value={String(d).padStart(2, '0')}>{d}</option>)}
                </select>
                <select value={parts.y} onChange={(e) => handlePartChange('y', e.target.value)} className={`w-year ${!parts.y ? 'is-placeholder' : ''}`} name={`${name}_year`} autoComplete='off'>
                    <option value=''>Year</option>
                    {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
            </div>
            {msg && <em>{msg}</em>}
        </div>
    );
};

