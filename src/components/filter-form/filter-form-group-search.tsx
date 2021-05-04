import * as React from "react";
import {InputAdornment, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {InputProps as StandardInputProps} from "@material-ui/core/Input/Input";

type FilterFormGroupSearchProps = {
    onChange: StandardInputProps['onChange']
    value: string | undefined
}

export const FilterFormGroupSearch = (props: FilterFormGroupSearchProps) : JSX.Element => {

    return (
        <TextField
            fullWidth={true}
            size={"small"}
            variant={"outlined"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon/>
                    </InputAdornment>
                ),
            }}
            value={props.value}
            onChange={props.onChange}
        />
    );

}
