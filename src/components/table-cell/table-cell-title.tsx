import * as React from "react";
import {GridCellParams} from "@material-ui/data-grid";
import {Link, makeStyles, Tooltip} from "@material-ui/core";

const useStyles = makeStyles({
    'brief-title-cell': {
        lineHeight: 'normal',
        whiteSpace: 'normal',
    },
});

export const TableCellTitle = (params: GridCellParams) => {
    const classes = useStyles();
    return (
        <Tooltip title="View details page">
            <Link className={classes["brief-title-cell"]} underline={"always"} color={"textPrimary"} href={"#"}>{params.formattedValue}</Link>
        </Tooltip>
    );

}
