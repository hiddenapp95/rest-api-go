import React from "react";
import {FormControl,Input,InputLabel,Select,MenuItem,FormHelperText} from "@material-ui/core";
import {strings} from "../../localization/strings";

const CustomSelect = ({options,value,handleChange}) =>
    <FormControl >
        <InputLabel shrink htmlFor="age-label-placeholder">
            {strings.roleLabel}
        </InputLabel>
        <Select
            value={value}
            onChange={(e)=>handleChange(e.target.value)}
            input={<Input name="age" id="age-label-placeholder" />}
            displayEmpty
            name="age"
        >
            <MenuItem value="">
            </MenuItem>
            {options.map(option=>
                <MenuItem key={option.name} value={option.name}>{option.label}</MenuItem>
            )}
        </Select>
        {/*<FormHelperText>Label + placeholder</FormHelperText>*/}
    </FormControl>;

export default CustomSelect