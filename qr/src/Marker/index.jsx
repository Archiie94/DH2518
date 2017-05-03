import React, { Component } from 'react'
import './index.css'

export default class Marker extends Component {
  render() {
    const text = this.props.text
    return (
      <div>
        {text}
      </div>
    )
  }
}
