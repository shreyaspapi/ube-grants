import { useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Web3Modal } from "@web3modal/react";
import { WagmiConfig } from "wagmi";
import * as IPFS from "ipfs-core";

import Home from "./components/home";
import Header from "./components/header";
import AllProposal from "./components/proposals";
import Proposal from "./components/proposal";
import ProposalForm from "./components/proposal-form";
import { store } from "./store/store";
import { SET_IPFS_CLIENT } from "./store/types";
import { wagmiClient, ethereumClient } from "./wallet";
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
      try {
        const ipfs = await IPFS.create();
        dispatch({ type: SET_IPFS_CLIENT, payload: ipfs });
      } catch (error) {
        console.log(
          "Error creating IPFS client: Client already exists ",
          error
        );
      }
    }

    if (!ipfsClient) {
      console.log("IPFS client not found, creating new one...");
      createIpfs();
    }
  }, []);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <div className="App">
          <Header />
          <RouterProvider router={router} />
        </div>
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.REACT_APP_WALLETCONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
