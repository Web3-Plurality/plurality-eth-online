import { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';
import { createGroup, addMemberToGroup, verifyZKProofSentByUser } from './web3semaphore';

import { Group } from "@semaphore-protocol/group";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { FullProof, generateProof } from "@semaphore-protocol/proof";
import { Identity } from "@semaphore-protocol/identity";


/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  });
};

/**
 * Invoke the "commitment_request" & "commitment_request" method from the example snap.
 */

export const getCommitment = async () => {
  let acceptance = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'commitment_request', params: {source:"twitter"} }},
  });
  if (acceptance) {
    let commitment = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: { snapId: defaultSnapOrigin, request: { method: 'commitment_fetch', params: {source:"twitter"} } },
    });
    console.log(commitment);
    await createGroup();
    await addMemberToGroup(commitment);
  }
  else {
    console.log("User rejected the request for commitment");
  }
};

/** 
* Invoke the "zkproof_request" method from the example snap.
*/
export const getZkProof = async () : Promise<boolean> => {
 let identityString = await window.ethereum.request({
   method: 'wallet_invokeSnap',
   params: { snapId: defaultSnapOrigin, request: { method: 'zkproof_request', params: {source:"twitter"} } },
 });
  console.log(identityString);

  // zk proof creation
  //TODO: The following code block should be executed in snap 
  const identity = new Identity(identityString!.toString());
  const semaphoreEthers = new SemaphoreEthers("sepolia", {
    address: process.env.REACT_APP_SEMAPHORE_IDENTITY_CONTRACT,
    startBlock: 4269200
  });
  const groupId = process.env.REACT_APP_GROUP_ID!;
  console.log("using group id: "+groupId);
  const groupIds = await semaphoreEthers.getGroupIds()
  console.log(groupIds);


  const members = await semaphoreEthers.getGroupMembers(groupId);
  console.log(members);
  const group = new Group(groupId, 20, members);
  const signal = 1;
  const commitment=identity.commitment;
  console.log("Checking commitment: "+commitment);
if (members.includes(commitment.toString())){
  console.log("Membership proof verified");
  return true;
}
else {
  console.log("Membership proof not verified");

  return false;

}
  /*const fullProof = await generateProof(identity, group, groupId, signal, {
    zkeyFilePath: "./semaphore.zkey",
    wasmFilePath: "./semaphore.wasm"
})*/
  //const proof = await generateProof(identity, group, groupId, signal);
  //console.log(proof); 

  // zk proof verification
  /*const verified = await verifyZKProofSentByUser(proof);
  if (verified)
    alert("Proof is valid");
  else 
    alert ("Proof invalid");*/
};


export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
