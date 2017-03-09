import Lobby from '../components/Lobby'
import { connect } from 'react-redux'
import { selectPlayer, challengePlayer, fetchUpdates, selectGame } from '../actions/Lobby'

const LobbyContainer = ((Target, namespace) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      fetchUpdates: (myFetch, updateIndex) => {
        let action = fetchUpdates(myFetch, updateIndex)
        dispatch(action)
      },
      challengePlayer: (myFetch, me, player) => {
        let action = challengePlayer(myFetch, me, player)
        dispatch(action)
      },
      selectPlayer: (player) => {
        let action = selectPlayer(player)
        dispatch(action)
      },
      selectGame: (game) => {
        let action = selectGame(game)
        dispatch(action)
      }
    }
  }

  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return Object.assign({}, localState)
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(Lobby, 'lobby')

export default LobbyContainer
