import React from "react";
import {ListItem,Avatar,ListItemText,IconButton} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {userRoles} from "../../shared";
import DeleteIcon from "@material-ui/icons/Delete";

const CustomListItem = ({user,handleEditButtonClick,handleDeleteButtonClick}) =>
    user?
        <ListItem button>
            <Avatar>
                {userRoles.find(role=>role.name===user.userRole).icon}
            </Avatar>
            <ListItemText primary={user.name} secondary={user.email + " - " + userRoles.find(role=>role.name===user.userRole).label} />
            <IconButton  onClick={handleDeleteButtonClick}>
                <DeleteIcon/>
            </IconButton>
            <IconButton  onClick={handleEditButtonClick}>
                <EditIcon/>
            </IconButton>
        </ListItem>:null;

export default CustomListItem