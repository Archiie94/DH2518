import R from 'ramda'
import React, { Component } from 'react'
import { Button, AlertDialog } from 'react-onsenui'
import './index.css'
import model from '../model'

export default class Chat extends Component {

  constructor(props) {
    super(props)
    this.notify = this.notify.bind(this)
    this.model = model
    this.sendMessage = this.sendMessage.bind(this)
    this.setName = this.setName.bind(this)
  }

  componentDidMount() {
    this.model.subscribe(this)
  }

  componentWillUnmount() {
    this.model.unsubscribe(this)
  }

  notify(updates) {
    // Merge in the updates from the model into our local state
    this.setState(R.merge(this.state, updates))
  }

  sendMessage() {
    const element = document.getElementById('chat-message')
    const message = element.value
    const { queueId } = this.props
    if (message) {
      this.model.sendMessage(queueId, message)
      element.value = ''
    } else {
      console.log('No message to send')
    }
  }

  setName() {
    const name = document.getElementById('name-field').value
    if (name) {
      this.model.setName(name)
    } else {
      console.log('Name too short')
    }
  }

  render() {
    const { queues } = this.model.getState()
    const queue = this.model.findById(this.props.queueId, queues)
    const messages = queue.messages || []
    if (this.model.hasSetName()) {
      return (
        <div className='chat'>
          <div className='chat__messages'>
            { messages.map(m => 
            <div className='message' key={m.id}>
              <span className='message--sender'>{m.name}:</span>
              <span className='message--text'>{m.message}</span>
            </div>
            )}
          </div>
          <div className="lockToBottom">
            <div className="left customSearch">
              <input id='chat-message'
                     onKeyPress={(e) => e.key === 'Enter' ? this.sendMessage() : null}
                     placeHolder='need help?'
                     type='search'
                     className='search-input helpbar width100' />
            </div>
            <div onClick={this.sendMessage} className='right customSearch list__blue nopadding nomargin'>
             Send
            </div>
          </div>
          <div className='name-input'>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <AlertDialog isOpen={this.props.isOpen} className='name-entry'>
            <p className='name-entry--title'>Enter your name to start chatting (limit 10 characters)</p>
            <div className='name-input'>
              <input id='name-field'
                onKeyPress={(e) => e.key === 'Enter' ? this.setName() : null}
                placeholder='Name'
                type='search'
                className='search-input helpbar width100'
                maxLength='10' />
              <div onClick={this.setName} className='right customSearch list__blue nopadding nomargin name-input--button'>
                Submit
              </div>
            </div>
          </AlertDialog>
        </div>
      )
    }
  }
}
