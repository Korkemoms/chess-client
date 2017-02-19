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
  Col
} from 'react-bootstrap'

export default class AccountMustBeActivated extends React.Component {

  render () {
    return (
      <Grid>
        <Row>
          <Col className='Center'>
            <Well className='Shadow-box'>
              <p><b>
                {
                    'An email was sent to ' + this.props.params.emailAddress
                    + '. Follow the link in the email to activate your account.'
                  }
              </b></p>
            </Well>
          </Col>
        </Row>
      </Grid>
    )
  }
}
