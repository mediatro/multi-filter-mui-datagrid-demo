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
import {Autocomplete} from "@material-ui/lab";


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
                    ret = new Array(2).fill(undefined);
                }
                ret[val[1]] = val[0];
            }
        }
        setTempVal(ret);
    }

    const storeToVal = () => {
        return tempVal;
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
        return filterTypeDisplayNames[key];
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
            <Box p={1} width={400}>
                <Typography variant={"h6"}>Filter by {getDisplayName(cfg.type)}</Typography>

                {cfg.type === 'search' &&
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
                        value={val}
                        onChange={handleInputChange}
                    />
                }

                {cfg.type === 'date_range' &&
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={1}>
                            <Grid item md>
                                <KeyboardDatePicker
                                    size={"small"}
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    value={val && val[0] ? val[0] : null}
                                    emptyLabel={"Start Date"}
                                    onChange={(e) => handleMultiInputChange(e,0)}
                                />
                            </Grid>
                            <Grid item md>
                                <KeyboardDatePicker
                                    size={"small"}
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    value={val && val[1] ? val[1] : null}
                                    emptyLabel={"End Date"}
                                    onChange={(e) => handleMultiInputChange(e,1)}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                }

                {cfg.type === 'choice' && cfg.choices &&
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={cfg.choices}
                        defaultValue={Array.isArray(val) ? val : undefined}
                        onChange={handleCheckboxChange}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size={"small"}
                                placeholder={`Select ${getCurrentField()}`}
                            />
                        )}
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
