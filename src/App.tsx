import React from 'react';
import './App.css';

import { Artwork } from './model/Artwork';

import CSVExportService from './services/CSVExportService';

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
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(nodes_filedata)
            }
            download={nodes_filename}
          >
            Download Node List
          </a>
          <a
            className="App-link"
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(edges_filedata)
            }
            download={edges_filename}
          >
            Download Edge List
          </a>
        </header>
      </div>
    );
  }
}

export default App;
