import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import TimelineIcon from "@material-ui/icons/Timeline";
import PersonIcon from "@material-ui/icons/Person";
import LogInIcon from "@material-ui/icons/HowToReg";
import AccountIcon from "@material-ui/icons/AccountCircle";
import {strings} from "../localization/strings";
import {AdminUsers} from "../adminUsers";
import {LogIn} from "../logIn";
import {roles} from "../shared";
import Landing from "../main/components/landing";
import {Statistics} from "../statistics";

export const routes = {
    //adminUsers: {title: strings.adminUsersTitle, component: AdminUsers, path:"/usuarios",icon:AccountIcon,roles: [roles.owner]},
    logIn: {title: strings.logInTitle, component: LogIn, path:"/login",icon:LogInIcon},
    productList: {title: strings.logInTitle, component: LogIn, path:"/listaDeProductos",icon:LogInIcon},
    addProduct: {title: strings.logInTitle, component: LogIn, path:"/agregarProducto",icon:LogInIcon},
    newRequest: {title: strings.logInTitle, component: LogIn, path:"/nuevoPedido",icon:LogInIcon},
    main: {title: strings.toolbarDefaultTitle, component: Landing, path:"/",isExact:true},
};

export const drawerRoutesList = [
    {
        label: strings.drawerListHeader,
        routes: [
            routes.logIn,
        ]
    }
];