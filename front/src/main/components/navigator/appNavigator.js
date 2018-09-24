import React from 'react';
import DrawerContent from "./drawerContent";
import {Drawer,Toolbar} from '@material-ui/core';

const AppDrawer = ({open,handleClose,handleNavigationClick,routes,mainRoute}) =>
    <Drawer
        open={open}
        onClose={()=>handleClose()}
        anchor="left"
        width={240}
    >
        <Toolbar/>
        <DrawerContent routes={routes} mainRoute={mainRoute} handleNavigationClick={handleNavigationClick}  />
    </Drawer>;

export default AppDrawer