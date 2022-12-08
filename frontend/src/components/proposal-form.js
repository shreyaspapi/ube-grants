import { useState, useEffect } from "react";
// import { create } from 'ipfs-http-client'
import * as IPFS from 'ipfs-core'
// import axios from 'axios'

import ReactMarkdown from "react-markdown";

const NewMilestone = ({
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

const ProposalForm = () => {
  const [proposalTitle, setProposalTitle] = useState("Dummy Title");
  const [description, setDescription] = useState("Dummy Description");
  const [allMilestoneDetails, setMilestoneDetails] = useState([
    {
      description: "",
      amount: 1,
      milestoneKey: 0,
    },
  ]);

  useEffect(() => {
    const dummyMilestone = [1, 2, 3, 4, 5].map((value) => {
      return {
        description: `Milestone ${value}`,
        amount: value * 10,
        milestoneKey: value,
      };
    });
    setMilestoneDetails(dummyMilestone);
  }, []);

  const addProposalToIPFS = async (formData) => {
    const ipfs = await IPFS.create()

    const { cid } = await ipfs.add(JSON.stringify(formData))
    console.info(cid.toString())

    const stream = ipfs.cat(cid.toString())
    const decoder = new TextDecoder()
    let data = ''

    for await (const chunk of stream) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      data += decoder.decode(chunk, { stream: true })
    }

    console.log(data)
  }

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
    };
    console.log("proposalForm: ", proposalForm);
    await addProposalToIPFS(proposalForm)
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl text-left font-bold text-gray-900 dark:text-white">
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          {allMilestoneDetails.map((milestone, key) => (
            <NewMilestone
              key={key}
              milestoneIndex={key}
              milestone={milestone}
              onDeleteHandler={onDeleteMilestone}
              changeMilestoneDescription={changeMilestoneDescription}
              changeMilestonePrice={changeMilestonePrice}
            />
          ))}

          {/* <ReactMarkdown>{description}</ReactMarkdown> */}

          {/* <p className="prose lg:prose-xl">
            <ReactMarkdown>{description}</ReactMarkdown>
          </p> */}

          <button
            type="button"
            className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
            onClick={() => onAddMilestone()}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
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
            <span className="sr-only">Icon description</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProposalForm;
