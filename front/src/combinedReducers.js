import { combineReducers } from 'redux';
import adminUsersReducer,{adminUsersName} from "./adminUsers/index";
import messageDialogReducer,{messageDialogName} from "./messageDialog/index";
import logInReducer,{logInName} from "./logIn/index";
import appReducer,{appReducerName} from "./main/index";
import statisticsReducer,{statisticsName} from "./statistics/index";

const rootReducer = combineReducers({
    [adminUsersName]: adminUsersReducer,
    [messageDialogName]: messageDialogReducer,
    [logInName]: logInReducer,
    [appReducerName]: appReducer,
    [statisticsName]: statisticsReducer
});

export default rootReducer;