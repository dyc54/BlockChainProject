import './App.css';
import Navbar from './Navbar';
import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route exact path = '/register'> TO DO </Route>
          <Route exact path = '/change-password'> TO DO </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
