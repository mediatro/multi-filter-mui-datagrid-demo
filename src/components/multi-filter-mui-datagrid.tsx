import * as React from "react";
import {createContext, useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef, GridColumnHeaderParams,
    GridFilterItem,
    GridFilterModelParams,
    GridPageChangeParams,
    GridRowData,
    GridSortModelParams
} from '@material-ui/data-grid';
import {Box, createStyles, Grid, Link, makeStyles, Paper, Theme, Tooltip} from "@material-ui/core";
import {MockApi} from "../services/mock-api";
import {FilterChipPanel, FilterChipPanelProps} from "./filter-chip-panel";
import {Filters, FiltersAware, FiltersState} from "../services/filters-state";
import {TableCellHeader} from "./table-cell/table-cell-header";
import {columnsCfg, componentMap, ConfigKey, customChoiceLabels} from "../config/columns-config";
import {mergeMap} from "rxjs/operators";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from "moment/moment";
import {useCustomData} from "../hooks/use-custom-data";
import ReactDOM from "react-dom";
import {Subject} from "rxjs";


type FiltersContextType = {
    state: FiltersState
}

const defaultFilterContext: FiltersContextType = {
    state: new FiltersState()
};

export const FiltersContext = createContext<FiltersContextType>(defaultFilterContext);

type FormatterContextType = {
    formatDate: (d: Date) => string,
}

const defaultFormatterContext: FormatterContextType = {
    formatDate: (d: Date) => moment(d).format('MMM D, YYYY'),
};

export const FormatterContext = createContext<FormatterContextType>(defaultFormatterContext);


type CustomColumnsContextType = {
    getClassName: (key: string) => string,
    getIcon: (key: string) => JSX.Element | undefined
}

const keyToValidKey = (key: string): string => key.replace(/[^a-zA-Z0-9]/g, '_');

const defaultCColumnsContext: CustomColumnsContextType = {
    getClassName: (key: string) => '',
    getIcon: (key: string) => {
        return customChoiceLabels[key] && customChoiceLabels[key][2] ? componentMap[customChoiceLabels[key][2]] : undefined
    }
};

export const CustomColumnsContext = createContext<CustomColumnsContextType>(defaultCColumnsContext);

const columnDefaults = {width: 250};


const useStyles = makeStyles((theme: Theme) => {
    const styles: any = {};
    for(let k in customChoiceLabels){
        if([k][0] !== '') {
            styles[keyToValidKey(k)] = {
                backgroundColor: customChoiceLabels[k][0],
                color: customChoiceLabels[k][1]
            }
        }
    }
    return createStyles(styles);
});

export type TableData = {
    cols: GridColDef[],
    rows: GridRowData[],
}

type MuiTableProps = {
    api: MockApi
};

export const MultiFilterMuiDatagrid = (props: MuiTableProps): JSX.Element => {

    const classes = useStyles();
    const fc = defaultFilterContext;
    const ccc = {...defaultCColumnsContext, getClassName: (key: string) => classes[keyToValidKey(key)]};


    const [tableData, setTableData] = useState<TableData | null>(null);
    const [loading, setLoading] = useState(false);

    useCustomData(filters => console.log('THIS IS HOOK', filters));

    function getColumnsCfg(): {[key in ConfigKey] : any}{
        return columnsCfg;
    }

    function transformData(data: any): TableData {
        let cfg = getColumnsCfg();
        let cols: GridColDef[] = [];
        let rows: GridRowData[] = [];

        for (let colKey in cfg) {
            let headerName = cfg[colKey].label ? cfg[colKey].label: colKey;
            cols.push({
                ...columnDefaults,
                field: colKey,
                headerName: cfg[colKey].label ? cfg[colKey].label: colKey,
                renderHeader: (params: GridColumnHeaderParams) => <TableCellHeader {...params} headerName={headerName}/>,
                ...cfg[colKey]
            });
        }

        for(let i in data.items){
            let item = data.items[i];
            let row: GridRowData = {id: i};
            for (let colKey in cfg) {
                if(!item[colKey]) {
                    continue;
                }
                row[colKey] = item[colKey];
            }
            rows.push(row);
        }
        return {cols: cols, rows: rows};
    }

    const handlePageChange = (params: GridPageChangeParams) => {
        fc.state.mergeFilters({pageChange: params});
    }

    const handleSortModelChange = (params: GridSortModelParams) => {
        fc.state.mergeFilters({sortModel: params.sortModel});
    }

    const handleFilterModelChange = (params: GridFilterModelParams) => {
        fc.state.mergeFilters({filterModel: params.filterModel});
    }

    const onChipDelete = (filter: GridFilterItem) => {
        fc.state.removeFilter(filter);
    }

    const onClear = () => {
        fc.state.clearFilters();
    }


    const saveStateKey = 'filters_state'

    const saveState = (value: Filters) => {
        localStorage.setItem(saveStateKey, JSON.stringify(value));
    }

    const loadState = () => {
        let savedState = localStorage.getItem(saveStateKey);
        if (savedState){
            fc.state.setFilters(JSON.parse(savedState));
        }
    }

    useEffect(() => {

        loadState();
        fc.state.filtersChange$.pipe(
            mergeMap(value => {
                setLoading(true);
                saveState(value);
                return props.api.getData$(value);
            })
        ).subscribe(value => {
            setTableData(transformData(value));
            setLoading(false);
        });
    }, []);



    let filterAwareProps: FiltersAware = {
        filters: fc.state.filters,
    }

    let filterChipProps: FilterChipPanelProps = {...filterAwareProps,
        onChipDelete: onChipDelete,
        onClear: onClear
    }

    const container = React.useRef(null);
    const container2 = React.useRef(null);
    const table = React.useRef(null);
    const click$ = new Subject();

    if(table.current){
        let zones = (table as any).current.getElementsByClassName('MuiDataGrid-renderingZone');
        if(zones.length>0){
            let target = zones[0];
            const config = {attributes: true,};

            const callback = () => (container2 as any).current.style.transform = target.style.transform.replace(/(.+,)(.+)(,.+)/, 'translate3d(0px,$2,0px)');
            const observer = new MutationObserver(callback);
            observer.observe(target, config);
        }
    }


    return (
        <FiltersContext.Provider value={fc}>
        <CustomColumnsContext.Provider value={ccc}>
        <FormatterContext.Provider value={({...defaultFormatterContext, ref: container, ref2: container2, click$: click$} as any)}>
            <Box p={2}>
                <Grid container direction={"column"}>
                    <Grid item>
                        <FilterChipPanel {...filterChipProps}/>
                    </Grid>

                    <Grid container item>

                        <Grid item md={3}>
                            <Paper className={'MuiDataGrid-root'}>

                                <div className="MuiDataGrid-columnsContainer"
                                     style={{minHeight: '56px', maxHeight: '56px', lineHeight: '56px', position: "static"}}>
                                    <div className="MuiDataGrid-colCellWrapper scroll" role="row">

                                        <div className="MuiDataGrid-colCell MuiDataGrid-colCellSortable"
                                             style={{width: '250px', minWidth: '250px', maxWidth: '250px'}} role="columnheader">
                                            <div className="MuiDataGrid-colCell-draggable" draggable="false">
                                                <div className="MuiDataGrid-colCellTitleContainer" ref={container} onClick={event => click$.next(event)}>



                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div style={{overflow: 'visible', height: '0px', width: '0px'}}>
                                <div className="MuiDataGrid-windowContainer">
                                    <div className="MuiDataGrid-window" style={{top: '56px', overflowY: 'hidden'}}>
                                        <div className="MuiDataGrid-dataContainer data-container"
                                             style={{minHeight: '1770px'}}>
                                            <div className="MuiDataGrid-viewport" style={{maxHeight: '273px'}}>
                                                <div className="MuiDataGrid-renderingZone" ref={container2}>



                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>

                            </Paper>
                        </Grid>

                        <Grid item md>
                            <Paper ref={table}>
                                <Box height={400}>
                                    {tableData && <DataGrid columns={tableData.cols}
                                                            rows={tableData.rows}
                                                            pageSize={25}
                                                            disableSelectionOnClick={true}
                                                            columnBuffer={55}
                                                            columnTypes={{}}
                                                            density={"standard"}
                                                            headerHeight={56}
                                                            localeText={{}}
                                                            rowHeight={100}
                                                            sortingOrder={['asc', 'desc', null]}
                                                            filterMode="server"
                                                            onFilterModelChange={handleFilterModelChange}
                                                            sortingMode="server"
                                                            onSortModelChange={handleSortModelChange}
                                                            paginationMode="server"
                                                            onPageChange={handlePageChange}
                                                            onPageSizeChange={handlePageChange}
                                                            loading={loading}
                                                            disableColumnMenu={true}
                                                            onResize={param => console.log(param)}
                                    />}
                                </Box>
                            </Paper>
                        </Grid>

                    </Grid>

                </Grid>
            </Box>

        </FormatterContext.Provider>
        </CustomColumnsContext.Provider>
        </FiltersContext.Provider>
    );
}

