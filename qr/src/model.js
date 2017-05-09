import R from 'ramda'

class DataManager {

  constructor() {
    this.createQueue = this.createQueue.bind(this);
    this.setPropInQueue = this.setPropInQueue.bind(this);

    this.subscribers = []
    this.state = {
      queues: [
        this.createQueue('HM', {lat: 59.3336886, lng: 18.0725117}, 'Smålandsgatan 16'),
        this.createQueue('Systemet', {lat: 59.3332612, lng: 18.0663472}, 'Norrlandsgatan 3'),
        this.createQueue('Cool Q', {lat: -27.5693884, lng: 152.9251143},'u2/25 Valance St, Oxley QLD 4075'),
        this.createQueue('Hello Q hair', {lat: 24.0655611, lng: 120.695485}, '號, No. 18振興東街 Wufeng Dist'),
        this.createQueue('Goodbe', {lat: 59.3497173, lng: 18.105518}, 'Södra Hamnvägen 46')
      ],
      mapMode: true
    }

    // Public API
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  getState() { return this.state }

  setState(updates) {
    // Reduce over the current state with the new values
    const updatedState = R.toPairs(updates).reduce((acc, [key, val]) =>
      R.assoc(key, val, acc)
    , this.state)
    this.state = updatedState
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
    console.log('switching to map mode')
    const { mapMode } = this.state
    this.setState({mapMode: !mapMode })
  }

  createQueue(id, coordinates, address) {
    return {
      id: id,
      inQueue: false,
      address: address,
      coordinates: coordinates
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
