import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import UserInfo from './components/UserInfo';
import BuySLS from './components/BuySLS';


class App extends Component {
    render() {
        return ( 
            <div>
            <UserInfo />
            <BuySLS />
            </div>
        );
    }
}

export default App
