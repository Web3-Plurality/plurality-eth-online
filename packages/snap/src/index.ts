import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { Identity } from "@semaphore-protocol/identity";

const createIdentity = () : any => {
  const identity = new Identity();
  let id_obj={
    _link: 'X', 
    _commitment: identity.getCommitment().toString(), 
    _trapdoor: identity.getTrapdoor().toString(),
    _nullifier: identity.getNullifier().toString()
  }
    // Persist some data.
  snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', 
    newState: id_obj
    },
  });
 // console.log(identity.getCommitment());
  return id_obj;
}
const getSavedCommitment = async (): Promise<any> => {
  //return 'abc';
  const data = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
 // console.log(data?.toString());
  return data!!._commitment;
  //return 'abc';
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
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Created new identity commitment`),
            text(`\nLinked Reputation: ` + createIdentity()._link),
            text(`\nCommitment: ` + createIdentity()._commitment),
            text(`\nTrapdoor: ` + createIdentity()._trapdoor),
            text(`\nNullifier: ` + createIdentity()._nullifier)
          ]),
        },
      });  
    case 'commitment_fetch':
      // At a later time, get the data stored.
        const result=getSavedCommitment().then((a)=> {
          return a;
        });
        return result;
      //return snap.request({
      //  method: 'snap_manageState',
      //  params: { operation: 'get' },
      //});  
    default:
      throw new Error('Method not found.');
  }
};
