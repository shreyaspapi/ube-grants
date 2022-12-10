import { EthereumClient, modalConnectors } from "@web3modal/ethereum";
import { createClient, configureChains, goerli } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

export const Celo_Alfajores = {
  id: 44787,
  name: "Celo (Alfajores Testnet)",
  network: "Celo (Alfajores Testnet)",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
  rpcUrls: {
    default: { http: ["https://alfajores-forno.celo-testnet.org"] },
  },
  blockExplorers: {
    etherscan: {
      name: "BlockScout",
      url: "https://alfajores-blockscout.celo-testnet.org",
    },
    default: {
      name: "BlockScout",
      url: "https://alfajores-blockscout.celo-testnet.org",
    },
  },
};

const { chains, provider } = configureChains(
  [goerli, Celo_Alfajores],
  [
    infuraProvider({
      apiKey: process.env.REACT_APP_GOERLI_INFURA_API,
      priority: 0,
    }),
    publicProvider({ priority: 1 }),
  ]
);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
