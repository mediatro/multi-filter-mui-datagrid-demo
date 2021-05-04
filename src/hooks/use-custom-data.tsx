import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {FiltersContext} from "../components/multi-filter-mui-datagrid";
import {Filters} from "../services/filters-state";

type UseCustomDataCallback = (filters: Filters) => void;

export const useCustomData = (callback: UseCustomDataCallback) => {

    const fc = useContext(FiltersContext);
    const [filters, setFilters] = useState<Filters>();

    useEffect(() => {
        if(filters){
            callback(filters);
        }
    },[filters]);

    useEffect(() => {
        fc.state.filtersChange$.subscribe(value => setFilters(value));
    },[]);

}
