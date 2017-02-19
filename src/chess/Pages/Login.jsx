/**
 * Created by Andreas on 18.01.2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './Pages.scss'
import {
  Well,
  Form,
  Button,
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import fetch from 'react-native-cancelable-fetch'

export default class Login extends React.Component {

  constructor () {
    super()

    this.state = {
      usernameOrEmailState: null,
      passwordState: null,

      headline: 'Log in',
      loggedIn: false,
      usernameOrEmail: '',
      password: '',
      inputErrorText: '',
      isLoading: false
    }
  }

  componentWillUnmount () {
    fetch.abort(this)
  }

  componentDidMount () {
    this.logInUsernameOrEmailField.focus()
  }

  handleLoginSubmit (event) {
    const _this = this
    const http = _this.props.route.http
    event.preventDefault() // prevent reload

    // check for errors
    if (_this.state.usernameOrEmail.length === 0) {
      _this.setState({
        inputErrorText: 'Username or email is required',
        usernameOrEmailState: 'error'
      })
      return
    }

    if (_this.state.password.length === 0) {
      _this.setState({
        inputErrorText: 'Password is required',
        passwordState: 'error'
      })
      return
    }

    // check if password is correct
    this.promise = http.GET('players/is-password-correct/' +
      _this.state.usernameOrEmail + '/' + _this.state.password, this)
      .then(
        response => {
          if (response !== false) {
            // log in
            _this.setState({
              loggedIn: true,
              isLoading: false
            })
            let player = response[0]

            http.usernameOrEmail = _this.state.usernameOrEmail
            http.password = _this.state.password
            http.setLoggedIn(true, player)

            if (typeof (_this.props.onLogin) !== 'undefined') {
              _this.props.onLogin(player)
            }

            _this.props.router.push('/lobby/' + player.name)
          } else {
            _this.setState({
              inputErrorText: 'Wrong username, email or password'
            })
          }
        }
      )
      .catch(error => {
        // _this.props.router.push('/error/Could not log in./' + error);
      })
  }

  handleUsernameOrEmailChange (event) {
    this.setState({
      usernameOrEmail: event.target.value,
      inputErrorText: '',
      usernameOrEmailState: null
    })
  }

  handlePasswordChange (event) {
    this.setState({
      password: event.target.value,
      inputErrorText: '',
      passwordState: null
    })
  }

  logOut () {
    this.props.route.http.loggedIn = false
    this.props.router.push('/login')
  }

  logInControls () {
    const _this = this

    if (this.props.route.http.loggedIn) {
      return (
        <div>
          <p className='Center'><b>You are already logged in!</b></p>
          <p className='Center'>

            <Button
              title='Log in'
              bsSize='large'
              bsStyle='primary'
              onClick={() => this.logOut()}>
              Log out
            </Button>

          </p>
        </div>
      )
    }

    return (
      <div>
        <FormGroup bsSize='large'
          controlId='logInUsernameOrPasswordGroup'
          validationState={_this.state.usernameOrEmailState}>
          <ControlLabel>Username or email</ControlLabel>
          <FormControl
            name='logInUsernameOrPasswordField'
            type='text'
            ref={(inputField) => _this.logInUsernameOrEmailField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handleUsernameOrEmailChange(event)}
            value={_this.state.usernameOrEmail}
            placeholder='Enter username or email'
            required
          />
        </FormGroup>

        <FormGroup bsSize='large'
          controlId='logInPasswordGroup'
          validationState={_this.state.passwordState}>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            name='logInPasswordField'
            type='password'
            ref={(inputField) => _this.logInPasswordField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handlePasswordChange(event)}
            value={_this.state.password}
            placeholder='Enter password'
            required
          />
        </FormGroup>

        <FormGroup
          bsSize='large'
          controlId='errorDisplay'
          validationState='error'>
          <div style={{height: '2em'}} className='Center'>
            <ControlLabel >{this.state.inputErrorText}</ControlLabel>
          </div>
        </FormGroup>

        <Col className='Center'>

          <Button
            type='submit'
            disabled={_this.state.isLoading}
            title='Log in'
            bsSize='large'
            bsStyle='primary'
            onClick={(event) => _this.handleLoginSubmit(event)}>
            Log in
          </Button>
        </Col>
        <Col style={{marginTop: '1em'}}
          className='Center'>
          <LinkContainer to={{pathname: '/new-account'}}>
            <Button bsStyle='link'>New account</Button>
          </LinkContainer>
        </Col>
      </div>
    )
  }

  render () {
    return (

      <Grid>
        <Row>
          <Col className='Center'>
            <Well className='Shadow-box'>
              <Form>
                {this.logInControls()}
              </Form>
            </Well>
          </Col>
        </Row>
      </Grid>

    )
  }
}
