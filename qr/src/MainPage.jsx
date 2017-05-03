import React from 'react'
import ReactDOM from 'react-dom'
import {Toolbar, Page, Button, Row} from 'react-onsenui'

import SecondPage from './SecondPage'
import CustomToolbar from './CustomToolbar'
import DetailPage from './DetailPage'

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
        // <p style={{textAlign: 'center'}}>
        //   <Button onClick={this.pushPage.bind(this)}>Push page</Button>
        // </p>
    return (
      <Page>
        <CustomToolbar></CustomToolbar>
        <div className="page-content">
          <div className="custom__header">Nearby Queues</div>
          <Row className='custom__row-header'>
            <ons-col width="40%">Store</ons-col>
            <ons-col>Place</ons-col>
            <ons-col class='center'>Address</ons-col>
            <ons-col></ons-col>
          </Row>

          <Row class="row-item" onClick={this.pushPage}>
            <ons-col width="40%">IKEA</ons-col>
            <ons-col>4</ons-col>
            <ons-col className="text-blue center"><ons-icon icon="ion-ios-location"></ons-icon></ons-col>
            <ons-col class="text-green text-right"><ons-icon icon="ion-plus-circled"></ons-icon></ons-col>
          </Row>
        </div>
      </Page>
    )
  }
}
