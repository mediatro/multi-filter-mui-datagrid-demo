import * as React from "react";
import {GridCellParams} from "@material-ui/data-grid";
import {useContext} from "react";
import {FormatterContext} from "../multi-filter-mui-datagrid";

export const TableCellDate = (params: GridCellParams) => {

    const fmc = useContext(FormatterContext);

    return (
        typeof params.value === "number" ? fmc.formatDate(new Date(params.value)) : null
    );

}
