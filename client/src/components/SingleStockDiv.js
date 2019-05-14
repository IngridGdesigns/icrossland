import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import { VARS_CONFIG } from "../react-variables";
import StockProfileButton from "./StockProfileButton";
import FavoriteStockButton from "./FavoriteStockButton";
import axios from "axios";
import Auth from "../Auth/Auth";

const auth = new Auth();

class SingleStockDiv extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      stock: {}
    };
  }

  // to handle deleting an event from database
  handleDeleteSearch = deletedUser => {
    const headers = { Authorization: `Bearer ${auth.getAccessToken()}` };
    console.log("access token from singleStockUser = ", auth.getAccessToken());

    axios({
      method: "delete",
      url: `${VARS_CONFIG.localhost}/api/users/` + deletedUser._id,
      headers
    }).then(res => {
      this.props.deleteUser(res);
      console.log(res);
    });
  };

  render() {
    let prevClose = this.props.item.last_trade_time;
    let prevCloseDate =
      new Date(prevClose).toLocaleDateString() +
      " " +
      new Date(prevClose).toTimeString();
    return (
      <Card id="stock-card" style={{ width: "22rem", height: "43rem" }}>
        <Card.Body>
          <Card.Title>{this.props.item.name}</Card.Title>
          <div>
            <span className="stockSymbol">
              {this.props.item.symbol} <br />
            </span>
            {this.props.item.stock_exchange_long} <br /> <br />
            <div
              className={
                "stockDayChange " +
                (parseFloat(this.props.item.day_change) >= 0
                  ? "green-positive"
                  : "red-negative")
              }
            >
              {this.props.item.day_change}
              <span className="small-text">
                ({this.props.item.change_pct}%)
              </span>
            </div>
            <br />
            <span className="stockOpenPrice">
              {this.props.item.price_open} {this.props.item.currency}
            </span>
            <br />
            <br />
            <Table>
              <tbody>
                <tr>
                  <td>High:</td>
                  <td>{this.props.item.day_high}</td>
                </tr>
                <tr>
                  <td>Low:</td>
                  <td>{this.props.item.day_low}</td>
                </tr>
                <tr>
                  <td>Prev close:</td>
                  <td>{this.props.item.close_yesterday}</td>
                </tr>
              </tbody>
            </Table>
            Closed: {prevCloseDate} <br /> <br />
            {/* 52_week_high: {this.props.item.52_week_high} <br /> <br /> */}
            {/* 52_week_low: {this.props.item.52_week_low} <br /> <br /> */}
            {/* market_cap: {this.props.item.market_cap} <br /> <br /> */}
            {/* volume: {this.props.item.volume} <br /> <br /> */}
            {/* shares: {this.props.item.shares} <br /> <br /> */}
            {/* stock_exchange_short: {
              this.props.item.stock_exchange_short
            } <br /> <br /> */}
            {/* timezone: {this.props.item.timezone} <br /> <br /> */}
            {/* timezone_name: {this.props.item.timezone_name} <br /> <br /> */}
            {/* gmt_offset: {this.props.item.gmt_offset} <br /> <br /> */}
          </div>
          <StockProfileButton
            item={this.props.item}
            getIndividualStockProfile={this.props.getIndividualStockProfile}
          />
          <FavoriteStockButton
            item={this.props.item}
            getSymbolToTrack={this.props.getSymbolToTrack}
          />
        </Card.Body>
      </Card>
    );
  }
}

export default SingleStockDiv;
