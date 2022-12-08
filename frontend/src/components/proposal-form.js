import { useState, useContext, useEffect } from "react";

import { store } from "../store/store";
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
  const globalState = useContext(store);
  const { ipfsClient } = globalState.state;

  const [proposalTitle, setProposalTitle] = useState("Dummy Title");
  const [description, setDescription] = useState("Dummy Description");
  const [totalGrantAmount, setTotalGrantAmount] = useState(0);
  const [allMilestoneDetails, setMilestoneDetails] = useState([
    {
      description: "",
      amount: 1,
      milestoneKey: 0,
    },
  ]);

  useEffect(() => {
    let currentTotalGrantAmount = 0
    allMilestoneDetails.forEach(milestone => {
      currentTotalGrantAmount += milestone.amount
    })
    setTotalGrantAmount(currentTotalGrantAmount)

  }, [allMilestoneDetails])

  // useEffect(() => {
  //   const dummyMilestone = [1, 2, 3, 4, 5].map((value) => {
  //     return {
  //       description: `Milestone ${value}`,
  //       amount: value * 10,
  //       milestoneKey: value,
  //     };
  //   });
  //   setMilestoneDetails(dummyMilestone);
  // }, []);

  const addProposalToIPFS = async (formData) => {
    if (!ipfsClient) return;

    const { cid } = await ipfsClient.add(JSON.stringify(formData));
    console.info(cid.toString());

    const stream = ipfsClient.cat(cid.toString());
    const decoder = new TextDecoder();
    let data = "";

    for await (const chunk of stream) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      data += decoder.decode(chunk, { stream: true });
    }

    console.log(data);
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
    };
    console.log("proposalForm: ", proposalForm);
    await addProposalToIPFS(proposalForm);
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
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
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
                  className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                >
                  Submit Proposal
                </button>    
                </div>            
              </div>
            </form>
          </div>
        </div>
        {/* Add a small preview window which shows markdown with 100% height*/}
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
                <ReactMarkdown>{description}</ReactMarkdown>
                
                {/*  Calculate and show total grant amount */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Total Amount - ( { totalGrantAmount } UBE )
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
      </div>
    </section>
  );
};

export default ProposalForm;
