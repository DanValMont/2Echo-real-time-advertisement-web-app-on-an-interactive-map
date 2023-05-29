import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const MapStore = createContext();
const initialState = {
  createdPin: false,
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "CREATED_PIN":
      return { ...state, createdPin: action.payload };
    case "USER_LOGIN":
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
}

export function MapStoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <MapStore.Provider value={value}>{props.children}</MapStore.Provider>;
}
