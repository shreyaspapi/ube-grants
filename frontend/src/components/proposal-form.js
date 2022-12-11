import { useState, useContext, useEffect } from "react";
import {
  useContract,
  useSigner,
  useAccount,
  useConnect
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import ReactMarkdown from "react-markdown";

import { store } from "../store/store";
import { UBE_CONTRACT_ADDRESS, ABI_JSON } from "../utils/constants";
import { getIPFSHash, WaitForTransaction } from "../utils/utils";

import {ethers} from "ethers";

const dummyMarkDownDescription =
  "# A demo of `nemo`\n\n`react-markdown` is a markdown component for React.\n\n👉 Changes are re-rendered as you type.\n\n👈 Try writing some markdown on the left.\n\n![https://pbs.twimg.com/media/Fivwgv9X0AYM303?format=jpg&name=4096x4096](https://pbs.twimg.com/media/Fivwgv9X0AYM303?format=jpg&name=4096x4096)\n\n## Overview\n\n* Follows [CommonMark](https://commonmark.org)\n* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)\n";

const AddNewMilestone = ({
  onDeleteHandler,
  milestoneIndex,
  milestone,
  changeMilestoneDescription,
  changeMilestonePrice,
}) => {
  const { milestoneKey, description, amount } = milestone;
  return (
    <div className="w-full mb-8 p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Milestone {milestoneIndex + 1}
        </h5>
        {milestoneIndex > 0 && (
          <span
            className="text-sm font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer"
            onClick={() => onDeleteHandler(milestoneKey)}
          >
            Delete
          </span>
        )}
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="pt-3 pb-0 sm:pt-4">
            <div className="sm:col-span-2 whitespace-pre-line">
              <label
                htmlFor="description"
                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Your description here"
                value={description}
                onChange={(e) =>
                  changeMilestoneDescription(milestoneKey, e.target.value)
                }
                required
              ></textarea>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Amount
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  UBE
                </span>
                <input
                  type="number"
                  id="milestone"
                  min="0"
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  onChange={(e) =>
                    changeMilestonePrice(milestoneKey, e.target.value)
                  }
                  value={amount}
                  required
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const PreviewMilestone = ({
  proposalTitle,
  description,
  totalGrantAmount,
  allMilestoneDetails,
}) => {
  return (
    <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto mt-8 text-left">
      <div className="box border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto max-h-screen h-5/6">
        <div className="rounded-lg p-4">
          <h2 className="mb-4 text-2xl text-left font-bold text-gray-900 dark:text-white">
            Preview
          </h2>
          <div className="prose lg:prose-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              <ReactMarkdown>{proposalTitle}</ReactMarkdown>
            </h3>
            <ReactMarkdown>
              {description || dummyMarkDownDescription}
            </ReactMarkdown>

            {/*  Calculate and show total grant amount */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Total Amount - ( {totalGrantAmount} UBE )
            </h3>
            {/*  Show all milestones */}
            {allMilestoneDetails.map((milestone, key) => (
              <div key={key}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Milestone {key + 1} - ( {milestone.amount} UBE )
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const ProposalForm = () => {
  const globalState = useContext(store);
  const { ipfsClient } = globalState.state;

  // wagmi
  const { data: signer } = useSigner();
  let { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const contract = useContract({
    address: UBE_CONTRACT_ADDRESS,
    abi: ABI_JSON,
    signerOrProvider: signer,
  });

  const [proposalTitle, setProposalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentTxHash, setCurrentTxHash] = useState(null);
  const [totalGrantAmount, setTotalGrantAmount] = useState(0);
  const [allMilestoneDetails, setMilestoneDetails] = useState([
    {
      description: "",
      amount: 1,
      milestoneKey: 0,
    },
  ]);

  useEffect(() => {
    let currentTotalGrantAmount = 0;
    allMilestoneDetails.forEach((milestone) => {
      currentTotalGrantAmount += milestone.amount;
    });
    setTotalGrantAmount(currentTotalGrantAmount);
  }, [allMilestoneDetails]);

  const addProposalToIPFS = async (formData) => {
    if (!ipfsClient) return;

    const cid = await getIPFSHash(ipfsClient, formData);
    return cid;
  };

  const submitMilestoneToContract = async (ipfsHash, milestoneAmounts) => {
    const tx = await contract.functions.applyForGrant(
      ipfsHash,
      milestoneAmounts
    );

    return tx;
  };

  const changeMilestoneDescription = (milestoneIndex, newDescription) => {
    if (typeof allMilestoneDetails[milestoneIndex] === "undefined") {
      console.log("Doesn't exists", milestoneIndex);
      return;
    }

    const newMilestone = [...allMilestoneDetails];
    newMilestone[milestoneIndex] = {
      ...newMilestone[milestoneIndex],
      description: newDescription,
    };
    setMilestoneDetails(newMilestone);
  };

  const changeMilestonePrice = (milestoneIndex, newAmount) => {
    newAmount = Math.abs(newAmount);
    if (typeof allMilestoneDetails[milestoneIndex] === "undefined") {
      console.log("newAmount Doesn't exists", milestoneIndex);
      return;
    }

    const newMilestone = [...allMilestoneDetails];
    newMilestone[milestoneIndex] = {
      ...newMilestone[milestoneIndex],
      amount: newAmount,
    };
    setMilestoneDetails(newMilestone);
  };

  const onAddMilestone = () => {
    const milestoneKey = allMilestoneDetails.length;
    setMilestoneDetails((oldMilestone) => [
      ...oldMilestone,
      {
        milestoneKey: milestoneKey,
        description: "",
        amount: 1,
      },
    ]);
  };

  const onDeleteMilestone = (removeIndex) => {
    const newMilestone = [...allMilestoneDetails];
    newMilestone.splice(removeIndex, 1);
    setMilestoneDetails(newMilestone);
  };

  const submitProposal = async (e) => {
    e.preventDefault();

    const proposalForm = {
      title: proposalTitle,
      description: description,
      milestones: allMilestoneDetails,
      totalAmount: totalGrantAmount
    };
    const ipfsHash = await addProposalToIPFS(proposalForm);
    const milestoneAmounts = allMilestoneDetails.map(
      // convest to wei
      (milestone) => ethers.utils.parseEther(milestone.amount.toString())
    );

    if (!ipfsHash || milestoneAmounts.length < 1) return;
    const tx = submitMilestoneToContract(ipfsHash, milestoneAmounts);
    setCurrentTxHash(tx.hash);
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      {/* left right div */}
      <div className="flex flex-col lg:flex-row mx-auto max-w-7xl">
        <div className="flex flex-col flex-1">
          <div className="py-8 px-4 max-w-2xl lg:py-16">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <div className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Proposals
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                    <div className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                      New Proposal
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className="mb-4 text-2xl text-left font-bold text-gray-900 dark:text-white">
              Add a new proposal
            </h2>

            <form onSubmit={submitProposal}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add Title"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4 sm:col-span-2 whitespace-pre-line">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="8"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Your description here"
                    value={description || dummyMarkDownDescription}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              {allMilestoneDetails.map((milestone, key) => (
                <AddNewMilestone
                  key={key}
                  milestoneIndex={key}
                  milestone={milestone}
                  onDeleteHandler={onDeleteMilestone}
                  changeMilestoneDescription={changeMilestoneDescription}
                  changeMilestonePrice={changeMilestonePrice}
                />
              ))}

              {/* Add a text button to add newmilestones and submit button with flex column */}
              <div className="flex flex-col">
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    // Button to add new milestones only text with no background and color blue
                    className="inline-flex items-center px-5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-700 bg-transparent dark:focus:ring-primary-900"
                    onClick={onAddMilestone}
                  >
                    Add Milestone
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    className={
                      !isConnected
                        ? "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white cursor-not-allowed opacity-50 bg-gray-300"
                        : "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    }
                    disabled={!isConnected}
                  >
                    Submit Proposal
                  </button>
                </div>

                {!isConnected && (
                  <div className="pt-4 flex flex-col items-center">
                    <button
                      type="button"
                      // Button to add new milestones only text with no background and color blue
                      className="text-sm text-center text-gray-500 dark:text-gray-400"
                      onClick={() => connect()}
                    >
                      Click here to connect your wallet to submit proposal
                    </button>
                  </div>
                )}

                {currentTxHash && <WaitForTransaction txHash={currentTxHash} />}
              </div>
            </form>
          </div>
        </div>
        <PreviewMilestone
          proposalTitle={proposalTitle}
          description={description}
          totalGrantAmount={totalGrantAmount}
          allMilestoneDetails={allMilestoneDetails}
        />
      </div>
    </section>
  );
};

export default ProposalForm;
