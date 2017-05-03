import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import {Page} from 'react-onsenui'
import './index.css'

import CustomToolbar from './../CustomToolbar'
import Marker from './../Marker'

export default class DetailPage extends Component {

  render() {
    const center = { lat: 59.3446561, lng: 18.0555958 }
    const zoom = 11
    return (
      <Page renderToolbar={() => <CustomToolbar/>}>
        <div className='map-wrapper'>
          <GoogleMapReact
            defaultCenter={center}
            defaultZoom={zoom}
          >
            <Marker
              lat={59.3447231}
              lng={18.0632769}
              text={'Systembolaget Birger Jarlsgatan'}
            />
          </GoogleMapReact>
        </div>
        <div className="detail-content">
          Hello This is a test
          <br/>
          Probably need some more info here?
        </div>
      </Page>
    );
  }
}
