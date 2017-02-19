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

export default class NewAccount extends React.Component {

  constructor () {
    super()

    this.state = {
      usernameState: null,
      passwordState: null,
      confirmPasswordState: null,

      emailAddress: '',
      username: '',
      password: '',
      confirmedPassword: '',
      inputErrorText: '',
      isLoading: false
    }
  }

  validateEmail (email) {
    let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    return re.test(email)
  }

  componentWillUnmount () {
    if (this.newPlayerDeferred) {
      this.newPlayerDeferred.reject()
    }
    if (this.checkUsernameAndEmailDeferred) {
      this.checkUsernameAndEmailDeferred.reject()
    }
  }

  componentDidMount () {
    this.newAccountUsernameField.focus()
  }

  handleNewAccountSubmit (event) {
    const _this = this
    const http = _this.props.route.http
    event.preventDefault()

    // check for errors
    if (_this.state.username.length === 0) {
      _this.setState({
        inputErrorText: 'Username is required',
        usernameState: 'error'
      })
      return
    }

    if (_this.state.emailAddress.length === 0) {
      _this.setState({
        inputErrorText: 'Email is required',
        emailState: 'error'
      })
      return
    }

    if (!_this.validateEmail(_this.state.emailAddress)) {
      _this.setState({
        inputErrorText: 'Invalid email address',
        emailState: 'error'
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

    if (_this.state.password !== _this.state.confirmedPassword) {
      _this.setState({
        inputErrorText: 'Passwords don\'t match',
        passwordState: 'error',
        confirmedPasswordState: 'error'
      })
      return
    }

    let player = {
      name: _this.state.username,
      emailAddress: _this.state.emailAddress,
      password: _this.state.password
    }

    this.newPlayerDeferred = http.POST('players/new', player, this)
    this.newPlayerDeferred
    .fail(response => {
      this.checkIfUsernameOrEmailExists()
      throw new Error(response.statusText)
    })
    .then(response => http.POST('create-email-verification',
      {emailAddress: player.emailAddress}))
    .then(result =>
      _this.props.router.push('account-must-be-activated/' + _this.state.emailAddress))
  }

  checkIfUsernameOrEmailExists () {
    const _this = this
    const http = _this.props.route.http

    this.checkUsernameAndEmailDeferred = http.GET('players/name/' + _this.state.username, this)
    this.checkUsernameAndEmailDeferred
    .then(sameName => {
      if (sameName.length > 0) {
        _this.setState({inputErrorText: _this.state.inputErrorText + ' Username is taken.'})
      }
      return sameName.length
    })
    .then((count) => http.GET('players/email-address/' + _this.state.emailAddress)
      .then(emailAddresses => {
        if (emailAddresses.length > 0) {
          _this.setState({inputErrorText: _this.state.inputErrorText + ' Email address is taken.'})
        }
        return count + emailAddresses.length
      })
    )
  }

  handlePasswordChange (event) {
    this.setState({
      password: event.target.value,
      inputErrorText: '',
      passwordState: null
    })
  }

  handleConfirmPasswordChange (event) {
    this.setState({
      confirmedPassword: event.target.value,
      inputErrorText: '',
      confirmedPasswordState: null
    })
  }

  handleUsernameChange (event) {
    this.setState({
      username: event.target.value,
      inputErrorText: '',
      usernameState: null
    })
  }

  handleEmailChange (event) {
    this.setState({
      emailAddress: event.target.value,
      inputErrorText: '',
      emailState: null
    })
  }

  newAccountControls () {
    const _this = this

    return (
      <div>

        <FormGroup
          bsSize='large'
          controlId='newAccountUsernameGroup'
          validationState={_this.state.usernameState}>
          <ControlLabel>Username</ControlLabel>
          <FormControl
            name='newAccountUsernameField'
            type='text'
            ref={(inputField) => _this.newAccountUsernameField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handleUsernameChange(event)}
            value={_this.state.username}
            placeholder='Enter username'
            required
          />
        </FormGroup>

        <FormGroup
          bsSize='large'
          controlId='newAccountEmailGroup'
          validationState={_this.state.emailState}>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            name='newAccountEmailField'
            type='email'
            ref={(inputField) => _this.newAccountEmailField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handleEmailChange(event)}
            value={_this.state.emailAddress}
            placeholder='Enter email'
            required
          />
        </FormGroup>

        <FormGroup
          bsSize='large'
          controlId='newAccountPasswordGroup'
          validationState={_this.state.passwordState}>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            name='newAccountPasswordField'
            type='password'
            ref={(inputField) => _this.newAccountPasswordField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handlePasswordChange(event)}
            value={_this.state.password}
            placeholder='Enter password'
            required
          />
        </FormGroup>

        <FormGroup
          bsSize='large'
          controlId='newAccountPasswordGroup'
          validationState={_this.state.confirmPasswordState}>
          <ControlLabel>Confirm password</ControlLabel>
          <FormControl
            name='newAccountPasswordField'
            type='password'
            ref={(inputField) => _this.newAccountConfirmPasswordField = ReactDOM.findDOMNode(inputField)}
            onChange={(event) => _this.handleConfirmPasswordChange(event)}
            value={_this.state.confirmedPassword}
            placeholder='Enter password again'
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
            title='Create account'
            bsSize='large'
            bsStyle='primary'
            onClick={(event) => _this.handleNewAccountSubmit(event)}>
            Create account
          </Button>
        </Col>

        <Col style={{marginTop: '1em'}}
          className='Center'>
          <LinkContainer to={{pathname: '/login'}}>
            <Button bsStyle='link'>Log in</Button>
          </LinkContainer>
        </Col>
      </div>
    )
  }

  render () {
    return (
      <div id='Login'>
        <Grid>
          <Row>
            <Col className='Center'>
              <Well className='Content-box'>
                <Form>
                  {this.newAccountControls()}
                </Form>
              </Well>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
