
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
      this.props.fetchPlayers(this.props.myFetch)
    }
  }

  componentDidMount () {
    if (this.props.myFetch && this.props.myFetch !== null && fetched++ === 0) {
      this.props.fetchPlayers(this.props.myFetch)
    }
  }

  render () {
    return (
      <Tab.Container defaultActiveKey='players' id='game-tab'>
        <Row className='clearfix'>
          <Col sm={12}>
            <Nav bsStyle='pills'>
              <NavItem eventKey='chat'>
              Messages
            </NavItem>
              <NavItem eventKey='players'>
                Players
            </NavItem>
              <NavItem eventKey='my-games'>
                My games
            </NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey='players'>
                <ListGroup>

                  {this.props.players.map((player, index) =>
                    <ListGroupItem
                      active={player.email === this.props.selectedPlayerEmail}
                      key={index}
                      onClick={() => this.props.selectPlayer(player.email)}>
                      {player.name}
                    </ListGroupItem>
                    )}

                </ListGroup>
                <Form inline>
                  <FormGroup controlId='formInlineName'>
                    <Button disabled bsStyle='primary'>Do something</Button>
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

              <Tab.Pane eventKey='my-games'>
                <ListGroup>
                  <ListGroupItem>A game</ListGroupItem>
                </ListGroup>
                <Form inline>
                  <FormGroup controlId='formInlineName'>
                    <Button bsStyle='primary' disabled>Do something</Button>
                  </FormGroup>
                </Form>
              </Tab.Pane>

            </Tab.Content>

          </Col>

        </Row>
      </Tab.Container>

    )
  }
}

Lobby.propTypes = {
  jwToken: PropTypes.string,
  selectedPlayerEmail: PropTypes.string
}

export default Lobby
