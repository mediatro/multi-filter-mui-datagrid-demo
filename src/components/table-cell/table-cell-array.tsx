import * as React from "react";
import {GridCellParams} from "@material-ui/data-grid";
import {Box, ClickAwayListener, Link, Tooltip} from "@material-ui/core";
import {useState} from "react";

type TableCellArrayProps = GridCellParams & {
    valueFormatter?: (value: any) => string,
    limit?: number
}

export const TableCellArray = (params: TableCellArrayProps): JSX.Element => {

    const limit = params.limit ? params.limit : 3;

    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    function getValueFormatter(): (value: any) => string {
        return params.valueFormatter ? params.valueFormatter : v => v;
    }

    const arrayFormatter = (arr: any[]) => {
        return arr.map(value => getValueFormatter()(value)).join(', ');
    }

    if(Array.isArray(params.value)) {

        if (params.value.length < limit) {
            return (
                <>
                    {arrayFormatter(params.value)}
                </>
            );
        }

        return (
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                    {arrayFormatter(params.value.filter((value, index) => index < limit))}
                    &nbsp;

                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={arrayFormatter(params.value.filter((value, index) => index >= limit))}
                    >
                        <Link href={"#"} onClick={handleTooltipOpen}>{`+ ${params.value.length - limit} more`}</Link>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        );
    }

    return (<>params.value</>);
}
