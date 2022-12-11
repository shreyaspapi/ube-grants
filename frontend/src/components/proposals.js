import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

import { store } from "../store/store";

import {
  truncateWalletAddress,
  getBadgeLabel,
  truncateDescription,
  getIPFSDocument,
} from "./utils";
import ReactMarkdown from "react-markdown";

const API_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/shreyaspapi/ubegrants";

const getDefaultGraphQuery = () => {
  return `query {
      grants(first: 100, orderBy: time, orderDirection: desc) {
        id
        grantId
        state
        ipfs
        grantee
        time
      }
    }
  `;
};

const AllProposal = () => {
  const globalState = useContext(store);
  const { ipfsClient } = globalState.state;

  const [allProposals, setAllProposals] = useState([]);
  const [graphQuery, setGraphQuery] = useState(getDefaultGraphQuery());
  const [loadProposals, setLoadProposals] = useState(true);

  const createQuery = (event) => {
    const selectedType = event.target.value;
    let newGraphQuery;
    if (selectedType === "All") {
      newGraphQuery = getDefaultGraphQuery();
    } else {
      newGraphQuery = `query {
          grants(first: 100, orderBy: time, orderDirection: desc, where: {state: ${selectedType}}) {
            id
            grantId
            state
            ipfs
            grantee
            time
          }
        }
      `;
    }
    setGraphQuery(newGraphQuery);
  };

  useEffect(() => {
    const fetchIPFSData = async () => {
      if (!ipfsClient) return;

      // start loading
      setLoadProposals(true);
      axios
        .post(API_ENDPOINT, {
          query: graphQuery,
        })
        .then((res) => {
          const response = res.data;
          console.log("response: ", response);
          if (response.data.grants.length === 0) {
            setAllProposals([]);
            // stop loading
            setLoadProposals(false);
            return;
          }

          // loop through the grants and fetch the ipfs data
          response.data.grants.forEach(async (grant) => {
            const ipfsData = await getIPFSDocument(ipfsClient, grant.ipfs);
            console.log(ipfsData)
            setAllProposals((allProposals) => [
              ...allProposals,
              { ...ipfsData, ...grant },
            ]);
          });
          // stop loading
          setLoadProposals(false);
        })
        .catch((err) => {
          console.log("Error fetching data from the graph: ", err);
        });
    };

    fetchIPFSData();
  }, [ipfsClient, graphQuery]);

  console.log("allProposals: ", allProposals);
  const RenderPropoals = () => {
    // if length is 0, then no proposals, add a message saying no proposals
    if (!loadProposals && allProposals.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Uh oh, looks like we hit a roadblock. Try tweaking your filter to
            uncover some hidden gems.
          </h1>
        </div>
      );
    }

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
                      {truncateWalletAddress(proposal.grantee)}
                    </span>
                  </div>
                </a>
              </button>
            </div>
          </div>
          {getBadgeLabel(proposal.state)}
        </div>

        <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white text-left">
          {proposal.title}
        </h5>
        <ReactMarkdown>
          {truncateDescription(proposal.description)}
        </ReactMarkdown>
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
                id="proposalState"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-md p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={createQuery}
              >
                <option defaultValue="All">All</option>
                <option value="0">Pending</option>
                <option value="1">Active</option>
                <option value="2">Rejected</option>
                <option value="3">Completed</option>
                <option value="4">Cancelled</option>
              </select>
            </div>
          </div>
          {loadProposals && (
            <div className="flex justify-center">
              <ClipLoader
                color={"red"}
                loading={loadProposals}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          <RenderPropoals />
        </div>
      </div>
    </section>
  );
};

export default AllProposal;
