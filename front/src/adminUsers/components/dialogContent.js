import React from "react";
import {DialogContent,DialogActions,Button,TextField} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRightAlt";
import {strings} from "../../localization/strings";
import CustomSelect from "./select";
import {userRoles} from "../../shared";

class CustomDialogContent extends React.Component{
    state={selectedRole:this.props.user.userRole,name:this.props.user.name};

    handleRoleChange = (value) => this.setState({selectedRole:value});

    render(){
        const {user,handleClose,handleConfirm} = this.props;
        const {selectedRole,name} = this.state;
        return <React.Fragment>
                    <DialogContent key={"content"}>
                        <p>{user.email}</p>
                        <p>{userRoles.find(role=>role.name===user.userRole).label}</p>
                        <ArrowRightIcon/>
                        <CustomSelect options={userRoles} value={selectedRole} handleChange={this.handleRoleChange}/>
                        <TextField key="input" label="Nombre" value={name}
                                   onChange={(e)=>this.setState({name: e.target.value})}/>,
                    </DialogContent>
                    <DialogActions key={"actions"}>
                        <Button onClick={handleClose} color="primary">
                            {strings.cancelDialogLabel}
                        </Button>
                        <Button onClick={()=> {handleConfirm(name,selectedRole,user._id);handleClose();}} color="primary">
                            {strings.confirmDialogLabel}
                        </Button>
                    </DialogActions>
                </React.Fragment>
    }
}

export default CustomDialogContent;