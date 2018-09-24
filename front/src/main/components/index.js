import React from "react";
import Navigation from "./navigator/";
import {BrowserRouter, Route,  Switch} from "react-router-dom"
import {routes,drawerRoutesList} from "../../routes"
import {MessageDialog} from "../../messageDialog";
import Theme from "./theme";

const Main  = () =>
    <BrowserRouter>
        <div id="app-container" >
            <Theme>
                <Navigation routes={drawerRoutesList} mainRoute={routes.main}/>
                <MessageDialog/>
            </Theme>
            <Switch>
                <Theme>
                    {Object.values(routes).map((route)=>
                        <Route key={route.path}
                               exact={route.isExact}
                               path={route.path}
                               component={route.component}/>
                    )}
                </Theme>
            </Switch>
        </div>
    </BrowserRouter>;

export default Main