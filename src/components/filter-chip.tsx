import * as React from "react";
import {GridFilterItem} from "@material-ui/data-grid";
import {Chip} from "@material-ui/core";
import {useContext} from "react";
import {FormatterContext} from "./multi-filter-mui-datagrid";

type FilterChipProps = {
    filter: GridFilterItem,
    onDelete: (filter: GridFilterItem) => void
}

export const FilterChip = (props: FilterChipProps): JSX.Element => {

    const fmc = useContext(FormatterContext);

    const handleDelete = (filter: GridFilterItem) => () => {
        props.onDelete(filter);
    }

    const formatDate = (timestamp: number) => {
        return timestamp ? fmc.formatDate(new Date(timestamp)) : 'Any';
    }

    const formatValue = (json: string | undefined): any => {
        if(!json) {
            return json;
        }
        let raw = JSON.parse(json);
        if (Array.isArray(raw)){
            return raw.join(', ');
        }else if(typeof raw === "object" && (raw.from || raw.to)){
            return `${formatDate(raw.from)} - ${formatDate(raw.to)}`;
        }
        return raw;
    }

    return (
        <Chip label={`${props.filter.columnField}: ${formatValue(props.filter.value)}`}
              onDelete={handleDelete(props.filter)}
        />
    );
}
