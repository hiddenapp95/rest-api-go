import React from "react"
import TextField from "@material-ui/core/TextField"

const CustomInput = ({label,value,handleChange}) =>
    <TextField
        label={label}
        value={value}
        onChange={(e)=>this.handleChange(e.target.value)}
        margin="normal"
    />;

export default CustomInput