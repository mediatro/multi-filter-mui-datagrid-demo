import * as React from "react";
import {GridColumnHeaderParams} from "@material-ui/data-grid";
import {Fade, IconButton, Popper, Tooltip} from "@material-ui/core";
import FilterListIcon from '@material-ui/icons/FilterList'
import {useContext, useState} from "react";
import {FilterForm} from "../filter-form";
import {FiltersContext} from "../multi-filter-mui-datagrid";

type TableCellHeaderProps = GridColumnHeaderParams & {
    children?: any,
    headerName?: string
}

export const TableCellHeader = (params: TableCellHeaderProps) => {

    const fc = useContext(FiltersContext);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);


    function getField(): string {
        return params.field;
    }

    function isFilterActive(): boolean {
        return fc.state.hasFilterFor(getField());
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        event.stopPropagation();
    };

    const handleFormHide = () => {
        setAnchorEl(null);
    }

    return (
        <>
            {params.children ? params.children : params.headerName}
            <IconButton onClick={handleClick}>
                <FilterListIcon color={isFilterActive() ? 'primary' : 'inherit'}/>
            </IconButton>
            <Popper open={anchorEl != null} anchorEl={anchorEl}>
                <FilterForm field={getField()} hide={handleFormHide}/>
            </Popper>
        </>
    );
}
