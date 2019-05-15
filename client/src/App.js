import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./Auth/Auth";
import { VARS_CONFIG } from "./react-variables";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { Layout } from "./components/Layout";
import Homepage from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import UserProfile from "./Pages/UserProfile";
import StockProfile from "./Pages/StockProfile";
import NotFound from "./Pages/NotFound";
import Callback from "./components/Callback";

const auth = new Auth();

class App extends Component {
  // CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      fakeusers: [],
      users: [],
      stocks: [],
      favoriteStocks: [], //TODO: Consider using a new Set()
      individualUserProfile: {},
      individualStockProfile: {}
    };
  }

  /******************************************************************** 
  USER FUNCTIONS
  *********************************************************************/

  // function to get the info of an individual user profile
  getIndividualUserProfile = currentUser => {
    this.setState({
      individualUserProfile: currentUser
    });
  };

  /******************************************************************** 
  STOCK FUNCTIONS
  *********************************************************************/

  // function to get the info of an individual stock profile
  getIndividualStockProfile = currentStock => {
    this.setState({
      individualStockProfile: currentStock
    });
  };

  /******************************************************************** 
  FAVORITE STOCKS FUNCTIONS
  *********************************************************************/

  updateSymbolsInDatabase() {
    let profile = auth.getProfile();
    let symbols = this.state.favoriteStocks;
    console.log("Symbols updated:", symbols);

    axios({
      method: "put",
      url: `${VARS_CONFIG.localhost}/api/stockFav`,
      headers: {
        accept: "application/json"
      },
      params: profile.sub,
      data: symbols
    }).then(res => {
      console.log(`the response is: ${res}`);
    });
  }

  addSymbolToTrack = symbol => {
    let updatedSymbols = this.state.favoriteStocks.slice();
    updatedSymbols.push(symbol);
    this.setState(
      {
        favoriteStocks: updatedSymbols
      },
      this.updateSymbolsInDatabase
    );
  };

  deleteSymbolToTrack = symbol => {
    let updatedSymbols = this.state.favoriteStocks.slice();

    let symbolIndex = updatedSymbols.indexOf(symbol);
    if (symbolIndex !== -1) {
      updatedSymbols.splice(symbolIndex, 1);
      this.setState(
        {
          favoriteStocks: updatedSymbols
        },
        this.updateSymbolsInDatabase
      );
    } else {
      console.log("symbol not found to be deleted");
    }
  };

  /******************************************************************** 
  APP: 
  * Get all users into UI
  * Get all stocks into UI
  * Get all symbols (favorite stocks) for current user into UI
  *********************************************************************/

  componentDidMount() {
    let profile = auth.getProfile();
    // const { getAccessToken } = this.props.auth;
    // console.log("accessToken from App.js = ", getAccessToken());
    // console.log("Auth 0 id from app.js = ", profile.sub);
    const headers = { Authorization: `Bearer ${auth.getAccessToken()}` };

    //MAIN ALL USERS UI
    axios
      .get(`${VARS_CONFIG.localhost}/api/users`, { headers })
      .then(response => this.setState({ users: response.data }))
      .catch(error => this.setState({ error: true }));

    //MAIN ALL STOCKS UI
    axios
      .get(`${VARS_CONFIG.localhost}/api/stocks`, {
        params: {
          data:
            "HSBA.L,MSFT,AAPL,F,C,ANTM,EXFO,FDX,W,UBER,LYFT,GOOGL,CVX,CBS,BXP,FB,AMZN,ET,DELL,CMCSA,TSLA,DATA,TEVA,BAM,EXFO,WELL,ASC,CUZ,MEET,REI,ROKU,AMD,CTL,PRGO,TPR,BSX,ILMN,ISRG,NTAP,HCA,INTC,OXY,UA,CVS,BHC,CGC,1113.HK,CNA"
        },
        headers
      })
      .then(response => this.setState({ stocks: response.data }))
      .catch(error => this.setState({ error: true }));

    //MAIN ALL SYMBOLS FOR CURRENT USER
    axios
      .get(`${VARS_CONFIG.localhost}/api/myFavoriteStocks`, {
        params: profile.sub,
        headers
      })
      .then(response => {
        this.setState({ favoriteStocks: response.data.favoriteStocks });
      })
      .catch(error => this.setState({ error: true }));
  }

  /******************************************************************** 
  APP ROUTES: 
  * ("/") homepage/login/explore
  * Dashboard
  * Users
  * User profile by ID
  * Stock profile by ID
  # logout 
  # login callback 
  *********************************************************************/

  render() {
    return (
      <div className="App">
        <header>
          <BrowserRouter>
            <NavigationBar {...this.props} />
            <Layout>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Homepage
                      // users={this.state.users}
                      {...this.props}
                      stocks={this.state.stocks}
                      // getIndividualUserProfile={this.getIndividualUserProfile}
                      getIndividualStockProfile={this.getIndividualStockProfile}
                      getSymbolToTrack={this.addSymbolToTrack}
                      deleteSymbolToTrack={this.deleteSymbolToTrack}
                    />
                  )}
                />

                <Route path="/callback" render={props => <Callback />} />

                <Route
                  path="/Dashboard"
                  render={props =>
                    this.props.auth.isAuthenticated() ? (
                      <Dashboard
                        // users={this.state.users}
                        favoriteStocks={this.state.favoriteStocks}
                        {...this.props}
                        getIndividualUserProfile={
                          this.props.getIndividualUserProfile
                        }
                        getIndividualStockProfile={
                          this.getIndividualStockProfile
                        }
                        deleteSymbolToTrack={this.deleteSymbolToTrack}
                      />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )
                  }
                />

                <Route
                  path="/users"
                  render={props =>
                    this.props.auth.isAuthenticated() ? (
                      <Users
                        {...this.props}
                        users={this.state.users}
                        getIndividualUserProfile={this.getIndividualUserProfile}
                        getIndividualStockProfile={
                          this.getIndividualStockProfile
                        }
                        favoriteStocks={this.state.favoriteStocks}
                        getSymbolToTrack={this.addSymbolToTrack}
                        deleteSymbolToTrack={this.deleteSymbolToTrack}
                      />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )
                  }
                />

                <Route
                  path="/userProfile/:userId"
                  render={props =>
                    this.props.auth.isAuthenticated() ? (
                      <UserProfile
                        {...this.props}
                        user={this.state.individualUserProfile}
                        getIndividualStockProfile={
                          this.getIndividualStockProfile
                        }
                        favoriteStocks={this.state.favoriteStocks}
                        getSymbolToTrack={this.addSymbolToTrack}
                        deleteSymbolToTrack={this.deleteSymbolToTrack}
                      />
                    ) : (
                      <Homepage {...this.props} />
                    )
                  }
                />

                <Route
                  path="/stockProfile/:stockId"
                  render={props =>
                    this.props.auth.isAuthenticated() ? (
                      <StockProfile
                        {...this.props}
                        stock={this.state.individualStockProfile}
                      />
                    ) : (
                      <Homepage {...this.props} />
                    )
                  }
                />

                <Route
                  path="/logout"
                  render={props =>
                    this.props.auth.isAuthenticated() ? (
                      <Homepage {...this.props} />
                    ) : (
                      <Homepage {...this.props} />
                    )
                  }
                />

                <Route component={NotFound} />
              </Switch>
            </Layout>
          </BrowserRouter>
        </header>

        {/* {mainComponent} */}
      </div>
    );
  }
}

export default App;
