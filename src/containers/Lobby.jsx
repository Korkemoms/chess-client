// @flow
import Lobby from '../components/Lobby'
import { connect } from 'react-redux'
import type { State } from '../reducers/Lobby'
import {
  selectPlayer,
  challengePlayer,
  fetchUpdates,
  selectGame,
  expandGame,
  selectTab
} from '../actions/Lobby'

const LobbyContainer = ((Target: Object, namespace: string) => {
  const mapStateToProps = (state): State => {
    const localState: State = namespace ? state[namespace] : state
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
