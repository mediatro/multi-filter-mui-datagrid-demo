import * as React from "react";
import {createContext, useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridFilterItem,
    GridFilterModelParams,
    GridPageChangeParams,
    GridRowData,
    GridSortModelParams
} from '@material-ui/data-grid';
import {Box, createStyles, Link, makeStyles, Paper, Theme, Tooltip} from "@material-ui/core";
import {MockApi} from "../services/mock-api";
import {FilterChipPanel, FilterChipPanelProps} from "./filter-chip-panel";
import {FiltersAware, FiltersState} from "../services/filters-state";
import {TableHeaderCell} from "./table-header-cell";
import {columnsCfg, ConfigKey, customChoiceLabels} from "../config/columns-config";
import {mergeMap} from "rxjs/operators";


type FiltersContextType = {
    state: FiltersState
}

const defaultFilterContext: FiltersContextType = {
    state: new FiltersState()
};

export const FiltersContext = createContext<FiltersContextType>(defaultFilterContext);

type CustomColumnsContextType = {
    getClassName: (key: string) => string
}

const useStyles = makeStyles((theme: Theme) => {
    const styles: any = {};
    for(let k in customChoiceLabels){
        if([k][0] !== '') {
            styles[k.replace(/[^a-zA-Z0-9]/g, '')] = {
                backgroundColor: customChoiceLabels[k][0],
                color: customChoiceLabels[k][1]
            }
        }
    }

    return createStyles(styles);
});


const defaultCColumnsContext: CustomColumnsContextType = {
    getClassName: (key: string) => ''
};

export const CustomColumnsContext = createContext<CustomColumnsContextType>(defaultCColumnsContext);


const columnDefaults = {width: 250};

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
    const ccc = {...defaultCColumnsContext, getClassName: (key: string) => classes[key.replace(/[^a-zA-Z0-9]/g , '')]};


    const [tableData, setTableData] = useState<TableData | null>(null);
    const [loading, setLoading] = useState(false);

    function getColumnsCfg(): {[key in ConfigKey] : any}{
        return columnsCfg;
    }

    function transformData(data: any): TableData {
        let cfg = getColumnsCfg();
        let cols: GridColDef[] = [];
        let rows: GridRowData[] = [];

        for (let colKey in cfg) {
            cols.push({
                ...columnDefaults,
                field: colKey,
                headerName: cfg[colKey].label ? cfg[colKey].label: colKey,
                renderHeader: TableHeaderCell,
                renderCell: params => {
                    let limit = 3;
                    if(!Array.isArray(params.value)){
                        return params.formattedValue;
                    }
                    if(params.value.length < limit){
                        return JSON.stringify(params.value);
                    }
                    return (
                        <>
                            {JSON.stringify(params.value.filter((value, index) => index < limit))}
                            &nbsp;
                            <Tooltip title={JSON.stringify(params.value.filter((value, index) => index >= limit))}>
                                <Link href={"#"}>{`+ ${params.value.length - limit} more`}</Link>
                            </Tooltip>
                        </>
                    );
                },
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

    useEffect(() => {
        fc.state.filtersChange$.pipe(
            mergeMap(value => props.api.getData$(value))
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

    return (
        <FiltersContext.Provider value={fc}>
        <CustomColumnsContext.Provider value={ccc}>
            <Paper>
                <Box height={400}>
                    {tableData && <DataGrid columns={tableData.cols}
                                            rows={tableData.rows}
                                            disableSelectionOnClick={true}
                                            columnBuffer={2}
                                            columnTypes={{}}
                                            density={"standard"}
                                            headerHeight={56}
                                            localeText={{}}
                                            rowHeight={52}
                                            sortingOrder={['asc', 'desc', null]}
                                            filterMode="server"
                                            onFilterModelChange={handleFilterModelChange}
                                            sortingMode="server"
                                            onSortModelChange={handleSortModelChange}
                                            paginationMode="server"
                                            onPageChange={handlePageChange}
                                            loading={loading}
                                            disableColumnMenu={true}
                                            components={{
                                                Toolbar: FilterChipPanel,
                                            }}
                                            componentsProps={{
                                                toolbar: filterChipProps
                                            }}
                    />}
                </Box>
            </Paper>
        </CustomColumnsContext.Provider>
        </FiltersContext.Provider>
    );
}

