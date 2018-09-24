import React from 'react'
import {Avatar,ListSubheader,List,ListItem,ListItemText} from "@material-ui/core";
import MainIcon from "../../../assets/images/ieric-logo.jpg";
import {strings} from "../../../localization/strings";


const DrawerContent = ({handleNavigationClick,routes, mainRoute}) =>
    <div id="drawer-content">
        {/*<Typography color={"primary"} variant={"title"} style={styles.header}*/}
            {/*onClick={()=>handleNavigationClick(routes.main.path,routes.main.title)}>*/}
            {/*{strings.toolbarDefaultTitle}*/}
        {/*</Typography>*/}
        <img src={MainIcon} alt="Logo" id="drawer-logo" onClick={()=>handleNavigationClick(mainRoute.path,mainRoute.title)}/>

        {routes.map((list)=>
            list.routes.length>0?
                <List key={list.label} component="nav">
                    {/*<ListSubheader component="div">{list.label}</ListSubheader>*/}
                    {
                        list.routes.map((route,index)=>
                                <ListItem key={route.path} button onClick={()=>handleNavigationClick(route.path,route.title)} >
                                    {route.icon?
                                        <Avatar>{React.createElement(route.icon, null, null)}</Avatar>:
                                        null}
                                    <ListItemText inset primary={route.title} />
                                </ListItem>
                        )
                    }
                </List>
                :null
        )}
    </div>;

export default DrawerContent