import React from "react";
import {IconButton,Button,TextField,InputAdornment} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EmailIcon from "@material-ui/icons/Email";
import CustomSelect from "./select";
import {userRoles} from "../../shared";
import {strings} from "../../localization/strings";
import {openMessageDialog} from "../../messageDialog/actions";
import {errors} from "../../localization/errors";
import {connect} from "react-redux";
import {getIconFromValue, valueIsOfType} from "../../utils/utils";


class AddNewEmail extends React.Component{
    state={showInputs:false,email:"",role:"",name:""};

    render(){
        const {showInputs,email,name,role} = this.state;
        return  <div id="new-email" >
                    {showInputs?
                        [
                            <div>
                                <TextField key="input-email" label="email" value={email}
                                           InputProps={{
                                               endAdornment: getIconFromValue(email,"email")
                                           }}
                                           onChange={(e)=>this.handleInputChange(e.target.value,"email")}/>
                            </div>,
                            <div>
                                <TextField key="input-name"
                                           label="nombre"
                                           value={name}
                                           InputProps={{
                                               endAdornment: getIconFromValue(name,"text")
                                           }}
                                           onChange={(e)=>this.handleInputChange(e.target.value,"name")}/>
                            </div>,
                            <div>
                                <CustomSelect key="select" options={userRoles} value={role}
                                    handleChange={(value)=>this.handleInputChange(value,"role")}/>
                            </div>,
                            <div>
                                <IconButton key="icon" onClick={this.handleConfirm}>
                                    <AddIcon/>
                                </IconButton>
                            </div>
                        ]:
                        <Button variant="contained" size="small" onClick={this.showInputs}>
                            {strings.newEmail}
                            <EmailIcon/>
                        </Button>}
                </div>;
    }

    showInputs = () => this.setState({showInputs:true});
    hideInputs = () => this.setState({showInputs:false,email:"",role:""});
    handleConfirm = () => {
        const {name,email,role} = this.state;
        if(!name || name==="" || !email || !valueIsOfType(email,"email") || !role || role===""){
            this.props.dispatch(openMessageDialog({message: errors.completeWithValidInformation}));
            return;
        }

        this.props.handleSaveEmail(this.state.name,this.state.email,this.state.role);
        this.hideInputs();
    };
    handleInputChange = (value,prop) => this.setState({[prop]:value});
}

export default connect()(AddNewEmail)
