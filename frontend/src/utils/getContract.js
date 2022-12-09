import { Contract } from "ethers";

import ABI from "../abi/ubeGrants.json";

export const UBE_CONTRACT_ADDRESS = "0x41bb6856E824Af55FA2F10d68cf5A74c351CbA41";
export const ABI_JSON = ABI

export const getContract = (signerOrProvider) => {
  const contract = new Contract(UBE_CONTRACT_ADDRESS, ABI, signerOrProvider);
  return contract;
};
