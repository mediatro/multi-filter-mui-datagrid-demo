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
import {ConfigKey, FiltersCfg, filterTypeDisplayNameMap} from "../config/columns-config";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {Autocomplete} from "@material-ui/lab";
import {FilterFormGroupSearch} from "./filter-form/filter-form-group-search";
import {FilterFormGroupDateRange} from "./filter-form/filter-form-group-date-range";
import {FilterFormGroupChoice} from "./filter-form/filter-form-group-choice";


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
    const [tempVal, setTempVal] = useState<string | string[] | undefined>(undefined);

    const hide = () => {
        props.hide();
    }

    const valToStore = (val: any) => {
        let ret = val;
        if (getCurrentFilterCfg().type === 'date_range'){
            ret = storeToVal();
            if(val){
                if(!ret) {
                    ret = {from: null, to: null};
                }
                ret[val[1]] = val[0].getTime();
            }
        }
        //console.log(val, ret);
        setTempVal(ret);
    }

    const storeToVal = () => {
        let ret: any = tempVal;
        if (getCurrentFilterCfg().type === 'date_range'){
            if(!ret){
                ret = {from: null, to: null};
            }else{
                ret = {
                    from: ret.from ? new Date(ret.from) : null,
                    to:  ret.to ? new Date(ret.to) : null,
                }
            }
        }
        //console.log(tempVal, ret);
        return ret;
    }

    const handleInputChange = (event: any) => {
        valToStore(event.target.value);
    }

    const handleMultiInputChange = (value: any, i: any) => {
        valToStore([value, i]);
    }

    const handleCheckboxChange = (event: any, value: any) => {
        valToStore(value);
    }

    const handleCancelClick = (event: any) => {
        hide();
    }

    const handleApplyClick = (event: any) => {
        filter.value = JSON.stringify(tempVal);
        fc.state.applyFilter(filter);
        hide();
    }

    function getDisplayName(key: string) : string {
        return filterTypeDisplayNameMap[key];
    }

    useEffect(() => {
        setFilter(resolveCurrentFilter());
    }, [fc.state.filters]);



    useEffect(() => {
        setTempVal(filter.value ? JSON.parse(filter.value) : undefined);
    }, [filter]);


    let cfg = getCurrentFilterCfg();
    let val = storeToVal();

    return (
        <Paper onClick={event => event.stopPropagation()}>
            <Box p={1} width={cfg.type === 'search' ? 300 : 400}>
                <Typography variant={"h6"}>Filter by {getDisplayName(cfg.type)}</Typography>

                {cfg.type === 'search' &&
                    <FilterFormGroupSearch value={(val as any)}
                                           onChange={handleInputChange}
                    />
                }

                {cfg.type === 'date_range' &&
                    <FilterFormGroupDateRange value={(val as any)}
                                              onChange={handleMultiInputChange}
                    />
                }

                {cfg.type === 'choice' && cfg.choices &&
                    <FilterFormGroupChoice options={cfg.choices}
                                           value={(val as any)}
                                           fieldName={getCurrentField()}
                                           onChange={handleCheckboxChange}
                    />
                }

                <Grid container justify={"flex-end"} spacing={1}>
                    <Grid item>
                        <Button onClick={handleCancelClick}>Cancel</Button>
                        <Button onClick={handleApplyClick} disabled={!tempVal}>Apply</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
