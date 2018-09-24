import React from "react";
import {Dialog,DialogContent,DialogTitle,DialogActions,Button}from "@material-ui/core";
import {strings} from "../../localization/strings";
import CustomDialogContent from "./dialogContent";
import { createStructuredSelector } from 'reselect';
import {getCancelCallback, getConfirmCallback, getDialogMessage, getDialogState, getDialogTitle} from "../selectors";
import {connect} from "react-redux";
import {closeMessageDialog} from "../actions";

const CustomDialog = ({open,onConfirm,onClose,message,title,dispatch}) =>
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <CustomDialogContent message={message}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>{onClose();dispatch(closeMessageDialog)}} color="primary">
                {strings.cancelDialogLabel}
            </Button>
            <Button onClick={()=>{onConfirm();dispatch(closeMessageDialog)}} color="primary">
                {strings.confirmDialogLabel}
            </Button>
        </DialogActions>
    </Dialog>;


export default connect(
    createStructuredSelector({
        open: getDialogState,
        onConfirm: getConfirmCallback,
        onClose: getCancelCallback,
        message: getDialogMessage,
        title: getDialogTitle
    })
)(CustomDialog);