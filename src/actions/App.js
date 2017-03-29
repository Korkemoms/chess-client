import { types } from '../constants/ActionTypes'

export const appReceiveProps = (props) => {
  return {
    type: types.app.APP_RECEIVE_PROPS(),
    props: props
  }
}
