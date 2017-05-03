import React from 'react'

export default class CustomToolbar extends React.PureComponent {
  render() {
    return (
      <ons-toolbar>
        <div className="left animate">
          <ons-toolbar-button>
            <ons-back-button>
              Back
            </ons-back-button>
          </ons-toolbar-button>
        </div>
        <div className="center">QueueR</div>
        <div className="right animate">
          <ons-toolbar-button>
            <ons-icon icon="ion-navicon" className="header-icon"/>
          </ons-toolbar-button>
        </div>
      </ons-toolbar>
    )
  }
}
