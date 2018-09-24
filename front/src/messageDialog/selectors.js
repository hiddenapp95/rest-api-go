import NAME from "./constants";
import {getMessage, getTitle} from "./utils";

export const getDialogMessage = (state) => getMessage(state[NAME].message);

export const getDialogTitle = (state) => getTitle(state[NAME].message);

export const getConfirmCallback = (state) => state[NAME].confirmCallback || (()=>{});

export const getCancelCallback = (state) => state[NAME].cancelCallback || (()=>{});

export const getDialogState = (state) => state[NAME].dialogIsOpen;
