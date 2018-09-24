import React from "react";
import AppNavigator from "./appNavigator";
import AppToolbar from "./toolbar";
import {strings} from "../../../localization/strings";
import withRouter from "react-router-dom/es/withRouter";

class Navigation extends React.Component{
    state={drawerOpen: false,title:strings.toolbarDefaultTitle};

    handleOpenDrawer = () => this.setState({drawerOpen:true});
    handleCloseDrawer = (title) => this.setState({drawerOpen:false,title:title?title:strings.toolbarDefaultTitle});
    handleNavigationClick = (path,title) => {
        this.handleCloseDrawer(title);
        this.props.history.push(path);
    };

    render(){
        const {drawerOpen,title} = this.state;
        const {routes,mainRoute} = this.props;
        return <div>
            <AppNavigator
                open={drawerOpen}
                handleClose={this.handleCloseDrawer}
                routes={routes}
                mainRoute={mainRoute}
                handleNavigationClick={this.handleNavigationClick}
            />
            <AppToolbar title={title} menuButtonClickHandler={this.handleOpenDrawer}/>
        </div>
    }
}

export default withRouter(Navigation)