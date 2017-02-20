/**
 * Created by Andreas on 18.01.2017.
 */

import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './Pages.scss'
import {
  Well,
  Grid,
  Row,
  Col,
  PageHeader,
  Jumbotron,
  Button,
  ButtonToolbar,
  ListGroup,
  ListGroupItem

} from 'react-bootstrap'

export default class Home extends React.Component {

  componentDidMount () {
    document.getElementById('Title-container').className += ' Hide-height'
    document.getElementById('Version-container').className += ' Hide-height'
  }

  render () {
    const _this = this
    console.log(_this.props)

    return (
      <div style={{background: 'white'}}>
        <Grid>
          <Row>
            <Col>
              <Jumbotron style={{background: 'white'}}>
                <h1>Chess&#9816;</h1>
                <p>
                  I am making this game to learn more about exciting
                  web technologies. Try it out! 😀</p>
                <p>
                  <ButtonToolbar>
                    <Button bsStyle='primary' onClick={() => {
                      window.location.href = 'http://amodahl.no/chess/lobby'
                    }}>Play</Button>
                    <Button bsStyle='primary'>Read more</Button>
                  </ButtonToolbar>
                </p>
              </Jumbotron>
              <PageHeader>Front-end <small>technologies I use in this project</small></PageHeader>
              <p>
                I used create-react-app as boilerplate, it comes with loads of
                useful features that helped me get started. 
              </p>
              <ListGroup>
                <ListGroupItem header='React'>It makes it easy to build reusable javascript UI components</ListGroupItem>
                <ListGroupItem header='Bundler (Webpack)'>Turn a complicated project into static js and css for deployment</ListGroupItem>
                <ListGroupItem header='NPM'>Makes it extremely easy to find and add new libraries to a project</ListGroupItem>
                <ListGroupItem header='react-router'>Keeps the URL in sync with the UI</ListGroupItem>
                <ListGroupItem header='ES6 (babel)'>I like modules and arrow functions</ListGroupItem>
                <ListGroupItem header='Bootstrap (react-bootstrap)'>Because i want things to look good</ListGroupItem>
                <ListGroupItem header='CSS preprocessor (Sass)'>More flexible css</ListGroupItem>

              </ListGroup>

            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
