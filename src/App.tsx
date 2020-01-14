import React, { ChangeEvent } from 'react';
import './App.css';

import styled from 'styled-components';
import moment from 'moment';

import { Artwork } from './model/Artwork';

import CSVExportService from './services/CSVExportService';

import Button from './components/Button';
import SingleLineDateInput from './components/SingleLineDateInput';

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
  max-width: 450px;
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
  search_startdate: string,
  search_enddate: string,
  dates_are_valid: boolean,
  nodes_filename: string,
  nodes_filedata: string,
  edges_filename: string,
  edges_filedata: string
};

class App extends React.Component<AppProps, AppState> {

  state = {
    search_startdate: '',
    search_enddate: '',
    dates_are_valid: false,
    nodes_filename: 'nodes.csv',
    nodes_filedata: '',
    edges_filename: 'edges.csv',
    edges_filedata: ''
  }

  async componentDidMount() {
    /*
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
    */
  }

  handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ search_startdate: e.target.value }, () => {
      this.setState({ dates_are_valid: this.datesAreValid() });
    });
  }

  handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ search_enddate: e.target.value }, () => {
      this.setState({ dates_are_valid: this.datesAreValid() });
    });
  }

  datesAreValid = (): boolean => {

    const { search_startdate, search_enddate } = this.state;

    return (
      moment(search_startdate, "YYYY-MM-DD").isValid() &&
      moment(search_enddate, "YYYY-MM-DD").isValid()
    )

  }

  render() {
    const {
      search_startdate,
      search_enddate,
      dates_are_valid,
      nodes_filename,
      nodes_filedata,
      edges_filename,
      edges_filedata
    } = this.state;
    return (
      <AppContainer>
        <AppArea>
          <h1>One Minute Data Export Utility</h1>
          <p>
            One Minute records visitor data, including the time they spent viewing artworks and reading stories. You can download a CSV data export can be used to visualise how visitors interact with your objects.
          </p>
          <p>
            Begin by selecting the date range of your data export. For example, if you would like to visualise all visitor interactions that took place under a particular exhibition, set the following dates so that they correspond to the beginning and end of that exhibition.
          </p>
          <SingleLineDateInput
            inputStyle="dark"
            label="From the beginning of:"
            value={search_startdate}
            onChange={this.handleStartDateChange}
          />
          <SingleLineDateInput
            inputStyle="dark"
            label="To the end of:"
            value={search_enddate}
            onChange={this.handleEndDateChange}
          />
          <p></p>
          <Button
            buttonStyle="white-transparent"
            text="Continue"
            disabled={!dates_are_valid}
          />
          {false &&
            <>
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
            </>
          }
        </AppArea>
      </AppContainer>
    );
  }
}

export default App;
