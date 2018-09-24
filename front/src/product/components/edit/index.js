import React from "react";
import {routes} from "../../../routes/index";
import FormatListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/Add";

import CustomList from "../list/list";

const getOptions =  (history) => [
    {action: ()=>history.push(routes.newInterview.path),label:routes.newInterview.title,icon: <AddIcon/>},
    {action: ()=>history.push(routes.interviewList.path),label:routes.interviewList.title,icon: <FormatListIcon/>},
];

const SelectInterviewAction = ({history}) =>
    <section id="select-interview-action">
        <CustomList options={getOptions(history)}/>
    </section>;

export default SelectInterviewAction;