import { create } from "ipfs-core";

async function main() {
  // Create an instance of the ipfs-core library
  const node = await create();

  const stream = await node.cat(
    "QmcpPcCkeCdDz6jD5a9nYTyu1NynP6BhPETAfoRFbUXzq8"
  );
  const decoder = new TextDecoder();
  let data = "";

  for await (const chunk of stream) {
    // chunks of data are returned as a Uint8Array, convert it back to a string
    console.log("chunk", chunk);
    data += decoder.decode(chunk, { stream: true });
  }

  console.log(data);
}

// const stream = ipfsClient.cat(
//     //   "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A"
//     // );
//     // const decoder = new TextDecoder();
//     // let data = "";

//     // for await (const chunk of stream) {
//     //   // chunks of data are returned as a Uint8Array, convert it back to a string
//     //   data += decoder.decode(chunk, { stream: true });
//     // }

//     // console.log(data);

main();
