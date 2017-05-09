import React from 'react'
import ReactDOM from 'react-dom'
import {Toolbar, Page, Button, Row, Col} from 'react-onsenui'
import './index.css'

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
      <Page renderToolbar={() => <CustomToolbar/>}>
        <div className="page-content">
          <div className="custom__header">Nearby Queues</div>

          <div className="list__blue" onClick={this.pushPage}>

            <div className="left">
              <p className="nomargin"><b>Försäkringskassan</b></p>
              <small>Roslagsgatan 29</small>
            </div>

            <div className="right">

              <div className="center inlineBlock">
                <ons-icon icon="ion-checkmark-circled" className="main__icon_size"></ons-icon><br />
                <small>Join</small>
              </div>

              <div className="center inlineBlock">
                <div className="main__circle">
                  <div className="main__circle_adjuster">
                    30
                  </div>
                </div>
                <small>Mins</small>
              </div>
            </div>

            <div className="clearBoth"></div>

          </div>
        </div>
      </Page>
    )
  }
}
