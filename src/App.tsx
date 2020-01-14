import React from 'react';
import './App.css';

import styled from 'styled-components';

import { Artwork } from './model/Artwork';

import CSVExportService from './services/CSVExportService';

import Button from './components/Button';

const AppContainer = styled.div`
  background-color: #37474F;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppArea = styled.div`
  margin: 0;
  padding: 0 60px;
  max-width: 275px;
  max-height: 667px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  @media screen and (max-width: 576px) {
    height: auto;
  }
  p {
    text-align: center;
  }
  a {
    text-decoration: none;
    margin: 15px 0;
  }
`;

interface AppProps {};

interface AppState {
  nodes_filename: string,
  nodes_filedata: string,
  edges_filename: string,
  edges_filedata: string
};

class App extends React.Component<AppProps, AppState> {

  state = {
    nodes_filename: 'nodes.csv',
    nodes_filedata: '',
    edges_filename: 'edges.csv',
    edges_filedata: ''
  }

  async componentDidMount() {
    const csvExportService = new CSVExportService(
      new Date('2019-11-08'),
      new Date('2019-11-08'),
      new Artwork(351, 'Queen Victoria with Royal Pavilion in Background', 'H Jones')
    );
    const csvExports = await csvExportService.getCSVExports();
    this.setState({
      nodes_filedata: csvExports.nodes,
      edges_filedata: csvExports.edges
    });
  }

  render() {
    const {
      nodes_filename,
      nodes_filedata,
      edges_filename,
      edges_filedata
    } = this.state;
    return (
      <AppContainer>
        <AppArea>
          <p>
            Here, you can download a CSV data export can be used to visualise the objects in your museum and the time visitors spend reading them.
          </p>
          <a
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(nodes_filedata)
            }
            download={nodes_filename}
          >
            <Button buttonStyle="white-transparent" text="Download Nodes" />
          </a>
          <a
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(edges_filedata)
            }
            download={edges_filename}
          >
            <Button buttonStyle="white-transparent" text="Download Edges" />
          </a>
        </AppArea>
      </AppContainer>
    );
  }
}

export default App;
