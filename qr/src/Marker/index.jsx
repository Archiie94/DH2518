import React, { Component } from 'react'
import { Icon } from 'react-onsenui'
import './index.css'

export default class Marker extends Component {
  render() {
    const queue = this.props.queue
    const click = this.props.click
    return (
      <div className='text-blue'>
        <Icon icon='ion-ios-location'></Icon>
        <div ripple className='marker-content bg-blue'
            onClick={() => click(queue)}>
          <p className='id'>{queue.id}</p>
          <p className='address'>{queue.address}</p>
        </div>
      </div>
    )
  }
}
