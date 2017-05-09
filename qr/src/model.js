import R from 'ramda'

class DataManager {

  constructor() {
    this.createQueue = this.createQueue.bind(this);
    this.setPropInQueue = this.setPropInQueue.bind(this);

    this.subscribers = []
    this.state = {
      queues: [
        this.createQueue('HM', {lat:0, lng: 0}, "Kungsgatan 5"),
        this.createQueue('Systemet', {lat:0, lng: 0}, "Kungsgatan 5"),
        this.createQueue('Cool Q', {lat:0, lng: 0},"Kungsgatan 5"),
        this.createQueue('Hello Q', {lat:0, lng: 0}, "Kungsgatan 6"),
        this.createQueue('Goodbe', {lat:0, lng: 0}, "Kungsgatan 5")
      ]
    }

    // Public API
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
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
    this.subscribers = R.remove(index, this.subscribers)
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
