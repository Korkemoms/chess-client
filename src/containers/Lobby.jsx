import Lobby from '../components/Lobby'
import { connect } from 'react-redux'
import { selectPlayer, challengePlayer, fetchUpdates, selectGame } from '../actions/Lobby'

const LobbyContainer = ((Target, namespace) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      fetchUpdates: (myFetch, updateIndex) => {
        dispatch(fetchUpdates(myFetch, updateIndex))
      },
      challengePlayer: (myFetch, me, player) => {
        dispatch(challengePlayer(myFetch, me, player))
      },
      selectPlayer: (player) => {
        dispatch(selectPlayer(player))
      },
      selectGame: (game, moves) => {
        dispatch(selectGame(game, moves))
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
