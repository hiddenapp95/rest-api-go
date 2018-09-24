import React from "react";
import {AppBar,Typography,Toolbar} from '@material-ui/core';

export const CustomToolbar = ({title}) =>
    <AppBar position="static" id={"appBar"}>
        <Toolbar>
            <Typography variant="title" color="inherit" >
                {title}
            </Typography>
        </Toolbar>
    </AppBar>;
