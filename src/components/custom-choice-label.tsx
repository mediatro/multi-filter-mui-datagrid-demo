import * as React from "react";
import {Chip} from "@material-ui/core";
import {GridCellParams} from "@material-ui/data-grid";
import {useContext} from "react";
import {CustomColumnsContext} from "./multi-filter-mui-datagrid";

type CustomChoiceLabelProps = GridCellParams;

export const CustomChoiceLabel = (props: CustomChoiceLabelProps): JSX.Element => {

    const ccc = useContext(CustomColumnsContext);

    function getLabel(): string {
        return props.formattedValue ? props.formattedValue.toString() : '';
    }

    return (
        <Chip label={`• ${getLabel()}`} className={ccc.getClassName(getLabel())} size={"small"}/>
    );
}
