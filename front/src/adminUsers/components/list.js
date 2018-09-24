import React from "react";
import {List} from "@material-ui/core";
import CustomListItem from "./listItem";


const CustomList = ({users,handleEditButtonClick,handleDeleteButtonClick}) =>
    users?
        <List>
            {users.map(user=><CustomListItem key={user.email}
                                             handleDeleteButtonClick={()=>handleDeleteButtonClick(user._id)}
                                             user={user}
                                             handleEditButtonClick={()=>handleEditButtonClick(user)}/>)}
        </List>:null;

export default CustomList