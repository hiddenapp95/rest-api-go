import React from "react";
import {Dialog,DialogContentText,DialogContent,DialogTitle,DialogActions,Button}from "@material-ui/core";
import {strings} from "../../localization/strings";
import CustomDialogContent from "./dialogContent";

const CustomDialog = ({open,handleConfirm,handleClose,user}) =>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{strings.editUserDialogTitle}</DialogTitle>
        <CustomDialogContent user={user} handleClose={handleClose} handleConfirm={handleConfirm}/>
    </Dialog>;

export default CustomDialog