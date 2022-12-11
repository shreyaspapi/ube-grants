import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useContract, useSigner, useAccount } from "wagmi";
import Rodal from 'rodal';

import ModalComponent from "./modal"

import { store } from "../store/store";
import { UBE_CONTRACT_ADDRESS, ABI_JSON } from "../utils/constants";
import { getBadgeLabel, truncateWalletAddress, getGrantDataFromGraph, getIPFSDocument, getIPFSHash, getMilestonesForGrant } from "../utils/utils";
import 'rodal/lib/rodal.css';

const Proposal = () => {
  const globalState = useContext(store);
  const { ipfsClient } = globalState.state;
  const { proposalId } = useParams();

  const { data: signer } = useSigner();
  const contract = useContract({
    address: UBE_CONTRACT_ADDRESS,
    abi: ABI_JSON,
    signerOrProvider: signer,
  });
  const { address } = useAccount()
  
  const [proposal, setProposal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalDescription, setModalDescription] = useState('');
  const [currentTxHash, setCurrentTxHash] = useState(false)

  useEffect(() => {
    const processIPFSHash = async () => {
      if (!ipfsClient) return
      const grant = await getGrantDataFromGraph(proposalId);
      const ipfsData = await getIPFSDocument(ipfsClient, grant.ipfs);
      setProposal({ ...grant, ...ipfsData })

      const getMilestone = await getMilestonesForGrant(proposalId);
      setMilestones(getMilestone)
    }

    processIPFSHash()
  }, [ipfsClient]);

  console.log(
    "milestones", milestones
  )

  const convertEpochTime = (epochTime) => {
    const date = new Date(epochTime * 1000);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const onToggleModal = () => {
    setOpenModal(prevState => !prevState)
  }
  
  const onMilestoneDescriptionChange = (descriptionText) => {
    setModalDescription(descriptionText)
  }

  const onSubmitDescription = async (event) => {
    event.preventDefault();
    if(!modalDescription) return
    if(!ipfsClient) return
    
    const ipfsHash = await getIPFSHash(ipfsClient, modalDescription)
    console.log("ipfsHash", ipfsHash)

    // Do a contract call
    const tx = await contract.functions.applyForGrantMilestone(proposalId, ipfsHash)
    setCurrentTxHash(tx.hash);
  }

  const RenderPropsal = () => (
    <div className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 text-left">
      <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
        <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
          <header className="mb-4 lg:mb-6 not-format">
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
                      {proposal.grantee}
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="mb-4">
              <span className="mr-4">{getBadgeLabel(proposal.state)}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <time dateTime="2022-02-08" title="February 8th, 2022">
                  {convertEpochTime(proposal.time)}
                </time>
              </span>
            </div>

            <div className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-3xl dark:text-white">
              <ReactMarkdown>{proposal.title}</ReactMarkdown>
            </div>
          </header>

          <p className="text-2xl font-semibold">Proposal Details</p>
          <ReactMarkdown>{proposal.description}</ReactMarkdown>

          <section className="not-format">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                Milestones ({proposal.totalAmount} UBE)
              </h2>
            </div>

            {proposal.milestones.map((milestone, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-4">
                    <h2 className="mb-2 text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                      Milestone {index + 1} ({milestone.amount} UBE)
                    </h2>
                    {(proposal.nextPayout == index) && address && address.toLowerCase() === proposal.grantee && <span onClick={onToggleModal} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 cursor-pointer">
                      Apply
                    </span>}
                  </div>

                  <div className="mb-8">
                    <ReactMarkdown>{milestone.description}</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          
            {/* Loop over milestones */}
            
            <article className="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                      alt="Michael Gough"
                    />
                    Grantee &nbsp; &nbsp;
                    <span>{truncateWalletAddress(proposal.grantee)}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time dateTime="2022-02-08" title="February 8th, 2022">
                      Feb. 8, 2022
                    </time>
                  </p>
                </div>
                <button
                  id="dropdownComment1Button"
                  data-dropdown-toggle="dropdownComment1"
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                  divaria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                  <span className="sr-only">Comment settings</span>
                </button>

                <div
                  id="dropdownComment1"
                  className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconHorizontalButton"
                  >
                    <li>
                      <p
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </p>
                    </li>
                    <li>
                      <p
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Remove
                      </p>
                    </li>
                    <li>
                      <p
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Report
                      </p>
                    </li>
                  </ul>
                </div>
              </footer>
              <p>
                Status: Pending Rather than select a winner themselves, the
                Meta-Governance Working Group Stewards believe that the
                selection of a fund manager should be put to the DAO. This EP
                implements a Snapshot vote using Ranked Choice voting with the
                following options:
              </p>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  type="button"
                  className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                >
                  <svg
                    aria-hidden="true"
                    className="mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  Reply
                </button>
              </div>
            </article>
          </section>
        </article>
      </div>
    </div>
  )

  return (
    <>
      {proposal && <RenderPropsal />}
      <Rodal visible={openModal} onClose={onToggleModal} height={350} showMask showCloseButton={true} >
        <ModalComponent onSubmitDescription={onSubmitDescription} onMilestoneDescriptionChange={onMilestoneDescriptionChange} currentTxHash={currentTxHash} />
      </Rodal>
    </>
  );
  
};

export default Proposal;
