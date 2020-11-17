import React, {Component} from 'react'
import Routes from './components/Routes'

require('dotenv').config()

export default class App extends Component {
    render() {
        return (
            <Routes/>
        )
    }
}
