const BADGE_MAP = {
    0: (
      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">
        Pending
      </span>
    ),
    1: (
      <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
        Active
      </span>
    ),
    2: (
      <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
        Rejected
      </span>
    ),
    3: (
      <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
        Completed
      </span>
    ),
    4: (
      <span className="bg-red-100 text-red-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
        Cancelled
      </span>
    ),
  };
// { Pending, Active, Rejected, Completed, Cancelled }
export const getBadgeLabel = (label) => {
    return BADGE_MAP[label];
};

export const truncateWalletAddress = (str) => str.slice(0, 6) + "..." + str.slice(-4);
