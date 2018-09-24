import React from "react"
import {List,ListItem,ListItemText,ListItemIcon} from "@material-ui/core";


const CustomList = ({options}) =>
    <List >
        {options.map( (option,index) =>
            <ListItem button key={index} onClick={option.action}>
                <ListItemIcon>
                    {option.icon}
                </ListItemIcon>
                <ListItemText>
                    {option.label}
                </ListItemText>
            </ListItem>)}
    </List>;


export default CustomList