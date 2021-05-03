import * as React from "react";
import {createContext, useEffect, useState} from "react";
import {
    DataGrid, GridColDef,
    GridFilterItem,
    GridFilterModelParams,
    GridPageChangeParams, GridRowData,
    GridSortModelParams
} from '@material-ui/data-grid';
import {Box, Paper} from "@material-ui/core";
import {MockApi, TableData} from "../services/mock-api";
import {FilterChipPanel, FilterChipPanelProps} from "./filter-chip-panel";
import {defaultFilters, Filters, FiltersAware, FiltersState} from "../services/filters-state";
import {TableHeaderCell} from "./table-header-cell";
import {columnsCfg, ConfigKey, FiltersCfg} from "../config/columns-config";
import {mergeMap} from "rxjs/operators";



type FiltersContextType = {
    state: FiltersState
}

const defaultContext: FiltersContextType = {
    state: new FiltersState()
};

export const FiltersContext = createContext<FiltersContextType>(defaultContext);


const columnDefaults = {width: 250};

type MuiTableProps = {
    api: MockApi
};

export const MultiFilterMuiDatagrid = (props: MuiTableProps): JSX.Element => {

    const fc = defaultContext;

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
                ...columnDefaults, ...cfg[colKey],
                field: colKey,
                headerName: cfg[colKey].label ? cfg[colKey].label: colKey,
                renderHeader: TableHeaderCell
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
            <Paper>
                <Box height={400}>
                    {tableData && <DataGrid columns={tableData.cols}
                                            rows={tableData.rows}
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
        </FiltersContext.Provider>
    );
}

