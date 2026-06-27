import { useState, useCallback, useRef } from 'react';
import { validateField } from '../utils/validation';

/**
 * Custom hook for form management
 * @param {Object} initialValues - Initial form state
 * @param {Object} schema - Validation rules for each field
 */
const useForm = (initialValues = {}, schema = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const fieldRefs = useRef({});

    // Use refs to keep track of the latest dependencies without triggering re-renders or function identity changes
    const initialValuesRef = useRef(initialValues);
    const schemaRef = useRef(schema);
    const valuesRef = useRef(values);

    // Keep refs up to date
    initialValuesRef.current = initialValues;
    schemaRef.current = schema;
    valuesRef.current = values;

    // Register a field ref for scrolling and focusing
    const registerRef = useCallback((name) => (el) => {
        if (el) fieldRefs.current[name] = el;
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setValues(prev => {
            const newValues = { ...prev, [name]: fieldValue };
            valuesRef.current = newValues; // Update ref immediately
            return newValues;
        });

        // Clear error when user starts typing/changing
        setErrors(prev => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });

        // Real-time validation if specified in schema
        const currentSchema = schemaRef.current[name];
        if (currentSchema?.validateOnChange) {
            const error = validateField(name, fieldValue, currentSchema, valuesRef.current);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, []); // No dependencies needed anymore thanks to refs

    const validateAll = useCallback(() => {
        const newErrors = {};
        let firstErrorField = null;
        const currentSchema = schemaRef.current;
        const currentValues = valuesRef.current;

        Object.keys(currentSchema).forEach(name => {
            const error = validateField(name, currentValues[name], currentSchema[name], currentValues);
            if (error) {
                newErrors[name] = error;
                if (!firstErrorField) firstErrorField = name;
            }
        });

        setErrors(newErrors);

        if (firstErrorField && fieldRefs.current[firstErrorField]) {
            fieldRefs.current[firstErrorField].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            fieldRefs.current[firstErrorField].focus();
        }

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    }, []);

    const handleSubmit = useCallback((callback) => (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const { isValid } = validateAll();
        if (isValid && callback) {
            callback(valuesRef.current);
        }
    }, [validateAll]);

    const resetForm = useCallback(() => {
        setValues(initialValuesRef.current);
        setErrors({});
        valuesRef.current = initialValuesRef.current;
    }, []);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
        registerRef,
        setValues,
        setErrors,
        validateAll
    };
};

export default useForm;
