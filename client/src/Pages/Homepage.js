import React, { Component } from "react";
import logo from "../logo.svg";
import { Row } from "react-bootstrap";
import SingleUserDiv from "../components/SingleUserDiv";
import SingleStockDiv from "../components/SingleStockDiv";

class Homepage extends Component {
  constructor(props) {
    super(props); // props is an object that has users in it now
    this.state = {
      users: props.users,
      stocks: props.stocks
    };
  }

  render() {
    return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to React, {this.props.name}</h1>
        Do you want to see the profile area?
        {this.props.auth.isAuthenticated() && (
          <div>
            <a href="/secret">Click here</a>
            <div>
              <h4>All users:</h4>
              {/* USERS DIVS */}
              <Row>
                {this.props.users.map(item => {
                  console.log(item);
                  return (
                    <div>
                      <SingleUserDiv
                        key={item._id}
                        item={item}
                        getIndividualUserProfile={
                          this.props.getIndividualUserProfile
                        }
                        addUser={this.props.addUser}
                        deleteUser={this.props.deleteUser}
                      />
                    </div>
                  );
                })}
              </Row>
              {/* STOCKS DIVS */}
              <Row>
                {this.props.stocks.map(item => {
                  console.log(item);
                  return (
                    <div>
                      <SingleStockDiv
                        key={item.symbol}
                        item={item}
                        getIndividualUserProfile={
                          this.props.getIndividualUserProfile
                        }
                        getIndividualStockProfile={
                          this.getIndividualStockProfile
                        }
                        addUser={this.props.addUser}
                        deleteUser={this.props.deleteUser}
                      />
                    </div>
                  );
                })}
              </Row>
            </div>
          </div>
        )}
        {!this.props.auth.isAuthenticated() && (
          <div>
            <hr />
            Please login first
            <hr />
            <button onClick={this.props.auth.login}>login</button>
          </div>
        )}
      </div>
    );
  }
}

export default Homepage;
