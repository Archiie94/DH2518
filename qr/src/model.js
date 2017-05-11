import R from 'ramda'
import * as firebase from 'firebase'

class DataManager {

  constructor() {
    this.createQueue = this.createQueue.bind(this);
    this.setPropInQueue = this.setPropInQueue.bind(this);

    const UUID_KEY = 'userId'
    if (!localStorage.getItem(UUID_KEY)) {
      localStorage.setItem(UUID_KEY, Math.random() + "")
    }
    const uuid = localStorage.getItem(UUID_KEY)

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
      queues: [],
      mapMode: true,
      firebaseApp: firebase.initializeApp(config),
      user: {
        id: uuid,
        name: 'Jepz'
      },
      storeRef: firebase.database().ref('places'),
      queuesRef: firebase.database().ref('queues')
    }

    // Public API
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.findById = this.findById.bind(this);

    const { firebaseApp } = this.state
    const self = this
    this.state.storeRef.on('value', snapshot => self.setState({ places: snapshot.val() }))
    this.state.queuesRef.on('value', snapshot => self.setState({ queues: snapshot.val() }))
  }

  getState() { return this.state }

  setState(updates) {
    this.state = R.merge(this.state, updates)
    this.subscribers.forEach(sub => sub.notify(this.state))
    console.log('new state')
    console.log(this.state)
  }

  isInQueue(id) {
    const { user } = this.state
    const queue = R.find(R.propEq('id', id), this.state.queues)
    console.log(queue)
    return queue 
      ? this.findById(user.id, queue.queue)
      : false
  }

  findById(id, arr) {
    return R.find(R.propEq('id', id), R.filter(a => typeof a !== 'undefined', arr))
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

  setPropInQueue(prop, value, id) {
    const index = R.indexOf(this.findById(id, this.state.queues), this.state.queues)
    console.log('1')
    if (index == -1) {
      console.log('2')
      return this.state.queues.concat({id: id, queue: value})
    } else {
      console.log('3')
      const propLens = R.compose(R.lensIndex(index), R.lensProp(prop))
      console.log(this.state.queues)
      console.log(index)
      console.log(R.view(R.lensIndex(index), this.state.queues))
      console.log(R.view(propLens,this.state.queues))
      return R.set(propLens, value, this.state.queues)
    }
  }

  joinQueue(id) {
    const { queues, user } = this.state
    const currentQueue = this.findById(id, queues) || { id: id, queue: [] }
    console.log('cuur')
    console.log(currentQueue)
    const updatedQueues = this.setPropInQueue('queue', currentQueue.queue.concat([user]), id)
    console.log('12')
    // this.setState({queues: updatedQueues})
    console.log('13')
    // Update the value on firebase
    const impostor = { id: 'impostor', name: 'not a real person' }
    const index = R.indexOf(this.findById(id, queues), queues)
    console.log('14')
    this.state.queuesRef.transaction(post => {
    console.log('15')
      if (post) {
        if (index != -1) {
          console.log('2nd')
          console.log(post[index])
          post[index].queue.push(user)
        } else {
          // Create the queue if it does not exist
          post.push({ id: id, queue: [user, impostor] })
        }
      }
      return post
    })
  }

  leaveQueue(id) {
    const { queues, user } = this.state
    // const currentQueue = this.findById(id, queues) || { id: id, queue: [] }
    // console.log('current queue')
    // console.log(currentQueue)
    // const updatedQueues = this.setPropInQueue('queue', R.without([user], currentQueue.queue), id)
    // console.log(updatedQueues)
    // this.setState({queues: updatedQueues})
    // Update the value on firebase
    console.log('leaving')
    console.log(id)
    const index = R.indexOf(this.findById(id, queues), queues)
    const userIndex = R.indexOf(this.findById(user.id, queues[index].queue), queues[index].queue)
    this.state.queuesRef.transaction(post => {
      if (post) {
        console.log(queues[index])
        console.log(userIndex)
        console.log(index)
        delete post[index].queue[userIndex]
      }
      return post
    })
  }

}

const model = new DataManager()
export default model
