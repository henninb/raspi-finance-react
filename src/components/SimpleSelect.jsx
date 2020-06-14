import React, { Component } from 'react'
import Select from 'react-select'

export default class SimpleSelect extends Component {

  componentDidMount () {
  }

  render() {
    return (
     <div>
      <Select
        placeholder="account name owner..."
      />
    </div>
    )
  }
}
