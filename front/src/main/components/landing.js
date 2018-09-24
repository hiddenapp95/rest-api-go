import React from "react";
import {Typography,Grid} from "@material-ui/core";
import {strings} from "../../localization/strings";

const Landing = () =>
    <div id={"landing"}>
        <div id={"background"}/>
        <Typography variant={"title"}>
            {strings.landingTitle}
        </Typography>
    </div>;

export default Landing