import React from "react"
import {connect} from "react-redux";
import { createStructuredSelector } from 'reselect';
import List from "./list";
import Dialog from "./dialog";
import {getFilteredUsers, isLoading} from "../selectors";
import {getUsersAction, addUserAction, updateUserRoleAction, deleteUserAction, updateUserAction} from "../actions";
import {openMessageDialog} from "../../messageDialog";
import SearchInput from "./search";
import {handleFilterChange} from "../actions";
import AddNewEmail from "./newEmail";
import {strings} from "../../localization/strings";
import {errors} from "../../localization/errors";
import Loader from "../../loader";

class AdminUsers extends React.Component {

    state={dialogIsOpen:false,userSelected:null};

    render() {
        const {users,showLoader} = this.props;
        const {dialogIsOpen,userSelected} = this.state;

        return  <section id="admin-users">
                    {showLoader ?<Loader/>:null}
                    <SearchInput handleSearch={(value)=>this.props.dispatch(handleFilterChange(value))}/>
                    <AddNewEmail handleSaveEmail={this.addUser}/>
                    <List users={users} handleEditButtonClick={this.openDialog} handleDeleteButtonClick={this.deleteUser}/>
                    <Dialog open={dialogIsOpen}
                            handleClose={this.closeDialog}
                            handleConfirm={this.updateUserRole}
                            user={userSelected}/>
                </section>
    }

    componentDidMount(){ this.props.dispatch(getUsersAction) };
    openDialog = (user) => this.setState({dialogIsOpen:true,userSelected:user});
    closeDialog = () => this.setState({dialogIsOpen:false});
    updateUserRole = (name,role,id) => this.props.dispatch(updateUserAction(name,role,id));
    addUser = (name,email,role) => this.props.dispatch(addUserAction(name,email,role));
    deleteUser = (id) => this.props.dispatch(openMessageDialog({message:strings.deleteUserDialogMessage,title:strings.deleteUserDialogTitle},()=>this.props.dispatch(deleteUserAction(id))));

}

export default connect(
    createStructuredSelector({
        users: getFilteredUsers,
        showLoader: isLoading
    })
)(AdminUsers);