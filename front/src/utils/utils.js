import React from "react";
import moment from "moment";
import CheckIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const textReg = /^[a-zA-Z0-9\s]+$/;
//const textReg = /^[a-zA-Z]+$/;
const numberReg = /^(\d)+$/;
const timeReg = /([0-9]{2})(:)([0-9]{2})/;
const boolReg = /^(true|false)$/;
//select = true.
//multiple-select
export const valueIsOfType = (value,type) =>{

    if(value === undefined || value === null)
        return false;

    switch(type){
        case "boolean": return boolReg.test(value);
        case "text": return textReg.test(value);
        case "number": return numberReg.test(value);
        case "email": return emailReg.test(value);
        case "time": return timeReg.test(value);
        case "date": return moment(value).isValid();
        default: return true
    }
};

export const getIconFromValue = (value,type) =>
    valueIsOfType(value,type)?  <CheckIcon className={"check-icon"} /> : <WarningIcon className={"warning-icon"} />;
