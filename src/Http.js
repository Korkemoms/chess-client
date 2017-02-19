/**
 * Created by Andreas on 28.01.2017.
 */

// import 'whatwg-fetch'
// import 'isomorphic-fetch'
import $ from 'jquery'

// import fetch from 'react-native-cancelable-fetch'

export default class Http {

  constructor () {
    let www = window.location.href.indexOf('www.') !== -1
    ? 'www.' : ''

    this.path = process.env.NODE_ENV === 'production'
    ? 'http://' + www + 'amodahl.no/chessapi/public/index.php/' : '/'

    this.usernameOrEmail = ''
    this.password = ''
    this.loggedIn = false
    this.onChange = []
    this.player = null
  }

  setLoggedIn (loggedIn, player) {
    let change = this.loggedIn !== loggedIn
    change |= JSON.stringify(player) !== JSON.stringify(this.player)

    this.loggedIn = loggedIn
    this.player = player

    if (change) {
      this.onChange.forEach(fun => {
        fun(loggedIn, player)
      })
    }
  }

  // make a http request and return a Deferred
  query (type, what, payload) {
    const _this = this

    let properties = {
      url: this.path + 'api/' + what,
      type: type,
      usernameOrEmail: _this.usernameOrEmail,
      password: _this.password
    }

    if (typeof (payload) !== 'undefined') {
      properties.data = JSON.stringify(payload)
    }

    return new $.Deferred((deferred) => {
      $.ajax(properties)
      .then((data, textStatus, jqXHR) => deferred.resolve(data, textStatus, jqXHR))
      .fail((data, textStatus, jqXHR) => deferred.reject(data, textStatus, jqXHR))
    })
  }

  GET (what) {
    return this.query('GET', what)
  }

  DELETE (what) {
    return this.query('DELETE', what)
  }

  POST (what, payload) {
    return this.query('POST', what, payload)
  }

  PUT (what) {
    return this.query('PUT', what)
  }
}
