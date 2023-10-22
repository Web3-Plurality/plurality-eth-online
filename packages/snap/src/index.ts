import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { Identity } from "@semaphore-protocol/identity";

import { addReputation, getReputation} from "./utils/snapStorage"; 
//import { generateProofInSandbox } from './sandbox';

const createIdentity = (_source: string) : any => {
  const identity = new Identity();
  addReputation(_source,identity.toString());
  return identity;
}
const getSavedCommitment = async (_source: string): Promise<string> => {
  const data = await getReputation(_source);
  if (data) {
    const identity = new Identity(data.toString())
    return identity.commitment.toString();
  }
  else {
    return "";
  }
}

const getZKProof = async (_source: string): Promise<string> => {
  const data = await getReputation(_source);
  return data;
  //TODO: The proof needs to be generated inside a sandbox since generateProof method uses an eval() function
  // eval() is disallowed in SES environment of snap
  
  /*const identity = new Identity(data.toString());
  const semaphoreEthers = new SemaphoreEthers("sepolia", {
    address: "0xe8758638fD2E34f230b99e9b6D8587508B6D90EA",
    startBlock: 0
  });
  const groupId = "000"
  const members = await semaphoreEthers.getGroupMembers(groupId)
  const group = new Group(groupId, 20, members);
  const signal = 1;
  const proof = await generateProofInSandbox(identity, group, groupId, signal);

  return proof;*/
}
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  let params = JSON.stringify(request.params);
  let param = JSON.parse(params);
  let source = param.source;
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'commitment_request':
      let obj = createIdentity(source);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Created new identity commitment`),
            text(`\nReputation from source: ` + source),
            text(`\nCommitment: ` + obj.getCommitment()),
            text(`\nTrapdoor: ` + obj.getTrapdoor()),
            text(`\nNullifier: ` + obj.getNullifier())
          ]),
        },
      });
    case 'commitment_fetch':
      // At a later time, get the data stored.
      let result =getSavedCommitment(source).then((a)=> {
        return a;
      });
      return result;
    case 'zkproof_request':
      // At a later time, get the data stored.
      let zkproof =getZKProof(source).then((result)=> {
        return result;
      });
      return zkproof;
      
    default:
      throw new Error('Method not found.');
  }
};
