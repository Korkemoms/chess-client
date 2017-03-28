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
      let loggedIn = props.playerName !== null &&
        props.playerUid !== null && props.myFetch !== null
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
    // button to challenge selected player
    let challengeButton =
      <Button disabled={this.props.selectedPlayer === null}
        bsStyle='primary'
        onClick={() => this.props.challengePlayer(
          this.props.myFetch,
          {uid: this.props.playerUid, name: this.props.playerName},
          this.props.selectedPlayer)}>
            Challenge
      </Button>

    // prepare entries for dropdown button displaying my games vs selected player
    let myGamesVsSelectedOpponent = []
    if (this.props.selectedPlayer) {
      this.props.chessGames.forEach(game => {
        let p = this.props
        let sel = this.props.selectedPlayer

        let myGame = game.whitePlayerUid === p.playerUid ||
              game.blackPlayerUid === p.playerUid

        let selectedOpponentsGame =
              game.whitePlayerUid === sel.uid ||
              game.blackPlayerUid === sel.uid

        let selectedMyself = sel.uid === p.playerUid
        let vsItself = game.whitePlayerUid === game.blackPlayerUid

        let addGame = selectedMyself && vsItself && myGame
        addGame |= !selectedMyself && myGame && selectedOpponentsGame
        if (addGame) {
          myGamesVsSelectedOpponent.push(game)
        }
      })
    }

    // setup dropdown button for selecting any of my games vs selected player
    let myGamesVsSelectedOpponentButton = myGamesVsSelectedOpponent.length > 0
        ? <DropdownButton
          id={`games-vs-selected-player-dropdown`}
          bsStyle='success'
          title='Games'>
          {myGamesVsSelectedOpponent.map((game, index) => {
            let moves = game.id in this.props.chessMoves
            ? Object.values(this.props.chessMoves[game.id]) : []

            // there may be duplicate moves (with same move.number)
            // (for any move.number only the one with the lowest move.id is )
            // TODO I will remove duplicate moves soon
            let moveCount = moves.length > 0 ? moves[moves.length - 1].number : 0

            let imWhite = game.whitePlayerUid === this.props.playerUid
            let myTurn = (imWhite && moves % 2 === 0) ||
              (!imWhite && moves % 2 === 1)
            return (
              <MenuItem
                active={game.id === this.props.selectedGameId}
                key={index}
                onClick={() => { this.props.selectGame(game, moves) }}>
                <strong>{game.id + ': '}</strong>
                {moveCount + ' move' + (moves.length !== 1 ? 's' : '')}
                {myTurn ? ' (My turn)' : null}
              </MenuItem>
            )
          })}
        </DropdownButton>
        : null

    // dropdown button that does nothing, its just there to
    // look pretty during transitioning to another tab
    let myGamesVsPreviousSelectedOpponent = []
    if (this.props.previousSelectedPlayer) {
      this.props.chessGames.forEach(game => {
        let p = this.props
        let sel = this.props.previousSelectedPlayer

        let myGame = game.whitePlayerUid === p.playerUid ||
              game.blackPlayerUid === p.playerUid

        let selectedOpponentsGame =
              game.whitePlayerUid === sel.uid ||
              game.blackPlayerUid === sel.uid

        let selectedMyself = sel.uid === p.playerUid
        let vsItself = game.whitePlayerUid === game.blackPlayerUid

        let addGame = selectedMyself && vsItself && myGame
        addGame |= !selectedMyself && myGame && selectedOpponentsGame
        if (addGame) {
          myGamesVsPreviousSelectedOpponent.push(game)
        }
      })
    }
    let myGamesVsPreviouslySelectedOpponentButton =
      myGamesVsPreviousSelectedOpponent.length > 0
        ? <DropdownButton id={`games-vs-previously-selected-player-dropdown`}
          bsStyle='success' title='Games' />
        : null

    // prepare all player tabs
    return (
      <Tab.Pane eventKey='players'>
        <PanelGroup activeKey={this.props.selectedPlayer
            ? this.props.selectedPlayer.uid : null}
          accordion >
          {this.props.players.map((player, index) => {
            let boldPlayerName = this.props.player &&
              player.uid === this.props.playerUid
            let headerText = boldPlayerName
                ? <strong>{player.name}</strong>
                : player.name

            let gamesButton
            if (this.props.selectedPlayer &&
                this.props.selectedPlayer.uid === player.uid) {
              gamesButton = myGamesVsSelectedOpponentButton
            } else if (this.props.previousSelectedPlayer &&
              this.props.previousSelectedPlayer.uid === player.uid) {
              gamesButton = myGamesVsPreviouslySelectedOpponentButton
            }
            return (
              <Panel
                header={headerText}
                key={index}
                eventKey={player.uid}
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
    let panels = this.props.chessGames.map((chessGame, index) => {
      // prepare button
      let showGameButton =
        <Button
          active={this.props.selectedGame &&
            this.props.selectedGame.id === chessGame.id}
          bsStyle='primary'
          onClick={() => {
            let moves = chessGame.id in this.props.chessMoves
            ? Object.values(this.props.chessMoves[chessGame.id]) : []
            this.props.selectGame(chessGame, moves)
          }} >
          {this.props.playerUid === chessGame.whitePlayerUid ||
                this.props.playerUid === chessGame.blackPlayerUid
                    ? 'Show game' : 'Spectate'}
        </Button>

      // prepare text
      let boldChallengerName = chessGame.whitePlayerUid === this.props.playerUid
      let boldOpponentName = chessGame.blackPlayerUid === this.props.playerUid
      let challengerName = boldChallengerName
            ? <strong>{chessGame.whitePlayerName}</strong>
            : chessGame.whitePlayerName
      let opponentName = boldOpponentName
            ? <strong>{chessGame.blackPlayerName}</strong>
            : chessGame.blackPlayerName
      let headerText = <div>{challengerName}{' vs '}{opponentName}</div>

      // one panel for each game
      return (<Panel
        header={headerText}
        key={index}
        eventKey={chessGame.id}
        onClick={() => this.props.expandGame(chessGame)}>
        {showGameButton}
      </Panel>)
    })

    return (
      <Tab.Pane eventKey='games'>
        <PanelGroup activeKey={this.props.expandedGame
            ? this.props.expandedGame.id : null}
          accordion>
          {panels}
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
    let loggedIn = this.props.playerName !== null &&
      this.props.playerUid !== null &&
      this.props.myFetch !== null

    if (!loggedIn) {
      return <div style={{
        position: 'relative', marginBottom: '1em', zIndex: '10', textAlign: 'center'}}>
        <h3>You must log in to play</h3>
        <Button bsStyle='success' onClick={
            () => this.props.navigate('/login')}>Log in
          </Button>
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
