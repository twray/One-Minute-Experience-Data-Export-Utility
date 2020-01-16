import React, { ChangeEvent } from 'react';
import './App.css';

import styled from 'styled-components';
import moment, { Moment } from 'moment';

import CSVExportService from './services/CSVExportService';

import Button from './components/Button';
import SingleLineDateInput from './components/SingleLineDateInput';

const AppContainer = styled.div`
  background-color: #37474F;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const AppArea = styled.div`
  margin: 0;
  padding: 120px 60px;
  max-width: 550px;
  color: #FFFFFF;
  @media screen and (max-width: 576px) {
    height: auto;
    padding: 15px;
  }
  a {
    text-decoration: none;
  }
  Button {
    margin: 20px 0;
  }
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  a + a {
    margin-left: 20px;
  }
`;

interface AppProps {};

interface AppState {
  search_startdate: string,
  search_enddate: string,
  dates_are_valid: boolean,
  is_searching_dates: boolean,
  has_searched_for_dates: boolean,
  has_search_network_error: boolean,
  has_data_for_dates: boolean,
  nodes_filename: string,
  nodes_filedata: string,
  edges_filename: string,
  edges_filedata: string
};

const DATE_FORMAT = "YYYY-MM-DD";

class App extends React.Component<AppProps, AppState> {

  state = {
    search_startdate: '',
    search_enddate: '',
    dates_are_valid: false,
    is_searching_dates: false,
    has_searched_for_dates: false,
    has_search_network_error: false,
    has_data_for_dates: false,
    nodes_filename: 'nodes.csv',
    nodes_filedata: '',
    edges_filename: 'edges.csv',
    edges_filedata: ''
  }

  handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {

    const search_startdate = e.target.value;
    let { search_enddate } = this.state;
    const startdate: Moment = moment(search_startdate, DATE_FORMAT, true);
    let enddate: Moment = moment(search_enddate, DATE_FORMAT, true);

    if (startdate.isValid() && !search_enddate) {
      enddate = startdate
    }

    this.setState({
      search_startdate: startdate.format(DATE_FORMAT),
      search_enddate: enddate.format(DATE_FORMAT),
      dates_are_valid: this.datesAreValid(startdate, enddate)
    });

  }

  handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {

    let { search_startdate } = this.state;
    const search_enddate = e.target.value;
    let startdate: Moment = moment(this.state.search_startdate, DATE_FORMAT, true);
    const enddate: Moment = moment(search_enddate, DATE_FORMAT, true);

    if (enddate.isValid() && !search_startdate) {
      startdate = enddate
    }

    this.setState({
      search_startdate: startdate.format(DATE_FORMAT),
      search_enddate: enddate.format(DATE_FORMAT),
      dates_are_valid: this.datesAreValid(startdate, enddate)
    });

  }

  handleSearchDatesButtonClick = async () => {

    const { search_startdate, search_enddate } = this.state;

    this.setState({is_searching_dates: true});

    const csvExportService = new CSVExportService(
      new Date(search_startdate),
      new Date(search_enddate)
    );

    let hasSearchNetworkError = false;
    let visualisation;

    try {
      visualisation = await csvExportService.getCSVExports();
    } catch {
      hasSearchNetworkError = true;
    }

    if (!hasSearchNetworkError && visualisation?.has_data) {
      this.setState({
        is_searching_dates: false,
        has_searched_for_dates: true,
        has_search_network_error: hasSearchNetworkError,
        has_data_for_dates: true,
        nodes_filedata: visualisation.csv_exports.nodes,
        edges_filedata: visualisation.csv_exports.edges
      });
    } else {
      this.setState({
        is_searching_dates: false,
        has_searched_for_dates: true,
        has_search_network_error: hasSearchNetworkError,
        has_data_for_dates: false
      });
    }

  }

  datesAreValid = (startdate: Moment, enddate: Moment) => {
    let now: Moment = moment();
    return startdate.isValid() && !startdate.isAfter(now) &&
           enddate.isValid() && !enddate.isAfter(now) &&
           !startdate.isAfter(enddate)
  };

  render() {
    const {
      search_startdate,
      search_enddate,
      dates_are_valid,
      is_searching_dates,
      has_searched_for_dates,
      has_search_network_error,
      has_data_for_dates,
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
            Begin by selecting the date range of your data export. For example, if you would like to visualise all visitor interactions that took place during an exhibition, set the following dates so that they correspond to the beginning and end of that exhibition.
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
            text="Search Dates"
            disabled={!dates_are_valid && !is_searching_dates}
            onClick={this.handleSearchDatesButtonClick}
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
          {is_searching_dates && <p>Please wait ...</p>}
          {!is_searching_dates && has_searched_for_dates &&
            <>
              {has_data_for_dates &&
                <>
                  <p>
                    Your export is available to download as two CSV files: nodes.csv and edges.csv. Both files are required for the visualisation.
                  </p>
                  <ButtonBar>
                    <a
                      href={
                        'data:text/plain;charset=utf-8,' +
                        encodeURIComponent(nodes_filedata)
                      }
                      download={nodes_filename}
                    >
                      <Button
                        buttonStyle="white-transparent"
                        text="Download Nodes" />
                    </a>
                    <a
                      href={
                        'data:text/plain;charset=utf-8,' +
                        encodeURIComponent(edges_filedata)
                      }
                      download={edges_filename}
                    >
                      <Button
                        buttonStyle="white-transparent"
                        text="Download Edges" />
                    </a>
                  </ButtonBar>
                </>
              }
              {!has_data_for_dates && !has_search_network_error &&
                <p>No visitor data available for these dates.</p>
              }
              {has_search_network_error &&
                <p>A problem occurred while exporting your data.</p>
              }
            </>
          }
        </AppArea>
      </AppContainer>
    );
  }
}

export default App;
