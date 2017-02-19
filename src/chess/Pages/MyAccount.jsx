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

export default class MyAccount extends React.Component {

  render () {
    const _this = this

    return (

      <Grid>

        <Row>
          <Col className='Center'>
            <Well className='Shadow-box'>
              <p>Nothing here yet</p>
            </Well>
          </Col>
        </Row>

      </Grid>

    )
  }
}
