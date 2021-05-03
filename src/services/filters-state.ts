import {GridFilterItem, GridFilterModel, GridPageChangeParams, GridSortModel} from "@material-ui/data-grid";
import {columnsCfg, ConfigKey, FiltersCfg} from "../config/columns-config";
import {ReplaySubject, Subject} from "rxjs";

export type Filters = {
    pageChange?: GridPageChangeParams,
    sortModel?: GridSortModel,
    filterModel: GridFilterModel,
}
export type FiltersAware = {
    filters: Filters,
}



export const defaultFilters: Filters = {
    filterModel: {
        items: []
    }
};

export class FiltersState {

    filters: Filters = defaultFilters;

    filtersChange$: Subject<Filters> = new ReplaySubject(1);

    constructor() {
        this.setFilters(defaultFilters);
    }

    getColumnsCfg(): {[key in ConfigKey] : any}{
        return columnsCfg;
    }

    getFiltersConfig(): FiltersCfg {
        let ret: FiltersCfg = {};
        let cfg = this.getColumnsCfg();
        for (let colKey in cfg) {
            if(cfg[colKey].filters){
                ret[colKey] = cfg[colKey].filters;
            }
        }
        return ret;
    }

    getFilters(): Filters {
        return this.filters;
    }

    setFilters(filters: Filters){
        this.filters = filters;
        this.filtersChange$.next(this.filters);
    }

    mergeFilters(part: Partial<Filters>) {
        this.setFilters({...this.getFilters(), ...part});
    }

    clearFilters()  {
        return this.mergeFilters({filterModel: {
            items: []
        }});
    }

    hasFilter(filter: GridFilterItem): boolean {
        return this.getFilters().filterModel.items.includes(filter);
    }

    addFilter(filter: GridFilterItem){
        return this.mergeFilters({filterModel: {
            items: this.getFilters().filterModel.items.concat([filter])
        }});
    }

    removeFilter(filter: GridFilterItem){
        let items = this.getFilters().filterModel.items;
        items.splice(items.indexOf(filter), 1);
        return this.mergeFilters({filterModel: {
            items: items
        }});
    }

    applyFilter(filter: GridFilterItem){
        if(!this.hasFilter(filter)){
            this.addFilter(filter);
        }else{
            this.setFilters(this.getFilters());
        }
    }

    private getFiltersFor(field: string) {
        return this.getFilters().filterModel.items.filter(item => item.columnField === field);
    }

    hasFilterFor(field: string): boolean {
        return this.getFiltersFor(field).length > 0;
    }

    getFilterFor(field: string): GridFilterItem {
        return this.getFiltersFor(field)[0];
    }

    createFilter(field: string): GridFilterItem {
        return {
            columnField: field,
            value: undefined,
            operatorValue: 'contains',
        }
    }

    resolveFilter(field: string): GridFilterItem {
        return this.hasFilterFor(field) ? this.getFilterFor(field) : this.createFilter(field);
    }

}
