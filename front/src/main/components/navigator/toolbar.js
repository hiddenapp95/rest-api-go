import React from 'react';
import {AppBar,Typography,Toolbar,IconButton} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";

const styles = {
    menuIcon: {color:"white"}
};

const CustomToolbar = ({title, menuButtonClickHandler}) =>
    <AppBar position="static" id={"appBar"}>
        <Toolbar>
            <IconButton style={styles.menuIcon} onClick={menuButtonClickHandler}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="title" color="inherit" >
                {title}
            </Typography>
        </Toolbar>
    </AppBar>;

export default CustomToolbar;