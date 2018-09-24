import {errors} from "../localization/errors";

export const getMessage = (messageObject) => {
    try{
        if(typeof messageObject === "string")
            return messageObject;
        if(messageObject.message && messageObject.message !== "Network Error")
            return messageObject.message;

        return errors[messageObject.response.data.errorType] || errors.defaultError;
    }catch(error){
        return errors.defaultError;
    }
};

export const getTitle = (messageObject) =>
    messageObject && messageObject.title ?
        messageObject.title:
        errors.defaultDialogTitle;