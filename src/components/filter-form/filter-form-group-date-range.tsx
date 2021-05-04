import * as React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {Grid} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";


type AllowedDateRangeValue = {[key: string] : (Date | null)};

type FilterFormGroupChoiceProps = {
    value: AllowedDateRangeValue,
    onChange: (date: MaterialUiPickersDate | null, key: string, value?: string | null) => void
}
export const FilterFormGroupDateRange = (props: FilterFormGroupChoiceProps) : JSX.Element => {

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={1}>
                <Grid item md>
                    <KeyboardDatePicker
                        size={"small"}
                        inputVariant="outlined"
                        format="MM/dd/yyyy"
                        margin="normal"
                        value={props.value['from']}
                        emptyLabel={"Start Date"}
                        onChange={(d,v) => props.onChange(d,'from', v)}
                    />
                </Grid>
                <Grid item md>
                    <KeyboardDatePicker
                        size={"small"}
                        inputVariant="outlined"
                        format="MM/dd/yyyy"
                        margin="normal"
                        value={props.value['to']}
                        emptyLabel={"End Date"}
                        onChange={(d,v) => props.onChange(d,'to', v)}
                    />
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    );

}
