import * as React from "react";
import {TableCellHeader, TableCellHeaderProps} from "./table-cell-header";
import {IconButton, Portal} from "@material-ui/core";
import {createRef, useContext, useEffect, useState} from "react";
import {FiltersContext, FormatterContext} from "../multi-filter-mui-datagrid";
import {GridArrowDownwardIcon, GridArrowUpwardIcon} from "@material-ui/data-grid";
import {log} from "util";

export const TableCellHeaderTitle = (params: TableCellHeaderProps) => {

    const fmc = useContext(FormatterContext);
    const fc = useContext(FiltersContext);

    const [sort, setSort] = useState<string | null | undefined>();

    useEffect(() => {
        fc.state.filtersChange$.subscribe(filters => {
            if(filters.sortModel){
                let toSet = null;
                for(let item of filters.sortModel){
                    if(item.field === params.field){
                        toSet = item.sort;
                    }
                }
                setSort(toSet);
            }
        });
    },[]);

    useEffect(() => {
        (fmc as any).click$.subscribe((e: any) => {
            (backRef as any).current.click()
        });
    },[fmc]);

    const backRef = React.useRef(null);

    return (
        <div ref={backRef}>
            Fake title
            <Portal  container={(fmc as any).ref.current}>
                <TableCellHeader {...params} headerName={'Brief Title'}/>
                {sort === 'asc' && <IconButton><GridArrowUpwardIcon/></IconButton>}
                {sort === 'desc' && <IconButton><GridArrowDownwardIcon/></IconButton>}
            </Portal>
        </div>
    )

}
