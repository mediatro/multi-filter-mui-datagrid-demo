import {fromFetch} from "rxjs/fetch";
import {map, switchMap} from "rxjs/operators";
import {GridColDef, GridRowData} from "@material-ui/data-grid";


export type TableData = {
    cols: GridColDef[],
    rows: GridRowData[],
}

export class MockApi {

    getData$(filters: any){
        console.log('MOCK FILTERS:', filters);
        return fromFetch('/data.json').pipe(
            switchMap(response => response.json()),
            map(value => ({...value,
              items: new Array(100).fill(value.items[0]).map((item,i) => ({...item,
                  BriefTitle: i + item.BriefTitle,
                  StartDate: item.StartDate - i*1000,
              }))
            }))
        );
    }

}
