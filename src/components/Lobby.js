
import React from 'react'
import {
  Button,
  ButtonToolbar,
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
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

let lastFetch = 0

class Lobby extends React.Component {

  componentWillMount () {
    // periodically fetch updates
    let _this = this
    this.intervalId = setInterval(() => {
      let time = new Date().getTime()
      if (time - lastFetch < 6000) {
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

  playerTab () {
    let challengeButton =
      <Button disabled={this.props.selectedPlayerId === null}
        bsStyle='primary'
        onClick={() => this.props.challengePlayer(
          this.props.myFetch,
          {email: this.props.myEmail, name: this.props.myName},
          this.props.selectedPlayer)}>
            Challenge
      </Button>

    let myGamesVsSelectedOpponent = []
    if (this.props.selectedPlayer) {
      this.props.chessGames.forEach(game => {
        let myGame = game.challengerEmail === this.props.myEmail ||
              game.opponentEmail === this.props.myEmail
        let selectedOpponentsGame = game.challengerEmail === this.props.selectedPlayer.email ||
              game.opponentEmail === this.props.selectedPlayer.email

        let selectedMyself = this.props.selectedPlayer.email === this.props.myEmail
        let meVsMyself = game.challengerEmail === game.opponentEmail

        let addGame = selectedMyself && meVsMyself
        addGame |= !selectedMyself && myGame && selectedOpponentsGame

        if (addGame) {
          myGamesVsSelectedOpponent.push(game)
        }
      })
    }

    let myGamesVsPreviousSelectedOpponent = []
    if (this.props.previousSelectedPlayer) {
      this.props.chessGames.forEach(game => {
        let myGame = game.challengerEmail === this.props.myEmail ||
                      game.opponentEmail === this.props.myEmail

        let previouslySelectedOpponentsGame = game.challengerEmail === this.props.previousSelectedPlayer.email ||
                      game.opponentEmail === this.props.previousSelectedPlayer.email

        if (myGame && previouslySelectedOpponentsGame) {
          myGamesVsPreviousSelectedOpponent.push(game)
        }
      })
    }

    let myGamesVsSelectedOpponentButton = myGamesVsSelectedOpponent.length > 0
        ? <DropdownButton id={`games-vs-selected-player-dropdown`}
          bsStyle='success' title='Games'>
          {myGamesVsSelectedOpponent.map((game, index) => {
            let moves = game.id in this.props.chessMoves ?
            Object.values(this.props.chessMoves[game.id]) : []

            let imWhite = game.challengerEmail === this.props.myEmail
            let myTurn = imWhite && moves % 2 === 0

            return (
              <MenuItem
                active={game.id === this.props.selectedGameId}
                key={index}
                onClick={() => { this.props.selectGame(game, moves) }}>
                <strong>{game.id + ': '}</strong>
                {moves.length + ' move' + (moves.length !== 1 ? 's' : '')}
                {myTurn ? ' (My turn)' : null}
              </MenuItem>
            )
          })}
        </DropdownButton>
        : null

    // this button is only added so it doesnt look
    // like a button just disappears when transitioning
    // to another pane
    let myGamesVsPreviouslySelectedOpponentButton = myGamesVsPreviousSelectedOpponent.length > 0
        ? <DropdownButton id={`games-vs-previously-selected-player-dropdown`}
          bsStyle='success' title='Games' />
        : null

    return (
      <Tab.Pane eventKey='players'>
        <PanelGroup activeKey={this.props.selectedPlayerId} accordion >
          {this.props.players.map((player, index) => {
            let boldPlayerName = player.email === this.props.myEmail
            let headerText = boldPlayerName
                ? <strong>{player.name}</strong>
                : player.name

            let gamesButton
            if (player.id === this.props.selectedPlayerId) {
              gamesButton = myGamesVsSelectedOpponentButton
            } else if (player.id === this.props.previousSelectedPlayerId) {
              gamesButton = myGamesVsPreviouslySelectedOpponentButton
            }
            return (
              <Panel
                header={headerText}
                key={index}
                eventKey={player.id}
                onClick={() => this.props.selectPlayer(player)}>
                <ButtonToolbar>
                  {challengeButton}
                  {gamesButton}
                </ButtonToolbar>
              </Panel>
            )
          }
              )}
        </PanelGroup>
      </Tab.Pane>
    )
  }

  gamesTab () {
    return (
      <Tab.Pane eventKey='games'>
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
                {this.props.myEmail === chessGame.challengerEmail ||
                      this.props.myEmail === chessGame.opponentEmail
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
              onClick={() => this.props.expandGame(chessGame)}>
              {showGameButton}
            </Panel>)
          }

            )}
        </PanelGroup>
      </Tab.Pane>)
  }

  chatTab () {
    return (
      <Tab.Pane eventKey='chat'>
        <ListGroup>
          <ListGroupItem>Chat message</ListGroupItem>
        </ListGroup>
        <Form inline>
          <FormGroup style={{marginBottom: '1em'}}controlId='formInlineName'>
            <FormControl disabled type='text' placeholder='Message' />
            <Button disabled bsStyle='primary'>Send</Button>
          </FormGroup>
        </Form>
      </Tab.Pane>
    )
  }

  render () {
    let loggedIn = this.props.myName !== null &&
      this.props.myEmail !== null &&
      this.props.myFetch !== null

    if (!loggedIn) {
      return <div style={{ position: 'relative', zIndex: '10', textAlign: 'center'}}>
        <h3>You must log in to play</h3>
        <Button bsStyle='success' onClick={() => this.props.navigate('/login')}>Log in</Button>
      </div>
    }

    let playerTab = this.props.selectedTab === 'players'
      ? this.playerTab() : null

    let gamesTab = this.props.selectedTab === 'games'
      ? this.gamesTab() : null

    let chatTab = this.props.selectedTab === 'chat'
      ? this.chatTab() : null

    return (
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
              <NavItem disabled={!loggedIn} eventKey='games'>
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
    )
  }
}

export default Lobby
