import * as React from "react";
import {GridFilterItem} from "@material-ui/data-grid";
import {Chip} from "@material-ui/core";

type FilterChipProps = {
    filter: GridFilterItem,
    onDelete: (filter: GridFilterItem) => void
}

export const FilterChip = (props: FilterChipProps): JSX.Element => {

    const handleDelete = (filter: GridFilterItem) => () => {
        props.onDelete(filter);
    }

    return (
        <Chip label={`${props.filter.columnField}: ${props.filter.value}`}
              onDelete={handleDelete(props.filter)}
        />
    );
}
