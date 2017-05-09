import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import {Page} from 'react-onsenui'
import './index.css'
import model from '../model'
import CustomToolbar from './../CustomToolbar'
import Marker from './../Marker'

export default class DetailPage extends Component {

  constructor(props) {
    super(props)
    this.notify = this.notify.bind(this)
    this.model = model
    this.toggleChatMode = this.toggleChatMode.bind(this);
    this.state = { 
      chatMode: false
    }
  }
  toggleChatMode (state){
    this.setState({
      chatMode: state
    })
  }
  componentDidMount() {
    this.model.subscribe(this)
  }

  componentWillUnmount() {
    this.model.unsubscribe(this)
  }

  notify(newState) {
    this.setState(newState)
  }

  // To check if 
  // this.props.queue.inQueue;

  render() {
    const center = { lat: 59.3446561, lng: 18.0555958 }
    const zoom = 11
    return (
      <Page renderToolbar={() => <CustomToolbar/>}>
        <div className="pagePadding">
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
            <br />
            <strong>Försäkringskassan</strong><br />
            <small>Roslagsgatan 29</small><br />
            <small>Måndag - Fredag: 8-18</small>

            <div className="clearBoth"></div>
            <br />

            <div className="left">
              <div className="left">
                <div className="detail__circle bg-blue">
                  <div className="detail__circle_adjustment">
                    8
                  </div>
                </div>
              </div>
              <div className="right detail__custom_margin">
                <strong>Persons</strong> <br />
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
            <div className="list__blue nomargin center">
              Join Queue
            </div>
            <br />
            
            <div className={ this.state.chatMode ? 'displayChat' : 'hidden' }>
              <div className="closeChatBox" onClick={()=> this.toggleChatMode(false) }>
                <ons-icon icon="ion-close-circled"></ons-icon>
              </div>
              <strong>Talking with Försäkringskassan</strong><br /><br />
              <strong>You sent</strong><br />
              <small>HEELLLOOOO</small><br />
              <strong>Admin sent</strong><br />
              <small>HEELLLOOOO</small><br />
            </div>
            <div className="lockToBottom">
              <div className="left customSearch">
                <input placeholder="Need help?" type="search" className="search-input helpbar width100" />
              </div>
              <div onClick={()=> this.toggleChatMode(true) } className="right customSearch list__blue nopadding nomargin">
               Send
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
