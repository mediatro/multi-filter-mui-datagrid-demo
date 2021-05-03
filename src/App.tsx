import React from 'react';
import logo from './logo.svg';
import './App.css';
import {MockApi} from "./services/mock-api";
import {MultiFilterMuiDatagrid} from "./components/multi-filter-mui-datagrid";
import {Box, Container} from "@material-ui/core";

function App() {

    let api = new MockApi();

  return (
    <Container>
        <Box p={2}>
            <MultiFilterMuiDatagrid api={api}/>
        </Box>
    </Container>
  );
}

export default App;
