import { createContext, useReducer } from "react";
import * as types from "./types";

const initialState = {
  ipfsClient: null,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case types.SET_IPFS_CLIENT:
        return {
          ...state,
          ipfsClient: action.payload,
        };

      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
