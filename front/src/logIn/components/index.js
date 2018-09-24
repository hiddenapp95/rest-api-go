import React from "react"
import {connect} from "react-redux";
import { createStructuredSelector } from 'reselect';
import {strings} from "../../localization/strings";
import {getUser, isRequesting} from "../selectors";
import {GooglePlusProxy} from "../../utils/googleLogin";
import {logIn, logOut} from "../actions";
import Loader from "../../loader/index";
import {Typography,Button} from "@material-ui/core/";
import {getAuthInfo, isAuthInfoPresent} from "../../utils/db";

class LogIn extends React.Component {

    componentDidMount = () =>{
        if(isAuthInfoPresent)
            this.props.dispatch(logIn(getAuthInfo()));
    };

    handleLogInButtonClick = () => {
        GooglePlusProxy.login(
            (user)=>{
                console.log(user);
                this.props.dispatch(logIn(user));
            }
        );
    };

    handleLogOutButtonClick = () => {
        GooglePlusProxy.logout();
        this.props.dispatch(logOut);
    };

    render() {
        const {isLoading,user} = this.props;
        return  <section id="login">
                    {isLoading && <Loader/>}
                    {user?
                        [
                            <Typography variant={"title"} className={"title"}>{strings.logInWelcome}</Typography>,
                            <img src={user.imageUrl}/>,
                            <Typography variant={"body1"} className={"title"}>{user.displayName}</Typography>,
                            <Typography variant={"body1"} className={"title"} style={{fontWeight:"bold"}}>{user.email}</Typography>,
                            <Button  color={"secondary"} onClick={this.handleLogOutButtonClick}>
                                Salir de mi cuenta
                            </Button>
                        ]:
                        [<Typography variant="title" className={"title"}>{strings.logInWithGoogle}</Typography>,
                        <div id="customBtn" className="customGPlusSignIn" onClick={this.handleLogInButtonClick}>
                            <span className="icon"/>
                            <span className="buttonText">Google</span>
                        </div>]
                    }
                </section>
    }
}

export default connect(
    createStructuredSelector({
        isLoading: isRequesting,
        user: getUser
    })
)(LogIn);