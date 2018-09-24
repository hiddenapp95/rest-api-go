import {deleteKey, getValueFromKey, isKeyPresent, setKeyValue} from "./localStorage";

const authInfoKey = 'AuthToken';

export const isAuthInfoPresent = () => isKeyPresent(authInfoKey);

export const setAuthInfo = (value) => setKeyValue(authInfoKey,value);

export const getAuthInfo = () => getValueFromKey(authInfoKey);

export const removeAuthInfo = () => deleteKey(authInfoKey);
