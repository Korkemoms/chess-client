import Lobby from '../components/Lobby'
import { connect } from 'react-redux'
import {
  selectPlayer,
  challengePlayer,
  fetchUpdates,
  selectGame,
  expandGame,
  selectTab
} from '../actions/Lobby'

const LobbyContainer = ((Target, namespace) => {
  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return Object.assign({}, localState)
  }

  const mapDispatchToProps = {
    selectPlayer,
    challengePlayer,
    fetchUpdates,
    selectGame,
    expandGame,
    selectTab
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(Lobby, 'lobby')

export default LobbyContainer
