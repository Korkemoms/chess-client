/**
 * Created by Andreas on 18.01.2017.
 */

import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './Pages.scss'
import {
  Button,
  Well,
  Grid,
  Row,
  Col
} from 'react-bootstrap'

import {LinkContainer} from 'react-router-bootstrap'

export default class ActivateAccount extends React.Component {

  constructor () {
    super()

    this.state = {
      accountActivated: null
    }
  }

  componentWillUnmount () {
    this.deferred.reject()
  }

  componentDidMount () {
    const _this = this
    const http = _this.props.route.http

    // check that token and email is given
    let token = this.props.params.token
    let email = this.props.params.emailAddress

    let ok = typeof (email) === 'string'
      && email.length > 0
      && typeof (token) === 'string'
      && token.length > 0

    if (!ok) {
      let message = 'Could not activate account. Invalid email or token.'
      let additional = 'email: ' + email + '<br>token: ' + token

      this.props.router.push('/error/' + message + '/' + additional)
      return
    }

    // request activation
    this.deferred = http.PUT('email-verification/' + email + '/' + token, this)
    this.deferred.then(() => http.GET('players/email-address/' + email))
      .then(result => {
        let accountActivated = result.length > 0
          && result[0].emailAddress === email
          && result[0].emailVerified === '1'

        if (accountActivated) {
          _this.setState({accountActivated: accountActivated})
        } else {
          _this.props.router.push('/error/Could not activate account./' + JSON.stringify(result))
        }
      })
      .catch(error => {
        this.props.router.push('/error/Could not activate account./' + JSON.stringify(error))
      })
  }

  response () {
    if (this.state.accountActivated) {
      return (

        <Grid>
          <Row>
            <Col className='Center'>
              <Well>
                <p className='Center'><b>Your account was activated.</b></p>
                <p className='Center'><LinkContainer to={{pathname: '/login'}}>
                  <Button
                    title='Log in'
                    bsSize='large'
                    bsStyle='primary'>
                    Log in
                  </Button>
                </LinkContainer></p>
              </Well>
            </Col>
          </Row>
        </Grid>

      )
    } else {
      return (

        <Grid>
          <Row>
            <Col className='Center'>
              <Well className='Shadow-box'>
                And I don't know why
              </Well>
            </Col>
          </Row>
        </Grid>

      )
    }
  }

  render () {
    return (
      <div id='Login'>
        {this.response()}
      </div>
    )
  }
}
