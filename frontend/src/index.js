import React from "react";
import ReactDOM from "react-dom/client";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";

import App from "./App";
import { StateProvider } from "./store/store";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];
// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <WagmiConfig client={wagmiClient}>
      <StateProvider>
        <App />
      </StateProvider>
    </WagmiConfig>

    <Web3Modal projectId="" ethereumClient={ethereumClient} />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
