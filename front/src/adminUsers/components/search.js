import React from "react";
import {FormControl,InputLabel,Input,InputAdornment,IconButton} from "@material-ui/core";
import GlassIcon from "@material-ui/icons/Search";
import {strings} from "../../localization/strings";

const SearchInput = ({handleSearch}) =>
    <FormControl>
        <InputLabel htmlFor="search-input">{strings.searchLabel}</InputLabel>
        <Input
            id="search-input"
            type={'text'}
            autoFocus={true}
            //onKeyPress={(e)=> {if(e.key==="Enter") handleSearch(filterType,searchValue)}}
            onChange={(e)=>handleSearch(e.target.value)}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
              //          onClick={()=>handleSearch(filterType,searchValue)}
                    >
                        <GlassIcon/>
                    </IconButton>
                </InputAdornment>
            }
        />
    </FormControl>;

export default SearchInput