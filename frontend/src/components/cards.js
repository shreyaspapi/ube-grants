import { useEffect, useState } from "react";

import proposalJSON from "../data/dummy.json";

const BADGE_MAP = {
  Pending: (
    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">
      Pending
    </span>
  ),
  Active: (
    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
      Active
    </span>
  ),
  Rejected: (
    <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
      Rejected
    </span>
  ),
  Completed: (
    <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
      Completed
    </span>
  ),
  Cancelled: (
    <span className="bg-red-100 text-red-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
      Cancelled
    </span>
  ),
};
// { Pending, Active, Rejected, Completed, Cancelled }
const getLabel = (label) => {
  return BADGE_MAP[label];
};

const truncateWalletAddress = (str) => str.slice(0, 6) + "..." + str.slice(-4);

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
        className="mb-8 block max-w-4xl p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
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
                    <span className="w-full cursor-pointer truncate text-skin-link">
                      {truncateWalletAddress(proposal.id)}
                    </span>
                  </div>
                </a>
              </button>
            </div>
          </div>
          {getLabel(proposal.status)}
        </div>

        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
          {proposal.proposalTitle}
        </h5>
        <p className="font-normal text-xl text-gray-700 dark:text-gray-400 text-left">
          {truncateDescription(proposal.proposalDescriptions)}
        </p>
      </div>
    ));
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
            New
          </span>
          <span className="text-sm font-medium">
            Flowbite is out! See what's new
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          We invest in the world’s potential
        </h1>

        <div className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
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
