const BadgeStateToText = {
  0: "Pending",
  1: "Active",
  2: "Rejected",
  3: "Completed",
  4: "Cancelled",
};

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
export const getBadgeLabel = (label) => {
  return BADGE_MAP[BadgeStateToText[label]];
};

export const truncateWalletAddress = (str) =>
  str.slice(0, 6) + "..." + str.slice(-4);

export const truncateDescription = (str) => {
  if (str.length < 143) {
    return str;
  }

  return str.slice(0, 143) + "...";
};

export const getIPFSDocument = async (ipfsClient, ipfsHash) => {
  const stream = await ipfsClient.cat(ipfsHash);
  const decoder = new TextDecoder();
  let ipfsData = "";

  for await (const chunk of stream) {
    // chunks of data are returned as a Uint8Array, convert it back to a string
    ipfsData += decoder.decode(chunk, { stream: true });
  }

  ipfsData = JSON.parse(ipfsData);
  return ipfsData;
};
