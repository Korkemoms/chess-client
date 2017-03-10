
import React, { PropTypes } from 'react'
import {
  Button,
  Tab,
  Row,
  Col,
  Nav,
  NavItem,
  FormControl,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'

let fetched = 0

class Lobby extends React.Component {

  componentWillMount () {
    let _this = this
    this.intervalId = setInterval(() => {
      let props = _this.props
      let loggedIn = props.myName !== null &&
        props.myEmail !== null &&
        props.myFetch !== null
      if (loggedIn) {
        props.fetchUpdates(props.myFetch, props.updateIndex)
      }
    }, 3000)
  }

  componentWillUpdate (nextProps) {
    if (this.once) {
      return
    }
    this.once = true

    let loggedIn = nextProps.myName !== null &&
      nextProps.myEmail !== null &&
      nextProps.myFetch !== null

    if (loggedIn) {
      this.props.fetchUpdates(nextProps.myFetch, nextProps.updateIndex)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.intervalId)
  }

  render () {
    let loggedIn = this.props.myName !== null &&
      this.props.myEmail !== null &&
      this.props.myFetch !== null

    let userInfo = loggedIn
    ? <div>
      <label>{'Username:'}</label>{' ' + this.props.myName}<br />
      <label>{'Email:'}</label>{' ' + this.props.myEmail}
    </div>
    : <div><label>Log in to play against others</label></div>

    let challengeButton = loggedIn
    ? <Form inline>
      <FormGroup controlId='formInlineName'>
        <Button disabled={this.props.selectedPlayerId === null}
          bsStyle='primary'
          onClick={() => this.props.challengePlayer(
            this.props.myFetch,
            {email: this.props.myEmail, name: this.props.myName},
            this.props.selectedPlayer)}>
        Challenge</Button>
      </FormGroup></Form>
    : null

    let playerTab = loggedIn
    ? <Tab.Pane eventKey='players'>
      <ListGroup>
        {this.props.players.map((player, index) => {
          let active = player.id === this.props.selectedPlayerId
          return <ListGroupItem
            header={active ? player.name : null}

            key={index}
            onClick={() => this.props.selectPlayer(player)}>
            {active ? null : player.name}
            {active ? challengeButton : null}

          </ListGroupItem>
        })}
      </ListGroup>

    </Tab.Pane>
    : null

    let gamesTab = loggedIn
    ? <Tab.Pane eventKey='my-games'>
      <ListGroup>

        {this.props.chessGames.map((chessGame, index) =>
          <ListGroupItem
            active={chessGame.id === this.props.selectedGameId}
            key={index}
            onClick={() => {
              let moves = chessGame.id in this.props.chessMoves ?
              Object.values(this.props.chessMoves[chessGame.id]) : []
              this.props.selectGame(chessGame, moves)
            }}>
            {`${chessGame.challengerName} vs ${chessGame.opponentName}`}
          </ListGroupItem>
        )}
      </ListGroup>
    </Tab.Pane>
    : null

    let chatTab = loggedIn
    ? <Tab.Pane eventKey='chat'>
      <ListGroup>
        <ListGroupItem>Chat message</ListGroupItem>
      </ListGroup>
      <Form inline>
        <FormGroup controlId='formInlineName'>
          <FormControl disabled type='text' placeholder='Jane Doe' />
          <Button disabled bsStyle='primary'>Send</Button>
        </FormGroup>
      </Form>
    </Tab.Pane>
    : null

    let tab = loggedIn
    ? <Tab.Container defaultActiveKey={loggedIn ? 'players' : 'unknown-tab'} id='game-tab'>
      <Row className='clearfix'>
        <Col sm={12}>
          <Nav bsStyle='pills'>
            <NavItem disabled={!loggedIn} eventKey='chat'>
                    Messages
                </NavItem>
            <NavItem disabled={!loggedIn} eventKey='players'>
                    Players
                </NavItem>
            <NavItem disabled={!loggedIn} eventKey='my-games'>
                    Games
                </NavItem>
          </Nav>
        </Col>
        <Col sm={12}>
          <Tab.Content animation>
            {playerTab}
            {gamesTab}
            {chatTab}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
            : null

    return (
      <div>
        {userInfo}
        {tab}
      </div>
    )
  }
}

Lobby.propTypes = {
  jwToken: PropTypes.string,
  selectedPlayerName: PropTypes.string,
  selectedPlayerEmail: PropTypes.string,
  updateIndex: PropTypes.number,
  selectPlayer: PropTypes.func,
  challengePlayer: PropTypes.func,
  myEmail: PropTypes.string,
  myName: PropTypes.string,
  myFetch: PropTypes.func,
  players: PropTypes.array,
  chessGames: PropTypes.array,
  fetchUpdates: PropTypes.func,
  selectedId: PropTypes.string
}

export default Lobby
