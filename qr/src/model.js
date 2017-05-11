import R from 'ramda'
import * as firebase from 'firebase'

class DataManager {

  constructor() {
    this.createQueue = this.createQueue.bind(this);
    this.setPropInQueue = this.setPropInQueue.bind(this);

    const config = {
      apiKey: "AIzaSyChKntR2x01yHa_5KMkXOItmHWNEZVIHcs",
      authDomain: "queuer-ff37b.firebaseapp.com",
      databaseURL: "https://queuer-ff37b.firebaseio.com",
      projectId: "queuer-ff37b",
      storageBucket: "queuer-ff37b.appspot.com",
      messagingSenderId: "1020024845817"
    }
    this.subscribers = []
    this.state = {
      places: [],
      queues: [
        this.createQueue('Försäkringskassan', {lat: 59.347392, lng: 18.058927}, 'Roslagsgatan 23', 'Måndag-Fredag: 8-18'),
        this.createQueue('Polisen', {lat: 59.344329, lng: 18.056374}, 'Odengatan 48', 'Måndag-Torsdag: 11-18'),
        this.createQueue('SEB', {lat: 59.343224, lng: 18.059227},'Döbelnsgatan 63', 'Måndag-Fredag: 12-16'),
        this.createQueue('Arbetsförmedlingen', {lat: 59.342748, lng: 18.06295}, 'Kungstensgatan 15', 'Måndag-Fredag: 8-17'),
        this.createQueue('Vaccin Direkt', {lat: 59.338814, lng: 18.05721}, 'Tegnérgatan 37', 'Måndag-Söndag 8-20')
      ],
      mapMode: true,
      firebaseApp: firebase.initializeApp(config)
    }

    // Public API
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    const { firebaseApp } = this.state
    const storeRef = firebase.database().ref('places')
    const self = this
    storeRef.on('value', function(snapshot) {
      self.setState({ places: snapshot.val() })
    })
  }

  getState() { return this.state }

  setState(updates) {
    this.state = R.merge(this.state, updates)
    this.subscribers.forEach(sub => sub.notify(this.state))
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber)
  }

  unsubscribe(subscriber) {
    const index = R.indexOf(subscriber, this.subscribers)
    this.subscribers = R.remove(index, 1, this.subscribers)
  }

  toggleMapMode() {
    const { mapMode } = this.state
    this.setState({mapMode: !mapMode })
  }

  createQueue(id, coordinates, address, hours) {
    return {
      id: id,
      inQueue: false,
      address: address,
      coordinates: coordinates,
      hours: hours
    }
  }

  setPropInQueue(prop, value, queue) {
    const index = R.indexOf(queue, this.state.queues);
    const propLens = R.compose(R.lensIndex(index), R.lensProp(prop))
    return R.set(propLens, value, this.state.queues)
  }

  joinQueue(queue) {
    const updatedQueues = this.setPropInQueue('inQueue', true, queue)
    this.setState({queues: updatedQueues})
  }

  leaveQueue(queue) {
    const updatedQueues = this.setPropInQueue('inQueue', false, queue)
    this.setState({queues: updatedQueues})
  }

}

const model = new DataManager()
export default model
