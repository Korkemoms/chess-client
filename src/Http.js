
export default class Http {

  constructor () {
    let www = window.location.href.indexOf('www.') !== -1
    ? 'www.' : ''

    this.path = process.env.NODE_ENV === 'production'
    ? 'http://' + www + 'amodahl.no/chessapi/public/index.php/' : '/'
  }
}
