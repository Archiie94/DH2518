import React from 'react'
import ReactDOM from 'react-dom'
import {Toolbar, Page, Button, Row, Col} from 'react-onsenui'
import './index.css'

import SecondPage from './../SecondPage'
import CustomToolbar from './../CustomToolbar'
import DetailPage from './../DetailPage'

export default class MainPage extends React.Component {

  constructor(props) {
    super(props)
    this.pushPage = this.pushPage.bind(this)
  }

  pushPage() {
    console.log("pushing the page")
    this.props.navigator.pushPage({component: () => <DetailPage queue='HM'/>})
  }

  renderToolbar() {
    return (
      <Toolbar>
        <div className='center'>Navigator</div>
      </Toolbar>
    )
  }

  render() {
    return (
      <Page>
        <CustomToolbar></CustomToolbar>
        <div className="page-content">
          <div className="custom__header">Nearby Queues</div>
          <Row className='custom__row-header'>
            <Col width="40%">Store</Col>
            <Col>Place</Col>
            <Col class='center'>Address</Col>
            <Col></Col>
          </Row>

          <Row class="row-item" onClick={this.pushPage}>
            <Col width="40%">IKEA</Col>
            <Col>4</Col>
            <Col className="text-blue center"><ons-icon icon="ion-ios-location"></ons-icon></Col>
            <Col class="text-green text-right"><ons-icon icon="ion-plus-circled"></ons-icon></Col>
          </Row>
        </div>
      </Page>
    )
  }
}
