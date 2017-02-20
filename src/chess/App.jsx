import React from 'react'
import './App.scss'

import {Navbar, NavItem, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {version} from '../../package.json'

export default class App extends React.Component {

  constructor () {
    super()

    this.state = {
      loggedIn: false,
      player: null
    }
  }

  componentDidMount () {
    const _this = this
    const http = this.props.route.http
    let redirect = !http.loggedIn &&
      window.location.href.indexOf('/chess/activate-account/') === -1 &&
        window.location.href.indexOf('/chess/home') === -1

    if (redirect) {
      _this.props.router.push('/login')
    }

    http.onChange.push((loggedIn, player) => {
      _this.setState({
        loggedIn: loggedIn,
        player: player
      })
    })
  }

  render () {
    const navbarInstance = (

      <Navbar style={{margin: '0', borderRadius: '0', border: '0'}} inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='/'>Chess&#9816;</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>

            {this.state.loggedIn ?
              <LinkContainer to={{pathname: '/lobby/' + this.state.player.name}}>
                <NavItem role='navigation' eventKey={2}>Lobby</NavItem>
              </LinkContainer>
              : ''}

          </Nav>
          <Nav pullRight>

            {!this.state.loggedIn ?
              <LinkContainer to={{pathname: '/login'}}>
                <NavItem role='navigation' eventKey={2}>Log in</NavItem>
              </LinkContainer>
              :
              <LinkContainer to={{pathname: '/my-account/' + this.state.player.name}}>
                <NavItem role='navigation' eventKey={2}>My account</NavItem>
              </LinkContainer>}

          </Nav>
        </Navbar.Collapse>
      </Navbar>

    )

    let title = 'Chess'
    try {
      title = this.props.children.props.route.pageTitle
    } catch (e) {

    }

    return (

      <div className='App-root'>
        {navbarInstance}
        <div className='bs-docs-header Header'>
          <div className='container'>
            <div id='Title-container' className='Scroll-up-height Scroll-up-padding' >
              <h1>{title}</h1>
            </div>
          </div>
          <div className='Background-container' />
        </div>

        <div>
          {this.props.children}
        </div>
        <div id='Version-container'>{'Version ' + version}</div>
      </div>
    )
  }
}
