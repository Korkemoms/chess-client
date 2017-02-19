/**
 * Created by Andreas on 18.01.2017.
 */

import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './Pages.scss'
import {
  ListGroup,
  ListGroupItem,
  Grid,
  Row,
  Col,
  Panel,
  Tab,
  Well,
  ButtonGroup,
  Button
} from 'react-bootstrap'

import $ from 'jquery'

export default class Lobby extends React.Component {

  constructor () {
    super()

    this.state = {
      players: [],
      selectedOpponent: null,
      selectedChallenge: null,
      inChallenges: [],
      outChallenges: [],
      games: [],
      selectedGame: null,
      selectedPage: 'My games',
      multiplayerGame: null,
      extraButtonText: 'Select item',
      selectedListItem: '',
      selectedType: ''
    }

    this.shouldUpdate = true
  }

  shouldComponentUpdate (nextProps, nextState) {
    const should = this.shouldUpdate
    this.shouldUpdate = false

    return should
  }

  componentWillMount () {
    const _this = this
    this.timerId = window.setInterval(function () {
      _this.refreshPlayersDeferred = _this.refreshPlayers()
      _this.refreshChallengesDeferred = _this.refreshChallenges()
      _this.refreshGamesDeferred = _this.refreshGames()
    }, 5000)

    _this.refreshPlayersDeferred = _this.refreshPlayers()
    _this.refreshChallengesDeferred = _this.refreshChallenges()
    _this.refreshGamesDeferred = _this.refreshGames()
  }

  componentWillUnmount () {
    window.clearInterval(this.timerId)

    this.refreshPlayersDeferred.reject()
    this.refreshChallengesDeferred.reject()
    this.refreshGamesDeferred.reject()
  }

  refreshGames () {
    const _this = this
    const http = _this.props.route.http

    let deferred = http.GET('games/not-canceled/' + _this.props.params.username, this)
    deferred.then(result => {
      // check if change (only render on real change)
      if (result.length !== _this.state.games.length) {
        _this.shouldUpdate = true
      } else {
        for (let i = 0; i < result.length; i++) {
          if (JSON.stringify(result[i]) !== JSON.stringify(_this.state.games[i])) {
            _this.shouldUpdate = true
            break
          }
        }
      }

      _this.setState({
        games: result.slice()
      })
    })
    return deferred
  }

  refreshChallenges () {
    const _this = this
    const http = _this.props.route.http

    // incoming challenges
    let deferred = http.GET('challenges-not-denied/opponent-name/' + _this.props.params.username, this)
    deferred.then(result => {
      let shouldUpdate = false

      // check if change (only render on real change)
      if (result.length !== _this.state.inChallenges.length) {
        shouldUpdate = true
      } else {
        for (let i = 0; i < result.length; i++) {
          let challenge = result[i]
          let eq = JSON.stringify(challenge) === JSON.stringify(_this.state.inChallenges[i])

          if (!eq) {
            shouldUpdate = true
            break
          }
        }
      }
      if (shouldUpdate) {
        _this.shouldUpdate = true
        _this.setState({inChallenges: result.slice()})
      }
    })
    .then(() => {
      // outgoing challenges
      return http.GET('challenges/player-name/' + _this.props.params.username)
        .then(result => {
          let shouldUpdate = false

          // check if change (only render on real change)
          if (result.length !== _this.state.outChallenges.length) {
            shouldUpdate = true
          } else {
            for (let i = 0; i < result.length; i++) {
              let challenge = result[i]

              if (Number(challenge.accepted) === 1) {
                _this.opponentAcceptedChallenge(challenge)
              }

              let eq = JSON.stringify(result[i]) === JSON.stringify(_this.state.outChallenges[i])

              if (!eq) {
                shouldUpdate = true
                break
              }
            }
          }
          if (shouldUpdate) {
            _this.shouldUpdate = true
            _this.setState({outChallenges: result.slice()})
          }
        })
    })
    return deferred
  }

  refreshPlayers () {
    const _this = this
    const http = _this.props.route.http

    // players
    let deferred = http.GET('players', this)
    deferred.then(result => {
      let shouldUpdate = false

      // check if change (only render on real change)
      if (result.length !== _this.state.players.length) {
        shouldUpdate = true
      } else {
        for (let i = 0; i < result.length; i++) {
          let eq = JSON.stringify(result[i]) === JSON.stringify(_this.state.players[i])
          if (!eq) {
            shouldUpdate = true
            break
          }
        }
      }
      if (shouldUpdate) {
        _this.shouldUpdate = true
        _this.setState({players: result})
      }
    })
    return deferred
  }

  challengeSelectedPlayer () {
    const _this = this
    const http = _this.props.route.http

    let challenge = {
      playerName: this.props.params.username,
      opponentName: this.state.selectedOpponent.name
    }

    return http.POST('challenges', challenge)
      .then(() => this.refreshChallenges())
      .then(() => _this.clearType())
  }

  acceptSelectedChallenge () {
    const _this = this
    const http = _this.props.route.http

    let challenge = this.state.selectedChallenge

    // start new game
    const game = {
      player1Name: challenge.playerName,
      player2Name: challenge.opponentName,
      challengeId: challenge.id // unique to prevent multiple games from same challenge
    }

    return $.when(http.PUT('challenges/' + challenge.id + '/accept'),
    http.POST('games', game))

      .then(() => $.when(_this.refreshGames(), _this.refreshChallenges()))
      .then(() => _this.clearType())
  }

  cancelSelectedChallenge () {
    const _this = this
    const http = _this.props.route.http

    let challenge = this.state.selectedChallenge

    return http.DELETE('challenges/' + challenge.id)
      .then(() => _this.refreshChallenges())
      .then(() => _this.clearType())
  }

  denySelectedChallenge () {
    const _this = this
    const http = _this.props.route.http

    let challenge = this.state.selectedChallenge

    return http.PUT('challenges/deny/' + challenge.id)
      .then(() => _this.refreshChallenges())
      .then(() => _this.clearType())
  }

  showSelectedGame () {
    let router = this.props.router
    let gameId = this.state.selectedGame.id

    router.push('/chess-table/' + gameId)
  }

  clearType () {
    this.shouldUpdate = true
    this.setState({
      selectedType: ''
    })
  }

  leaveSelectedGame () {
    const _this = this
    const http = _this.props.route.http

    let gameId = this.state.selectedGame.id
    let username = this.props.params.username

    return http.PUT('games/cancel/' + gameId + '/' + username)
      .then(() => _this.refreshGames())
      .then(() => _this.clearType())
  }

  opponentAcceptedChallenge (challenge) {
    const _this = this
    const http = _this.props.route.http

    if (JSON.stringify(this.state.selectedListItem) === JSON.stringify(challenge)) {
      this.clearType()
    }

    return http.DELETE('challenges/' + challenge.id)
      .then(() => $.when(_this.refreshChallenges(), _this.refreshGames()))
  }

  renderGames (key, htmlList) {
    const _this = this

    this.state.games.forEach(function (game) {
      // some information
      let opponentName = game.player1Name === _this.props.params.username ? game.player2Name : game.player1Name
      let myName = _this.props.params.username
      let opponentCancelled = game.player1Name === opponentName && game.player1cancel
      opponentCancelled |= game.player2Name === opponentName && game.player2cancel
      let myTurn = game.lastMoveBy === opponentName
      myTurn |= game.player1Name === myName && game.lastMoveBy === null

      // determine style
      let style = {}
      if (opponentCancelled) {
        style.bsStyle = 'danger'
      } else if (myTurn) {
        style.bsStyle = 'success'
      }
      let active = _this.state.selectedListItem === JSON.stringify(game)

      // determine text
      let text = ''
      if (opponentCancelled) {
        text = 'Opponent left'
      } else if (myTurn) {
        text = 'Your turn'
      } else if (!myTurn) {
        if (opponentName[opponentName.length - 1].toLowerCase() === 's') {
          text = opponentName + '\' turn'
        } else {
          text = opponentName + '\'s turn'
        }
      }

      htmlList.push(
        <ListGroupItem key={key++}
          {...style}
          onClick={() => {
            _this.shouldUpdate = true
            _this.setState({
              selectedGame: game,
              selectedType: 'game',
              selectedListItem: JSON.stringify(game)
            })
          }}
          active={active}
          header={myName + ' vs ' + opponentName}>
          {text}
        </ListGroupItem>
      )
    })
    return key
  }

  renderPlayers (key, htmlList) {
    const _this = this

    // players
    for (let i = 0; i < this.state.players.length; i++) {
      const opponent = this.state.players[i]
      // if (opponent.name === this.props.params.username) continue

      let active = _this.state.selectedListItem === JSON.stringify(opponent)

      htmlList.push(
        <ListGroupItem key={key++}
          onClick={() => {
            _this.shouldUpdate = true
            _this.setState({
              selectedOpponent: opponent,
              selectedType: 'player',
              selectedListItem: JSON.stringify(opponent)
            })
          }}
          active={active}

        >{opponent.name}</ListGroupItem>
      )
    }

    return key
  }

  renderChallenges (key, htmlList) {
    const _this = this

    let challenges = this.state.inChallenges.slice().concat(this.state.outChallenges)
    for (let i = 0; i < challenges.length; i++) {
      // some info
      const challenge = challenges[i]
      const incomingChallenge = i < this.state.inChallenges.length

      if (incomingChallenge && challenge.accepted === '1') {
        continue
      }

      if (!incomingChallenge && challenge.opponentName === challenge.playerName) {
        continue
      }

      // determine style
      let active = JSON.stringify(challenge) === _this.state.selectedListItem
      let style = {}
      if (challenge.denied === '1') {
        style.bsStyle = 'danger'
      } else if (incomingChallenge) {
        style.bsStyle = 'success'
      }

      // determine text
      let text = incomingChallenge ?
        challenge.playerName + ' has challenged you' :
        'You have challenged ' + challenge.opponentName
      if (challenge.denied === '1' && !incomingChallenge) {
        text = challenge.opponentName + ' denied your challenge'
      }

      // determine type
      let type = incomingChallenge ? 'incomingChallenge' : 'outgoingChallenge'
      if (challenge.denied === '1') {
        type += '-denied'
      }

      // render
      let challengeItem =
        <ListGroupItem active={active}
          key={key++}
          {...style}
          onClick={() => {
            _this.shouldUpdate = true
            _this.setState({
              selectedChallenge: challenge,
              selectedType: type,
              selectedListItem: JSON.stringify(challenge)
            })
          }}>
          {text}
        </ListGroupItem>
      htmlList.push(challengeItem)
    }
    return key
  }

  renderButtons () {
    const _this = this
    let buttons = []
    let key = 0

    if (this.state.selectedType === 'player') {
      let button =
        <Button
          bsStyle='primary'
          key={key++}
          onClick={() => this.challengeSelectedPlayer()}>
          Challenge player
        </Button>
      buttons.push(button)
    }

    if (this.state.selectedType === 'outgoingChallenge') {
      let button =
        <Button
          bsStyle='danger'
          key={key++}
          onClick={() => this.cancelSelectedChallenge()}>
          Cancel challenge
        </Button>
      buttons.push(button)
    }

    if (this.state.selectedType === 'outgoingChallenge-denied') {
      let button =
        <Button
          bsStyle='danger'
          key={key++}
          onClick={() => this.cancelSelectedChallenge()}>
          Remove
        </Button>
      buttons.push(button)
    }

    if (this.state.selectedType === 'incomingChallenge') {
      let button =
        <Button
          bsStyle='primary'
          key={key++}
          onClick={() => this.acceptSelectedChallenge()}>
          Accept challenge
        </Button>
      buttons.push(button)

      button =
        <Button
          bsStyle='danger'
          key={key++}
          onClick={() => this.denySelectedChallenge()}>
          Deny challenge
        </Button>
      buttons.push(button)
    }

    if (this.state.selectedType === 'game') {
      let button =
        <Button
          bsStyle='primary'
          key={key++}
          onClick={() => this.showSelectedGame()}>
          Show game
        </Button>
      buttons.push(button)

      button =
        <Button
          bsStyle='danger'
          key={key++}
          onClick={() => this.leaveSelectedGame()}>
          Leave game
        </Button>
      buttons.push(button)
    }
    return buttons
  }

  render () {
    const _this = this

    // prepare list of players and challenges
    const htmlList = []
    let key = 0

    key = this.renderGames(key, htmlList)
    key = this.renderChallenges(key, htmlList)
    this.renderPlayers(key, htmlList)

    return (

      <Grid>
        <Row>
          <Col>
            <Tab.Container className='Lobby-container' id='tabs-with-dropdown' defaultActiveKey='first'>
              <Row className='clearfix'>
                <Col sm={12}>
                  <Well className='Shadow-box'>
                    <Panel className='Lobby-list'>
                      <Tab.Content animation>
                        <Tab.Pane className='' eventKey='first'>
                          <ListGroup className='List'>{htmlList}</ListGroup>
                        </Tab.Pane>
                      </Tab.Content>
                    </Panel>
                    <ButtonGroup>{this.renderButtons()}</ButtonGroup>
                  </Well>
                </Col>

              </Row>
            </Tab.Container>

          </Col>
        </Row>
      </Grid>

    )
  }
}
