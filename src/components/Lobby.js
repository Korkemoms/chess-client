
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
  PanelGroup,
  ListGroup,
  ListGroupItem,
  Panel,
  PageHeader
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

    if (!loggedIn) {
      return <div><label>Log in to play against others</label></div>
    }

    let header =
      null

    let challengeButton =
      <Button disabled={this.props.selectedPlayerId === null}
        bsStyle='primary'
        onClick={() => this.props.challengePlayer(
      this.props.myFetch,
      {email: this.props.myEmail, name: this.props.myName},
      this.props.selectedPlayer)}>
        Challenge
      </Button>

    let playerTab =
      <Tab.Pane eventKey='players'>
        <PanelGroup activeKey={this.props.selectedPlayerId} accordion >
          {this.props.players.map((player, index) =>
            <Panel
              header={player.name}
              key={index}
              eventKey={player.id}
              onClick={() => this.props.selectPlayer(player)}>
              {challengeButton}
            </Panel>
          )}
        </PanelGroup>

      </Tab.Pane>

    let gamesTab =
      <Tab.Pane eventKey='my-games'>
        <PanelGroup activeKey={this.props.expandedGameId} accordion>
          {this.props.chessGames.map((chessGame, index) => {
            let showGameButton =
              <Button
                active={chessGame.id === this.props.selectedGameId}
                bsStyle='primary'
                onClick={() => {
                  let moves = chessGame.id in this.props.chessMoves ?
                  Object.values(this.props.chessMoves[chessGame.id]) : []
                  this.props.selectGame(chessGame, moves)
                }} >
                {this.props.myEmail === chessGame.challengerEmail
                      || this.props.myEmail === chessGame.opponentEmail
                      ? 'Show game' : 'Spectate'}
              </Button>

            return (<Panel
              header={`${chessGame.challengerName} vs ${chessGame.opponentName}`}
              key={index}
              eventKey={chessGame.id}
              onClick={() => this.props.expandGame(chessGame)}
                            >
              {showGameButton}
            </Panel>)
          }

        )}
        </PanelGroup>
      </Tab.Pane>

    let chatTab =
      <Tab.Pane eventKey='chat'>
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

    let tab =
      <Tab.Container
        defaultActiveKey={this.props.selectedTab}
        id='game-tab'
        onSelect={(tab) => { this.props.selectTab(tab) }}>
        <Row className='clearfix'>
          <Col sm={12}>
            <Nav bsStyle='pills' style={{marginBottom: '5px'}}>
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

    return (
      <div>
        {header}
        {tab}
      </div>
    )
  }
}


export default Lobby
