import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import StockProfileButton from "./StockProfileButton";
import FavoriteStockButton from "./FavoriteStockButton";
import FavoriteStockDeleteButton from "./FavoriteStockDeleteButton";
import "../Auth/Auth";

class SingleStockDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: {}
    };
  }

  render() {
    // console.log("favorite stocks props set = ", this.props.favoriteStocks);

    let trackOrUntrackButton;

    if (this.props.favoriteStocks.has(this.props.item.symbol)) {
      trackOrUntrackButton = (
        <>
          <FavoriteStockDeleteButton
            item={this.props.item}
            deleteSymbolToTrack={this.props.deleteSymbolToTrack}
          />
        </>
      );
    } else {
      trackOrUntrackButton = (
        <>
          <FavoriteStockButton
            item={this.props.item}
            getSymbolToTrack={this.props.getSymbolToTrack}
          />
        </>
      );
    }

    let prevClose = this.props.item.last_trade_time;
    let prevCloseDate =
      new Date(prevClose).toLocaleDateString() +
      " " +
      new Date(prevClose).toTimeString();
    return (
      <Card id="stock-card">
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
          </div>
          <StockProfileButton
            item={this.props.item}
            getIndividualStockProfile={this.props.getIndividualStockProfile}
          />

          {trackOrUntrackButton}

          {/* <FavoriteStockButton
            item={this.props.item}
            getSymbolToTrack={this.props.getSymbolToTrack}
          />
          <FavoriteStockDeleteButton
            item={this.props.item}
            deleteSymbolToTrack={this.props.deleteSymbolToTrack}
          /> */}
        </Card.Body>
      </Card>
    );
  }
}

export default SingleStockDiv;
