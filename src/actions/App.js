// @flow
import type { Action } from './Types'
import { ActionTypes } from './Types'

export const appReceiveProps = (props: Object): Action => {
  return {
    type: ActionTypes.APP_RECEIVE_PROPS,
    payload: props
  }
}
