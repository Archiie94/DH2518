// import React from 'react'
// import ReactDOM from 'react-dom'
// import CustomToolbar from './CustomToolbar'
// import {Page} from 'react-onsenui'

// export default class DetailPage extends React.Component {

//   constructor(props) {
//     super(props)
//     this.goBack = this.goBack.bind(this)
//   }

//   goBack() {
//   }

//   render() {
//     return (
//       <Page renderToolbar={this.renderToolbar}>
//         <ons-toolbar>
//           <CustomToolbar/>
//           <div className="detail-map">
//           </div>
//           <div className="center">
//             Some very useful information
//           </div>
//         </ons-toolbar>
//       </Page>
//     )
//   }
// }

import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Page} from 'react-onsenui'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class DetailPage extends Component {

  render() {
    const center = {lat: 59.95, lng: 30.33}
    const zoom = 11
    return (
      <Page>
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </Page>
    );
  }
}
