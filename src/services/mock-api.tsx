import {fromFetch} from "rxjs/fetch";
import {map, switchMap} from "rxjs/operators";
import {columnsCfg} from "../config/columns-config";


function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export class MockApi {


    getData$(filters: any){
        console.log('MOCK FILTERS:', filters);
        return fromFetch('/data.json').pipe(
            switchMap(response => response.json()),
            /*map(value => ({...value,
              items: new Array(100).fill(value.items[0]).map((item,i) => ({...item,
                  BriefTitle: i + item.BriefTitle,
                  StartDate: item.StartDate - i*10000,
                  Status: columnsCfg.Status.filters.choices[getRandomInt(0,columnsCfg.Status.filters.choices.length-1)],
                  StudyPhase: columnsCfg.StudyPhase.filters.choices[getRandomInt(0,columnsCfg.StudyPhase.filters.choices.length-1)],
                  StudyType: columnsCfg.StudyPhase.filters.choices[getRandomInt(0,columnsCfg.StudyPhase.filters.choices.length-1)],
              }))
            }))*/
        );
    }

}
