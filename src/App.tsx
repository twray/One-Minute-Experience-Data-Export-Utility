import React from 'react';
import './App.css';

import EventLogService from './services/EventLogService';

interface AppProps {};

interface AppState {
  filename: string,
  filedata: string
};

class App extends React.Component<AppProps, AppState> {

  eventLogService: EventLogService = new EventLogService();

  state = {
    filename: 'nodes.csv',
    filedata: 'a,b,c\nd,e,f'
  }

  async componentDidMount() {
    const events = await this.eventLogService.getScanEvents(new Date('2019-11-08'));
    console.log(events);
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
