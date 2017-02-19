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

export default class ErrorMessage extends React.Component {

  render () {
    return (
      <Grid>
        <Row>
          <Col className='Center'>
            <Well className='Shadow-box'>
              <p><b>{this.props.params.errorMessage}</b></p>
              <p>{this.props.params.additionalInfo}</p>
            </Well>
          </Col>
        </Row>
      </Grid>
    )
  }
}
