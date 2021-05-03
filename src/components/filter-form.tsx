import * as React from "react";
import {GridColumnMenuProps, GridFilterItem} from "@material-ui/data-grid";
import {
    Box,
    Button, Checkbox,
    FormControl, FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {useContext, useEffect, useState} from "react";
import {FiltersContext} from "./multi-filter-mui-datagrid";
import {InputProps as StandardInputProps} from "@material-ui/core/Input/Input";
import {Filters, FiltersAware} from "../services/filters-state";
import {ConfigKey, FiltersCfg, filterTypeDisplayNames} from "../config/columns-config";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


type FilterFormProps = {
    field: string,
    hide: () => void,
}

export const FilterForm = (props: FilterFormProps): JSX.Element => {

    const fc = useContext(FiltersContext);

    function getFiltersCfg(): FiltersCfg {
        return fc.state.getFiltersConfig();
    }

    function getCurrentField(): string {
        return props.field;
    }

    function getCurrentFilterCfg() {
        return getFiltersCfg()[getCurrentField()];
    }

    function resolveCurrentFilter(): GridFilterItem {
        return fc.state.resolveFilter(getCurrentField());
    }

    const [filter, setFilter] = useState<GridFilterItem>(resolveCurrentFilter());
    const [tempVal, setTempVal] = useState<string | undefined>(undefined);

    const hide = () => {
        props.hide();
    }

    const valToString = (val: any) => {
        let ret = undefined;
        if(getCurrentFilterCfg().type === 'search'){
            ret = val;
        } else if(getCurrentFilterCfg().type === 'date_range'){
            if(val){
                let a: string[] = (stringToVal() as any);
                a[val[1]] = val[0];
                ret = a.join(',');
            }
        } else if(getCurrentFilterCfg().type === 'choice'){
            if(val) {
                if (val){
                    let a: string[] = (stringToVal() as any);
                    if(a[0]){
                        a.splice(a.indexOf(a[1]), 1);
                    }else{
                        a.push(a[1]);
                    }
                    ret = a.join(',');
                }
            }
        }
        //console.log(val, ret);
        setTempVal(ret);
    }

    const stringToVal = () => {
        let ret = undefined;
        if(getCurrentFilterCfg().type === 'search'){
            ret = tempVal;
        } else if(getCurrentFilterCfg().type === 'date_range'){
            ret = tempVal ? tempVal.split(',') : [undefined, undefined];
        } else if(getCurrentFilterCfg().type === 'choice'){
            ret = tempVal ? tempVal.split(',') : [];
        }
        //console.log(tempVal, ret);
        return ret;
    }

    const handleInputChange = (event: any) => {
        valToString(event.target.value);
    }

    const handleMultiInputChange = (event: any, i: number) => {
        valToString([event, i]);
    }

    const handleCheckboxChange = (event: any) => {
        valToString([event.target.checked, event.target.name]);
    }

    const handleCancelClick = (event: any) => {
        hide();
    }

    const handleApplyClick = (event: any) => {
        filter.value = tempVal;
        fc.state.applyFilter(filter);
        hide();
    }

    function getDisplayName(key: string) : string {
        return filterTypeDisplayNames[key];
    }

    useEffect(() => {
        setFilter(resolveCurrentFilter());
    }, [fc.state.filters]);



    useEffect(() => {
        valToString(filter.value)
    }, [filter]);


    let cfg = getCurrentFilterCfg();
    let val = stringToVal();

    return (
        <Paper onClick={event => event.stopPropagation()}>
            <Box p={1}>
                <Typography variant={"h6"}>Filter by {getDisplayName(cfg.type)}</Typography>

                {cfg.type === 'search' &&
                    <TextField
                        variant={"outlined"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                        value={val}
                        onChange={handleInputChange}
                    />
                }

                {cfg.type === 'date_range' &&
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container>
                            <Grid item>
                                <KeyboardDatePicker
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    value={val ? val[0] : undefined}
                                    onChange={(e) => handleMultiInputChange(e,0)}
                                />
                            </Grid>
                            <Grid item>
                                <KeyboardDatePicker
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    value={val ? val[1] : undefined}
                                    onChange={(e) => handleMultiInputChange(e,1)}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                }

                {cfg.type === 'choice' && cfg.choices &&
                <FormControl component="fieldset">
                    <FormGroup>
                        {cfg.choices.map((option, i) => (
                            <FormControlLabel
                                control={
                                    <Checkbox name={i.toString()}
                                              checked={Array.isArray(val) ? (val as string[]).includes(i.toString()) : false}
                                              onChange={handleCheckboxChange}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                }

                <Grid container>
                    <Grid item>
                        <Button onClick={handleCancelClick}>Cancel</Button>
                        <Button onClick={handleApplyClick} disabled={!tempVal}>Apply</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
