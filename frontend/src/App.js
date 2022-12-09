import { useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  EthereumClient,
  modalConnectors,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import * as IPFS from "ipfs-core";

import Home from "./components/home";
import Header from "./components/header";
import AllProposal from "./components/proposals";
import Proposal from "./components/proposal";
import ProposalForm from "./components/proposal-form";
import { store } from "./store/store";
import { SET_IPFS_CLIENT } from "./store/types";
import "./App.css";

export const celo_Alfajores = {
    id: 44787,
    name: 'Celo (Alfajores Testnet)',
    network: 'Celo (Alfajores Testnet)',
    nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
    },
    rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
    },
    blockExplorers: {
    etherscan: { name: 'BlockScout', url: 'https://alfajores-blockscout.celo-testnet.org' },
    default: { name: 'BlockScout', url: 'https://alfajores-blockscout.celo-testnet.org' },
    }
 }

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

const { chains, provider } =  configureChains(
  [goerli, celo_Alfajores],
  [
    infuraProvider({ apiKey: process.env.REACT_APP_GOERLI_INFURA_API, priority: 0 }),
    publicProvider({ priority: 1 }),
  ],
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

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
