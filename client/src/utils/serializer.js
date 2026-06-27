const DEFAULT_KEY = process.env.REACT_APP_SERIALIZER_KEY || 'fallback_key';         // 'j2er7ic';
const PADDING_CHAR = '\0';

const xorCipher = (str, key) => { return String.fromCharCode(...str.split('').map((char, i) => char.charCodeAt(0) ^ key.charCodeAt(i % key.length)) ); };

const encode = (value, key = DEFAULT_KEY, padToLength = 16) => {
    if (value === null || value === undefined) return '';  
    let valueStr = String(value);
    
    if(valueStr.length < padToLength){ valueStr = valueStr.padStart(padToLength, PADDING_CHAR); }
    const xored = xorCipher(valueStr, key);
    
    return btoa(xored).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const decode = (encodedValue, key = DEFAULT_KEY) => {
    if(!encodedValue) return '';
    
    let base64 = encodedValue.replace(/-/g, '+').replace(/_/g, '/');
    while(base64.length % 4){ base64 += '='; }

    try {
        const decodedB64 = atob(base64);
        const xored = xorCipher(decodedB64, key);
        return xored.replace(new RegExp(`^${PADDING_CHAR}+`), '');
    } 
    catch(e){ console.error("Decoding failed:", e); return null; }
};

export const Serializer = {encode, decode, };