import React, { Component } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { VARS_CONFIG } from "../react-variables";
import "../Auth/Auth";
import "./Profile.css";
import axios from "axios";
import Styles from "./Pages-Styles/StockProfileStyles";
import MyLineGraph from "../components/MyLineGraph";

class StockProfile extends Component {
  // CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      stock: props.stock,
      profile: {},
      historyData: {},
      historyDates: [],
      historyOpenData: [],
      historyCloseData: [],
      realHistoryData: {},
      error: false
    };
  }

  organizedHistoryData = historyData => {
    let historyDates = Array.from(Object.keys(historyData.data));
    let historyOpenData = [];
    let historyCloseData = [];
    for (let i = 0; i < historyDates.length; i++) {
      historyOpenData.push(historyData.data[historyDates[i]].open);
      historyCloseData.push(historyData.data[historyDates[i]].close);
    }

    this.setState({
      historyDates: historyDates,
      historyOpenData: historyOpenData,
      historyCloseData: historyCloseData
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { history } = this.props;
    history.push("/");
  };

  addCommas = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  componentWillMount() {
    function isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    }

    const { getAccessToken } = this.props.auth;
    // console.log(this.props.auth.getAccessToken);
    const headers = { Authorization: `Bearer ${getAccessToken()}` };

    if (isEmpty(this.props.stock)) {
      // console.log("no props, fetch needed");
      axios
        .get(
          `${VARS_CONFIG.localhost}/api/stocks/${
            this.props.match.params.stockId
          }`,
          { headers }
        )
        .then(response => {
          this.setState({ stock: response.data });
        })
        .catch(error => this.setState({ error: true }));

      // FAKE AXIOS CALL FOR HISTORY/USER.SYMBOL
      axios
        .get(`${VARS_CONFIG.localhost}/api/stocks/history`, { headers })
        .then(response => {
          this.setState({ historyData: response });
          this.organizedHistoryData(response);
        })
        .catch(error => this.setState({ error: true }));
    } else {
      // console.log("props were passed!");

      //REAL AXIOS CALL FOR HISTORY/USER.SYMBOL
      axios
        .get(
          `${VARS_CONFIG.localhost}/api/stocks/history/${
            this.props.match.params.stockId
          }`,
          { headers }
        )
        .then(response => {
          this.setState({ historyData: response });
          this.organizedHistoryData(response);
        })
        .catch(error => this.setState({ error: true }));
    }
  }

  render() {
    let currentStock = this.state.stock;
    let prevClose = this.state.stock.last_trade_time;
    let prevCloseDate =
      new Date(prevClose).toLocaleDateString() +
      " " +
      new Date(prevClose).toTimeString();

    return (
      <Styles>
        <div className="STOCKPROFILE-body">
          <h1>{this.state.stock.name}</h1>
          <Container>
            <Row>
              <Col>
                <div className="stock-basic-info">
                  <span className="stockSymbol">
                    {this.state.stock.symbol} <br />
                  </span>
                  {this.state.stock.stock_exchange_long} <br />
                  {this.state.stock.timezone_name} <br />
                  {this.state.stock.timezone} timezone <br />
                  <br />
                  <div
                    className={
                      "stockDayChange " +
                      (parseFloat(this.state.stock.day_change) >= 0
                        ? "green-positive"
                        : "red-negative")
                    }
                  >
                    {this.state.stock.day_change}
                    <span className="small-text">
                      ({this.state.stock.change_pct}%)
                    </span>
                  </div>
                  <br />
                  <span className="stockOpenPrice">
                    {this.state.stock.price_open} {this.state.stock.currency}
                  </span>
                  <br />
                  <br />
                </div>
              </Col>
              <Col>
                <div className="table-container">
                  <Table>
                    <tbody>
                      <tr>
                        <td>High:</td>
                        <td>
                          {this.state.stock.day_high}{" "}
                          {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>Low:</td>
                        <td>
                          {this.state.stock.day_low} {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>Prev close:</td>
                        <td>
                          {this.state.stock.close_yesterday}{" "}
                          {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>52-week high:</td>
                        <td>
                          {currentStock["52_week_high"]}{" "}
                          {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>52-week low:</td>
                        <td>
                          {currentStock["52_week_high"]}{" "}
                          {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>Market cap:</td>
                        <td>
                          {this.addCommas(this.state.stock.market_cap)}{" "}
                          {this.state.stock.currency}
                        </td>
                      </tr>
                      <tr>
                        <td>Volume:</td>
                        <td>{this.addCommas(this.state.stock.volume)}</td>
                      </tr>
                      <tr>
                        <td>Volume Average:</td>
                        <td>{this.addCommas(this.state.stock.volume_avg)}</td>
                      </tr>
                      <tr>
                        <td>Shares:</td>
                        <td>{this.addCommas(this.state.stock.shares)}</td>
                      </tr>
                      <tr>
                        <td>gmt offset:</td>
                        <td>{this.state.stock.gmt_offset}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            <div className="graph-container">
              <h2>Open and Close Data</h2>
              <MyLineGraph
                id="graph"
                historyDates={this.state.historyDates}
                historyOpenData={this.state.historyOpenData}
                historyCloseData={this.state.historyCloseData}
              />
            </div>
          </Container>
        </div>
      </Styles>
    );
  }
}

export default withRouter(StockProfile);
