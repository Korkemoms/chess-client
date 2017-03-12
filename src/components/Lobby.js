
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

let lastFetch = 0

class Lobby extends React.Component {

  componentWillMount () {
    let _this = this
    this.intervalId = setInterval(() => {
      let time = new Date().getTime()
      if (time - lastFetch < 3000) {
        return
      }

      let props = _this.props
      let loggedIn = props.myName !== null &&
        props.myEmail !== null && props.myFetch !== null
      if (!loggedIn) {
        return
      }

      lastFetch = time
      props.fetchUpdates(props.myFetch, props.updateIndex)
    }, 100)
  }

  componentWillUnmount () {
    clearTimeout(this.intervalId)
  }

  render () {
    let loggedIn = this.props.myName !== null &&
      this.props.myEmail !== null &&
      this.props.myFetch !== null

    if (!loggedIn) {
      return <div style={{textAlign: 'center'}}>
        <h3>You must log in to play</h3>
        <Button bsStyle='success' onClick={() => this.props.navigate('/login')}>Log in</Button>
      </div>
    }

    let header = null

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
          {this.props.players.map((player, index) => {
            let boldPlayerName = player.email === this.props.myEmail
            let headerText = boldPlayerName
            ? <strong>{player.name}</strong>
            : player.name
            return (
              <Panel
                header={headerText}
                key={index}
                eventKey={player.id}
                onClick={() => this.props.selectPlayer(player)}>
                {challengeButton}
              </Panel>
            )
          }
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

            let boldChallengerName = chessGame.challengerEmail === this.props.myEmail
            let boldOpponentName = chessGame.opponentEmail === this.props.myEmail

            let challengerName = boldChallengerName
              ? <strong>{chessGame.challengerName}</strong>
              : chessGame.challengerName

            let opponentName = boldOpponentName
              ? <strong>{chessGame.opponentName}</strong>
              : chessGame.opponentName

            let headerText = <div>{challengerName}{' vs '}{opponentName}</div>

            return (<Panel
              header={headerText}
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
