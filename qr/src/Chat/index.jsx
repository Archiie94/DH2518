import R from 'ramda'
import React, { Component } from 'react'
import './index.css'
import model from '../model'

import mqtt from 'mqtt'

var port = 8084;
var host_uri = 'vernemq.evothings.com';

var host = host_uri . port;
var client = mqtt.connect(host);

client.on('connect', function() {
    client.subscribe("haw");
});

var Message = React.createClass({
    render: function() {
        return (
            <div key={this.props.key} className="message">{this.props.message.payload}</div>
        );
    }
})

var MessageList = React.createClass({

    addMessage: function(message) {
        var updated = this.state.messages;
        updated.push(message);
        this.setState({messages: updated});
        console.log("AddedMSG");
    },

    getInitialState: function() {
        return { messages: [] };
    },

    componentDidMount: function() {
        var self = this;

        client.on('message', function(topic, payload, packet) {
            self.addMessage({
                key: Date.now(),
                topic: topic,
                payload: payload.toString()
            });
        });
    },

    render: function() {
      
        var messageNodes = this.state.messages.map(function(message) {
            console.log("Message nodes: " + message);
            return (
                <Message key={message.key} message={message} />
            );
        });

        return (
            <div id="messageList" className="table-block footer-push">
                <h4>Chatting with Arbetsförmedlingen</h4>
                <div className="messages">{messageNodes}</div>
            </div>
        );
    }
});

export default class Chat extends Component {

  constructor(props) {
    super(props)
    this.notify = this.notify.bind(this)
    this.model = model
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    var self = this;

    client.on('message', function(topic, payload, packet) {
        self.addMessage({
            key: Date.now(),
            topic: topic,
            payload: payload.toString()
        });
    });
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

    // Mesage found - now we need to add to MQTT.
    if (message) {
      console.log('Sending', message)
      client.publish('haw', element.value);
      element.value = ''
    }
  }

  send(event) {
      console.log("in send()");
      event && event.preventDefault();
      const element = document.getElementById('chat-message')
      const message = element.value

      if (message) {
        console.log('Sending', message)
        client.publish('haw', element.value);
        element.value = ''
      }
      
  }

  addMessage(message) {
    var updated = this.state.messages;
    updated.push(message);
    this.setState({messages: updated});
  }

  render() {
    return (
      <div className="chat">
        <div className="chat__messages">
          <div className="table-container">
            <MessageList />
          </div>
        </div>
        <div className="lockToBottom">
          <div className="left customSearch">
            <input id='chat-message'
              onKeyPress={(e) => e.key === 'Enter' ? this.send() : null}
              placeholder='Need help?'
              type='search'
              className='search-input helpbar width100' />
          </div>
          <div id="send" onClick={()=> this.send() } className="right customSearch list__blue nopadding nomargin">
           Send
          </div>
        </div>
      </div>
    );
  }
}
