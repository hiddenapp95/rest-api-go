import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {isOnline} from "../selectors";
import { createStructuredSelector } from 'reselect';

const primaryOnline ={ light: '#5ccbf2', main: '#089abf', dark: '#006c8f',contrastText: '#fff' };
const secondaryOnline = { light: '#eeffff', main: '#bbdefb', dark: '#8aacc8',contrastText: '#fff' };

const primaryOffline = { light: '#e2e2db', main: '#b0b0a9', dark: '#81817a',contrastText: '#fff'};
const secondaryOffline = { light: '#e2e2db', main: '#b0b0a9', dark: '#81817a',contrastText: '#fff'};

const onlineTheme = createMuiTheme({
    palette: {
        primary: primaryOnline,
        secondary: secondaryOnline,
    },
    status: {
        danger: primaryOnline,
    },
});

const offlineTheme = createMuiTheme({
    palette: {
        primary: primaryOffline,
        secondary: secondaryOffline,
    },
    status: {
        danger: primaryOffline,
    },
});

const Theme = ({children,isOnline}) =>
        <MuiThemeProvider theme={isOnline ? onlineTheme:offlineTheme}>
            {children}
        </MuiThemeProvider>;

export default connect(createStructuredSelector({
    isOnline: isOnline
}))(Theme)