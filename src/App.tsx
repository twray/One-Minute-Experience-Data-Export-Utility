import React from 'react';
import './App.css';

import CSVExportService from './services/CSVExportService';

interface AppProps {};

interface AppState {
  filename: string,
  filedata: string
};

class App extends React.Component<AppProps, AppState> {

  state = {
    filename: 'nodes.csv',
    filedata: 'a,b,c\nd,e,f'
  }

  async componentDidMount() {
    const csvExportService = new CSVExportService(new Date('2019-11-08'));
    await csvExportService.getNodes();
  }

  render() {
    const { filename, filedata } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(filedata)
            }
            download={filename}
          >
            Download Node List
          </a>
        </header>
      </div>
    );
  }
}

export default App;
