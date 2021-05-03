import React from 'react';
import logo from './logo.svg';
import './App.css';
import {MockApi} from "./services/mock-api";
import {MultiFilterMuiDatagrid} from "./components/multi-filter-mui-datagrid";

function App() {

    let api = new MockApi();

  return (
    <div className="App">
      <MultiFilterMuiDatagrid api={api}/>
    </div>
  );
}

export default App;
