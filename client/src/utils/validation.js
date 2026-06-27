export const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(09|\+639)\d{9}$/,
    password: {
        uppercase: /[A-Z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    }
};

export const validationRules = {
    required: (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        return true;
    },
    email: (value) => regex.email.test(value),
    phone: (value) => regex.phone.test(value),
    passwordComplexity: (password, min = 6) => {
        return {
            length: (password || '').length >= min,
            uppercase: regex.password.uppercase.test(password || ''),
            number: regex.password.number.test(password || ''),
            special: regex.password.special.test(password || '')
        };
    },
    match: (value, matchValue) => value === matchValue
};

export const validateField = (name, value, rules = {}, allValues = {}) => {
    const errors = [];
    const displayName = rules.label || name;
    
    if (rules.required && !validationRules.required(value)) {
        errors.push(`${displayName} is required`);
    }
    
    if (value && rules.type === 'email' && !validationRules.email(value)) {
        errors.push('Please enter a valid email address');
    }
    
    if (value && rules.type === 'phone' && !validationRules.phone(value)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (value && rules.type === 'password' && rules.complex) {
        const complexity = validationRules.passwordComplexity(value, rules.minLength || 6);
        if (!Object.values(complexity).every(Boolean)) {
            errors.push('Password does not meet requirements');
        }
    }

    if (rules.match && !validationRules.match(value, allValues[rules.match])) {
        errors.push(rules.matchError || `${name} does not match`);
    }
    
    return errors.length > 0 ? errors[0] : null;
};
