import React, { Component } from 'react'
import Select from 'react-select'

export default class SimpleSelect extends Component {

  componentDidMount () {
  }

  render() {
    return (
     <div style={{width: '250px'}}>
      <Select
        placeholder="account name owner..."
      />
    </div>
    )
  }
}
