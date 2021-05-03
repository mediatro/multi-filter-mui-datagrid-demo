import * as React from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {FilterChip} from "./filter-chip";
import {GridFilterItem} from "@material-ui/data-grid";
import {Filters, FiltersAware} from "../services/filters-state";

export type FilterChipPanelProps = FiltersAware & {
    onChipDelete: (filter: GridFilterItem) => void,
    onClear: () => void,
}

export const FilterChipPanel = (props: FilterChipPanelProps): JSX.Element => {

    function getFilters(): Filters {
        return props.filters;
    }

    const handleDelete = (filter: GridFilterItem) => {
        props.onChipDelete(filter);
    }

    const handleClear = () => {
        props.onClear();
    }

    let hasFilters = getFilters().filterModel.items.length > 0;

    return (
        <Box p={1}>
            <Grid container component={'ul'} spacing={2} style={{listStyle: 'none'}}>
                {hasFilters  && <Grid item><Typography variant={"subtitle1"}>Filtered by :</Typography></Grid>}
                {getFilters().filterModel.items.map(filter =>
                    <Grid item component={'li'} key={filter.columnField}>
                        <FilterChip filter={filter}
                                    onDelete={handleDelete}
                        />
                    </Grid>
                )}
                {hasFilters  && <Grid item><Button onClick={handleClear}>Clear all</Button></Grid>}
            </Grid>
        </Box>
    );
}
