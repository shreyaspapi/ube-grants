import { useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import * as IPFS from "ipfs-core";

import Home from "./components/home";
import Header from "./components/header";
import AllProposal from "./components/proposals";
import Proposal from "./components/proposal";
import ProposalForm from "./components/proposal-form";
import { store } from "./store/store";
import { SET_IPFS_CLIENT } from "./store/types";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AllProposal />,
  },
  {
    path: "/proposal",
    element: <Proposal />,
  },
  {
    path: "/submit-new-proposal",
    element: <ProposalForm />,
  },
]);

function App() {
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const { ipfsClient } = globalState.state;

  useEffect(() => {
    async function createIpfs() {
      const ipfs = await IPFS.create();
      dispatch({ type: SET_IPFS_CLIENT, payload: ipfs });
    }

    if (!ipfsClient) {
      console.log("IPFS client not found, creating new one...");
      createIpfs();
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
