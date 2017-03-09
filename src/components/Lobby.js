
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

  componentDidUpdate () {
    if (this.props.myFetch && this.props.myFetch !== null && fetched++ === 0) {
      this.props.fetchUpdates(this.props.myFetch, this.props.updateIndex)
    }
  }

  componentDidMount () {
    if (this.props.myFetch && this.props.myFetch !== null && fetched++ === 0) {
      this.props.fetchUpdates(this.props.myFetch, this.props.updateIndex)
    }
    this.intervalId = setInterval(() => {
      this.props.fetchUpdates(this.props.myFetch, this.props.updateIndex)
    }, 3000)
  }

  componentWillUnmount () {
    clearTimeout(this.intervalId)
  }

  render () {
    return (
      <div>
        <label>{'Username:'}</label>{' ' + this.props.myName}<br />
        <label>{'Email:'}</label>{' ' + this.props.myEmail}
        <Tab.Container defaultActiveKey='players' id='game-tab'>
          <Row className='clearfix'>
            <Col sm={12}>
              <Nav bsStyle='pills'>
                <NavItem disabled eventKey='chat'>
                Messages
            </NavItem>
                <NavItem eventKey='players'>
                Players
            </NavItem>
                <NavItem eventKey='my-games'>
                Games
            </NavItem>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey='players'>
                  <ListGroup>

                    {this.props.players.map((player, index) =>
                      <ListGroupItem
                        active={player.id === this.props.selectedPlayerId}
                        key={index}
                        onClick={() => this.props.selectPlayer(player)}>
                        {player.name}
                      </ListGroupItem>
                    )}

                  </ListGroup>
                  <Form inline>
                    <FormGroup controlId='formInlineName'>
                      <Button disabled={this.props.selectedPlayerId === null}
                        bsStyle='primary'
                        onClick={() => this.props.challengePlayer(
                          this.props.myFetch,
                          {email: this.props.myEmail, name: this.props.myName},
                          this.props.selectedPlayer)}>
                      Challenge</Button>
                    </FormGroup>
                  </Form>
                </Tab.Pane>

                <Tab.Pane eventKey='my-games'>
                  <ListGroup>

                    {this.props.chessGames.map((chessGame, index) =>
                      <ListGroupItem
                        active={chessGame.id === this.props.selectedGameId}
                        key={index}
                        onClick={() => this.props.selectGame(chessGame)}>
                        {`${chessGame.challengerName} vs ${chessGame.opponentName}`}
                      </ListGroupItem>
                    )}

                  </ListGroup>
                  <Form inline>
                    <FormGroup controlId='formInlineName'>
                      <Button bsStyle='primary'
                        disabled={this.props.selectedGameId === null}>
                        Do something</Button>
                    </FormGroup>

                  </Form>
                </Tab.Pane>

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
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
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
  players: PropTypes.array,
  chessGames: PropTypes.array,
  fetchUpdates: PropTypes.func,
  selectedId: PropTypes.string
}

export default Lobby
