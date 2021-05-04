import * as React from "react";
import {Chip} from "@material-ui/core";
import {GridCellParams} from "@material-ui/data-grid";
import {useContext} from "react";
import {CustomColumnsContext} from "../multi-filter-mui-datagrid";

export const TableCellCustomOptionLabel = (props: GridCellParams): JSX.Element => {

    const ccc = useContext(CustomColumnsContext);

    function getLabel(): string {
        return props.formattedValue ? props.formattedValue.toString() : '';
    }

    return (
        <Chip size={"small"}
              label={(
                  <>
                  {!ccc.getIcon(getLabel()) && '• '}
                  {getLabel()}
                  </>
              )}
              icon={ccc.getIcon(getLabel())}
              className={ccc.getClassName(getLabel())}
        />
    );
}
