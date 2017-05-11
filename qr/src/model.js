import R from 'ramda'
import * as firebase from 'firebase'

class DataManager {

  constructor() {
    // Public API
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.findById = this.findById.bind(this);
    this.findIndexById = this.findIndexById.bind(this);

    // Setup user id
    const UUID_KEY = 'userId'
    if (!localStorage.getItem(UUID_KEY)) {
      // Generate a random user id and store it when the app is launched the first time
      // This id will be used on firebase. Techinically it should be globally unique,
      // but for our purposes this is good enough
      localStorage.setItem(UUID_KEY, Math.random() + "")
    }
    const uuid = localStorage.getItem(UUID_KEY)

    // Setup app state
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
        name: 'Jepz',
				userCoordinates: null
      },
      storeRef: firebase.database().ref('places'),
      queuesRef: firebase.database().ref('queues')
    }

    // Setup firebase
    const { firebaseApp } = this.state
    const self = this
    this.state.storeRef.on('value', snapshot => self.setState({ places: snapshot.val() }))
    this.state.queuesRef.on('value', snapshot => {
      const queues = snapshot.val().map(q =>
        // Get rid of the impostors!
        R.assoc('queue', q.queue.filter(p => p.id !== 'impostor'), q)
      )
      self.setState({ queues: queues })
    })
    
    // Setup Geolocation
    if (navigator.geolocation) {
			console.log('Attempting to get the user\'s location')
      const geoSuccess = (position) => {
        console.log('pos', position)
        const coords = position.coords
        const userCoordinates = { lat: coords.latitude, lng: coords.longitude }
        this.setState({user: R.assoc('userCoordinates', userCoordinates, this.state.user)})
      }
      const geoError = error => console.log('User denied location')
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
		} else {
			console.log('Geolocation not available')
		} 
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
    const queue = this.findById(id, this.state.queues)
    return queue
      ? !!this.findById(user.id, queue.queue)
      : false
  }

  findIndexById(id, arr) {
    return R.findIndex(R.propEq('id', id), R.filter(a => typeof a !== 'undefined', arr))
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

  joinQueue(id) {
    // TODO handle joining/leaving queue failure?
    const { queues, user } = this.state
    const self = this
    this.state.queuesRef.transaction(post => {
      if (post) {
        const index = self.findIndexById(id, post)
        if (index != -1) {
          post[index].queue.push(user)
        } else {
          // Create the queue if it does not exist
          const impostor = { id: 'impostor', name: 'not a real person' }
          post.push({ id: id, queue: [user, impostor] })
        }
      }
      return post
    })
  }

  leaveQueue(id) {
    // Leave queue on firebase
    const { user } = this.state
    this.state.queuesRef.transaction(post => {
      if (post) {
        const queueIndex = this.findIndexById(id, post)
        const userObj = this.findById(user.id, post[queueIndex].queue)
        const queue = post[queueIndex].queue
        post[queueIndex].queue = R.without([userObj], queue)
      }
      return post
    })
  }

}

const model = new DataManager()
export default model

