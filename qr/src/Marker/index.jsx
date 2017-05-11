import React, { Component } from 'react'
import { Icon } from 'react-onsenui'
import './index.css'

export default class Marker extends Component {
  render() {
    const place = this.props.place
    const click = this.props.click
    return (
      <div className='text-blue marker-wrapper'>
        <Icon className='icon' icon='ion-ios-location'></Icon>
        <div onClick={() => click(place)} className="clearfix marker-info">
          {place.id}
        </div>
      </div>
      )
  }
}
