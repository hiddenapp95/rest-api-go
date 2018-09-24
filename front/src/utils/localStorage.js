export const isKeyPresent = (key) => key && !!localStorage.getItem(key);

export const setKeyValue = (key,value) => {
    if(key && value)
        localStorage.setItem(key,JSON.stringify(value));
};

export const getValueFromKey = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
};

export const getPropertyFromKey = (key,prop) => {
    try {
        return JSON.parse(localStorage.getItem(key))[prop];
    } catch (e) {
        return null;
    }
};

export const deleteKey = (key) => localStorage.removeItem(key);


