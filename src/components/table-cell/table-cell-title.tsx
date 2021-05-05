import * as React from "react";
import {GridArrowUpwardIcon, GridCellParams} from "@material-ui/data-grid";
import {Link, makeStyles, Portal, Tooltip} from "@material-ui/core";
import {useContext, useEffect, useState} from "react";
import {FiltersContext, FormatterContext} from "../multi-filter-mui-datagrid";

const useStyles = makeStyles({
    'brief-title-cell': {
        lineHeight: 'normal',
        whiteSpace: 'normal',
    },
});

export const TableCellTitle = (params: GridCellParams) => {
    const classes = useStyles();
    const fmc = useContext(FormatterContext);

    return (
        <Portal container={(fmc as any).ref2.current}>
            <div role="row" className="MuiDataGrid-row" style={{maxHeight: '100px', minHeight: '100px'}}>
                <div className="MuiDataGrid-cell  MuiDataGrid-cellWithRenderer MuiDataGrid-cellLeft" role="cell" style={{minWidth: '250px', maxWidth: '250px', minHeight: '100px', maxHeight: '100px', overflow: 'hidden'}}>
                    <Tooltip title="View details page">
                        <Link className={classes["brief-title-cell"]} underline={"always"} color={"textPrimary"} href={"#"}>{params.formattedValue}</Link>
                    </Tooltip>
                </div>
            </div>
        </Portal>
    );

}

