
import React from 'react'
import { render } from 'react-dom'
import ChessGame from './containers/ChessGame'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers/ChessGame'

const store = createStore(
  reducer
)

render(
  <Provider store={store}>

    <ChessGame myColor='White'
      playerName='Player1'
      opponentName='Player2'
      gameId={-1} />
  </Provider>,

    document.getElementById('reactRoot')
  )
