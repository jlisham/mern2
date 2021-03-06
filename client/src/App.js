import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/webparts/Navbar";
import Landing from "./components/webparts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Manage from "./components/profile-form/Manage";
import ProfilesPage from "./components/profile/ProfilesPage";
import PostPage from "./components/post/PostPage";
import ProfileView from "./components/profile/ProfileView";
import ManageExp from "./components/profile-form/ManageExp";
// import ManageEd from "./components/profile-form/ManageEd";
import Alert from "./components/webparts/Alert";
import PrivateRoute from "./components/routing/PrivateRoute";
//Redux
import { Provider } from "react-redux";
import { loadUser } from "./actions/auth";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={ProfilesPage} />
              <Route exact path="/profile/:id" component={ProfileView} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/manage-profile" component={Manage} />
              <PrivateRoute exact path="/posts" component={PostPage} />
              <PrivateRoute
                exact
                path="/manage-experience"
                component={ManageExp}
              />
              {/* <PrivateRoute
                exact
                path="/manage-education"
                component={ManageEd}
              /> */}
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
