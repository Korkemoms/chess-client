import Lobby from '../components/Lobby'
import { connect } from 'react-redux'
import { fetchPlayers, selectPlayer } from '../actions/Lobby'

const LobbyContainer = ((Target, namespace) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      fetchPlayers: (myFetch) => {
        let action = fetchPlayers(myFetch)
        dispatch(action)
      },
      selectPlayer: (playerEmail) => {
        let action = selectPlayer(playerEmail)
        dispatch(action)
      }
    }
  }

  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return {
      players: localState.players,
      selectedPlayerEmail: localState.selectedPlayerEmail
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(Lobby, 'lobby')

export default LobbyContainer
