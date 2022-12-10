import { useEffect, useState, useContext } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import { store } from "../store/store";
import { truncateWalletAddress, getBadgeLabel } from "./utils";
import proposalJSON from "../data/dummy.json";

const truncateDescription = (str) => {
  if (str.length < 143) {
    return str;
  }

  return str.slice(0, 143) + "...";
};

// Replace with the actual API endpoint you want to call
const API_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/shreyaspapi/ubegrants";

// Set the parameters for the request
const graphQuery = `
    {
      grants(first: 5) {
        id
        grantId
        state
        ipfs
        grantee
      }
    }
  `;

const appoloClient = new ApolloClient({
  uri: API_ENDPOINT,
  cache: new InMemoryCache(),
});

const AllProposal = () => {
  const globalState = useContext(store);
  const { ipfsClient } = globalState.state;
  console.log("ipfsClient: ", ipfsClient);

  const [allProposals, setAllProposals] = useState([]);

  useEffect(() => {
    setAllProposals(proposalJSON);
  }, []);

  useEffect(() => {
    const fetchIPFSData = async () => {
      if (!ipfsClient) return;

      const graph = await appoloClient.query({
        query: gql(graphQuery),
      });

      graph.data.grants.forEach(async (grant) => {
        console.log("grant", grant);
        const ipfsHash = grant.ipfs;

        // const stream = ipfsClient.cat(
        //   "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A"
        // );
        // const decoder = new TextDecoder();
        // let data = "";

        // for await (const chunk of stream) {
        //   // chunks of data are returned as a Uint8Array, convert it back to a string
        //   data += decoder.decode(chunk, { stream: true });
        // }

        // console.log(data);

        // let dataChunk;
        // let message;
        // // Use a while loop to repeatedly call the next method
        // // until the done flag is true
        // while (!(dataChunk = dataGenerator.next()).done) {
        //   // The data is not finished, so do something with the dataChunk
        //   message += dataChunk.value;
        // }

        // // The final value is stored in the value property of the dataChunk object
        // message += dataChunk.value;
        // console.log("ipfsHash", ipfsHash);

        // const stream = ipfsClient.cat(ipfsHash);
        // console.log("stream", stream);
        // const decoder = new TextDecoder();
        // let data = "";

        // for await (const chunk of stream) {
        //   console.log("chunk", chunk);
        //   // chunks of data are returned as a Uint8Array, convert it back to a string
        //   data += decoder.decode(chunk, { stream: true });
        // }

        // console.log("This is the data", message);
      });
    };

    fetchIPFSData();
  }, [ipfsClient]);

  const RenderPropoals = () => {
    return allProposals.map((proposal, key) => (
      <div
        key={key}
        className="mb-8 block max-w-8xl p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div data-headlessui-state="">
              <button
                className="outline-none"
                id="headlessui-popover-button-14"
                type="button"
                aria-expanded="false"
                data-headlessui-state=""
              >
                <a
                  href="#/profile/0xd54A2392c8F2AD3a4e927Cf24EC12797f2503C7b"
                  className="whitespace-nowrap"
                >
                  <div className="flex flex-nowrap items-center space-x-1">
                    <span className="w-full text-sm cursor-pointer truncate text-skin-link">
                      {truncateWalletAddress(proposal.id)}
                    </span>
                  </div>
                </a>
              </button>
            </div>
          </div>
          {getBadgeLabel(proposal.status)}
        </div>

        <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white text-left">
          {proposal.proposalTitle}
        </h5>
        <p className="font-normal text-lg text-gray-700 dark:text-gray-400 text-left">
          {truncateDescription(proposal.proposalDescriptions)}
        </p>
      </div>
    ));
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-left lg:py-16 lg:px-12">
        <div className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          <div className="grid grid-flow-row-dense grid-cols-2">
            <h1 className="mb-8 text-2xl font-semibold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-3xl dark:text-white">
              Proposals
            </h1>

            <div className="flex justify-end mb-4">
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-md p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option defaultValue>All</option>
                <option value="CA">Pending</option>
                <option value="FR">Active</option>
                <option value="DE">Completed</option>
                <option value="DE">Cancelled</option>
              </select>
            </div>
          </div>
          <RenderPropoals />
        </div>
      </div>
    </section>
  );
};

export default AllProposal;
