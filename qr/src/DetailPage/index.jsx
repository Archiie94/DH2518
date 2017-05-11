import R from 'ramda'
import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import {Page, Dialog} from 'react-onsenui'
import './index.css'
import model from '../model'
import CustomToolbar from './../CustomToolbar'
import Chat from './../Chat'
import Marker from './../Marker'

export default class DetailPage extends Component {

  constructor(props) {
    super(props)
    this.notify = this.notify.bind(this)
    this.model = model
    this.toggleChatMode = this.toggleChatMode.bind(this)
    this.toggleJoinQueue = this.toggleJoinQueue.bind(this)
    this.createMapOptions = this.createMapOptions.bind(this)
    this.state = {
      chatMode: false
    }
  }
  toggleChatMode (state){
    this.setState({
      chatMode: state
    })
  }

  createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
      zoomControl: false,
      fullscreenControl: false,
      mapTypeControl: false
    };
  }

  toggleJoinQueue(id) {
    if (model.isInQueue(id)) {
      this.model.leaveQueue(id)
    } else {
      this.model.joinQueue(id)
    }
  }

  componentDidMount() {
    this.model.subscribe(this)
  }

  componentWillUnmount() {
    this.model.unsubscribe(this)
  }

  notify(updates) {
    this.setState(R.merge(this.state, updates))
  }

  render() {
    const { places, queues, user } = this.model.getState()
    const place = R.find(R.propEq('id', this.props.queueId))(places)
    const q = R.find(R.propEq('id', this.props.queueId))(queues) || {}
    const queue = q.queue || [] // Empty if the queue is empty
    const center = { lat: 59.3446561, lng: 18.0555958 }
    const zoom = 11
    const renderMarker = queue => (
      <Marker
        {...queue.coordinates}
        queue={queue}
        click={()=>{}}
      />
    )

    const toggle = () => this.toggleJoinQueue(queue)
    const directions = "https://www.google.com/maps/dir//" + queue.coordinates.lat + "," + queue.coordinates.lng
    const renderButtons = () =>(
      model.isInQueue(this.props.queueId)
      ? <div className="button-wrapper">
          <div className="list__blue center add-button">
            Add 5 minutes
          </div>
          <div className="list__blue center red leave-button" onClick={() => this.toggleJoinQueue(this.props.queueId)}>
            Leave Queue
          </div>
        </div>
      : <div className="list__blue nomargin center" onClick={() => this.toggleJoinQueue(this.props.queueId)}>
          Join Queue
        </div>
    )
    const placeInLine = R.findIndex(R.propEq('id', user.id), queue) + 1;
    return (
      <Page renderToolbar={() => <CustomToolbar/>}>
        <div className="pagePadding">
          <div className='map-wrapper'>
            <GoogleMapReact
              defaultCenter={center}
              defaultZoom={zoom}
              options={this.createMapOptions}
            >
              { places.map(renderMarker) }
            </GoogleMapReact>
          </div>
          <div className="detail-content">
            <br />
            <div className="left">
              <strong>{place.id}</strong><br />
              <small>{place.address}</small><br />
              <small>{place.hours}</small>
            </div>
            <div className="right">
              <a className="directions text-blue" target="_blank" href={directions}>
              </a>
            </div>
            <div className="clearBoth"></div>
            <br />

            <div className="left">
              <div className="left">
                <div className="detail__circle bg-blue">
                  <div className="detail__circle_adjustment">
                    {placeInLine == 0 ? queue.length : placeInLine}
                  </div>
                </div>
              </div>
              <div className="right detail__custom_margin">
                <strong>{placeInLine == 1 ? 'Person' : 'People'}</strong> <br />
                <small>Before you</small>
              </div>
              <div className="clearBoth"></div>
            </div>

            <div className="right">
              <div className="left">
                <div className="detail__circle bg-yellow">
                  <div className="detail__circle_adjustment">
                    20
                  </div>
                </div>
              </div>
              <div className="right detail__custom_margin">
                <strong>Minutes</strong> <br />
                <small>To wait</small>
              </div>
              <div className="clearBoth"></div>
            </div>
            <div className="clearBoth"></div>
            <br />

              {renderButtons()}

            <br />
            <Dialog isOpen={this.state.chatMode} className='displayChat'>
              <div className='displayChat__content'>
                <div className="closeChatBox" onClick={()=> this.toggleChatMode(false) }>
                  <ons-icon icon="ion-close-circled"></ons-icon>
                </div>
                <Chat/>
              </div>
            </Dialog>
            <div className="lockToBottom">
              <div className="left customSearch">
                <input onClick={()=> this.toggleChatMode(true) } placeholder="Need help?" type="search" className="search-input helpbar width100" />
              </div>
              <div className="right customSearch list__blue nopadding nomargin">
               Send
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
