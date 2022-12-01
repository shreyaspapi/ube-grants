import { useEffect, useState } from "react";

import {truncateWalletAddress, getBadgeLabel} from "./utils"
import proposalJSON from "../data/dummy.json";

const truncateDescription = (str) => {
  if (str.length < 143) {
    return str;
  }

  return str.slice(0, 143) + "...";
};

const CardsList = () => {
  const [allProposals, setAllProposals] = useState([]);

  useEffect(() => {
    setAllProposals(proposalJSON);
  }, []);

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
          <div class="grid grid-flow-row-dense grid-cols-2">
            <h1 className="mb-8 text-2xl font-semibold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-3xl dark:text-white">
              Proposals
            </h1>
            
            <div className="flex justify-end mb-4">
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-md p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>All</option>
                <option value="CA">Pending</option>
                <option value="FR">Active</option>
                <option value="DE">Completed</option>
                <option value="DE">Cancelled</option>
              </select>
            </div>
          </div>
          <RenderPropoals />
        </div>

        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Learn more
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CardsList;
