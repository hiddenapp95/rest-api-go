import React from "react";
import {DialogContentText} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRightAlt";

const CustomDialogContent = ({message}) =>
        <DialogContentText id="alert-dialog-description">
            {message}
        </DialogContentText>;

export default CustomDialogContent