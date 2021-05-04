import * as React from "react";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {    AutocompleteChangeReason,} from "@material-ui/lab/useAutocomplete/useAutocomplete";

type AllowedChoiceValue = string[] | undefined;

type FilterFormGroupChoiceProps = {
    options: string[],
    value: AllowedChoiceValue,
    fieldName: string,
    onChange: (
        event: React.ChangeEvent<{}>,
        value: AllowedChoiceValue,
        reason: AutocompleteChangeReason,
    ) => void,
}

export const FilterFormGroupChoice = (props: FilterFormGroupChoiceProps) : JSX.Element => {

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={props.options}
            defaultValue={props.value}
            onChange={props.onChange}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    size={"small"}
                    placeholder={`Select ${props.fieldName}`}
                />
            )}
        />
    );

}
