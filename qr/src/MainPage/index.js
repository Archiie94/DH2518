import React from 'react'
import ReactDOM from 'react-dom'
import {Toolbar, Page, Button, Row, Col, Icon} from 'react-onsenui'
import './index.css'
import model from '../model'

import CustomToolbar from './../CustomToolbar'
import DetailPage from './../DetailPage'

export default class MainPage extends React.Component {

  constructor(props) {
    super(props)
    this.pushPage = this.pushPage.bind(this)
    this.notify = this.notify.bind(this)
    this.toggleJoinQueue = this.toggleJoinQueue.bind(this)
    this.model = model
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

  toggleJoinQueue(queue) {
    console.log(queue)
    if (queue.inQueue) {
      this.model.leaveQueue(queue)
    } else {
      this.model.joinQueue(queue)
    }
  }

  pushPage(queue) {
    console.log("pushing the page")
    this.props.navigator.pushPage({component: () => <DetailPage queue={queue}/>})
  }

  renderToolbar() {
    return (
      <Toolbar>
        <div className='center'>Navigator</div>
      </Toolbar>
    )
  }

  render() {
    const { queues } = this.model.getState()
    const renderQueue = (queue) => (
<<<<<<< HEAD
      <div key={queue.id}
           className="list__blue">

        <div className="left">
          <p className="nomargin"><b>{queue.id}</b></p>
          <small>{queue.address}</small>
        </div>

        <div className="right">

          <div className="center inlineBlock">
            <Icon icon={queue.inQueue ? 'ion-close-circled' : 'ion-checkmark-circled'}
                      className={ 'main__icon_size ' + (queue.inQueue ? 'text-red' : '')}>
            </Icon>
            <br />
            <small onClick={() => this.toggleJoinQueue(queue)}>
              { queue.inQueue
                  ? "Leave"
                  : "Join"
              }
            </small>
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
=======
      <Row class="row-item" onClick={() => this.pushPage(queue)} key={queue.id}>
        <Col width="40%">{queue.id}, {"" + queue.inQueue} {queue.coordinates.lat}</Col>
        <Col>4</Col>
        <Col className="text-blue center">
          <ons-icon icon="ion-ios-location"></ons-icon>
        </Col>
        <Col class="text-green text-right">
          <ons-icon icon="ion-plus-circled"
                    onClick={() => this.model.joinQueue(queue)}></ons-icon>
         </Col>
      </Row>
>>>>>>> Unsubscribing fixed
    )
    return (
      <Page renderToolbar={() => <CustomToolbar/>}>
        <div className="page-content">
          <div className="custom__header">Nearby Queues</div>
          <Row className='custom__row-header'>
            <Col width="40%">Store</Col>
            <Col>Place</Col>
            <Col class='center'>Address</Col>
            <Col></Col>
          </Row>
          { queues.map(renderQueue) }
        </div>
      </Page>
    )
  }
}
