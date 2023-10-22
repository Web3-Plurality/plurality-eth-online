import Modal from "@atlaskit/modal-dialog";
import { Fragment, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { fetchCommitment } from "../utils";
import styled from "styled-components";
import Button from "@atlaskit/button";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Checkmark } from 'react-checkmark';

export function ModalBoxProfile( props: any ) {
    const [interests, setInterests] = useState<string[]>([]);
    const [walletAddress, setWalletAddress] = useState("");
    const [facebookCommitment, setFacebookCommitment] = useState("");
    const [twitterCommitment, setTwitterCommitment] = useState("");
    const [twitterCopy, setTwitterCopyopy] = useState("Copy");
    const [facebookCopy, setFacebookCopy] = useState("Copy");

     // facebook and twitter info
    const [isFacebookConnected, setFacebookConnected] = useLocalStorageState('isFacebookConnected', {defaultValue: false});
    const [isTwitterConnected, setTwitterConnected] = useLocalStorageState('isTwitterConnected', {defaultValue: false});
    const [signedInUser, setSignedInUser] = useLocalStorageState('signedInUser', {defaultValue: ""});
    const [did, setDid] = useLocalStorageState('did', {defaultValue: ""});

    async function fetchInterestsFromSubgraph(commitments: string[]){
        try {
            console.log("Fetching interests for commitments: "+ JSON.stringify(commitments));
            const response = await fetch(process.env.GATSBY_API_BASE_URL+'/subgraph/', {
              method: 'POST',
              body: JSON.stringify(commitments), 
              headers: new Headers({'content-type': 'application/json'}),
            })
            const json = await response.json()
            const interestsObj = json.data.interestsMetaDatas;
            let interests = "";
            for (let i=0; i< interestsObj.length;i++) {
                interests = interests + interestsObj[i].interests;
            }
            return interests;

          } catch(err) {
            console.log({ err })
        }
    }

    const fetchInterests = async () => {
        const commitmentFB =  await fetchCommitment(process.env.GATSBY_FACEBOOK!);
        setFacebookCommitment(commitmentFB);
        const commitmentTW =  await fetchCommitment(process.env.GATSBY_TWITTER!);
        setTwitterCommitment(commitmentTW);
        let commitments: string[] = [];
        if (commitmentFB)   commitments.push(commitmentFB);
        if (commitmentTW)   commitments.push(commitmentTW);
        const interests = await fetchInterestsFromSubgraph(commitments);
        console.log([...interests!.split(",")])
        setInterests([...interests!.split(",")]);
        return interests;
    }

    const changeTextFB = () => {
        setTwitterCopyopy("Copied!");
    }

    const changeTextTW = () => {
        setFacebookCopy("Copied!");
    }

    useEffect(() => {
        fetchInterests().catch(console.error);
      }, []);

    useEffect(() => {
        setTwitterCopyopy("Copy");
        setFacebookCopy("Copy");
    }, [props.show]);
    
    const contentComponent = {
        marginLeft: '20%',
        marginRight: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }

    const Subtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: 500;
    margin-top: 30px;
    margin-bottom: 20px;
    ${({ theme }) => theme.mediaQueries.small} {
        font-size: ${({ theme }) => theme.fontSizes.text};
    }
    `;

    const SocialMediaHandler = styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    `;

    const Item = styled.button`
    margin: 5px 4px 5px
    `;

    return (
        <Fragment>
        { props.show ? (
        <Modal onClose={props.handleClose}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "20px"}}>
                <Subtitle style={{marginTop: "30px"}}>Signed in with: {signedInUser}</Subtitle>
                {signedInUser && twitterCommitment && isTwitterConnected && (
                    <SocialMediaHandler>
                        <Subtitle>Twitter decentralized identifier: </Subtitle>
                        <CopyToClipboard text={ twitterCommitment } style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: '15px', marginLeft: '15px'}}>
                            <Button onClick={changeTextTW}>{twitterCopy}</Button>
                        </CopyToClipboard>
                    </SocialMediaHandler>
                )}
                {signedInUser && facebookCommitment && isFacebookConnected && (
                    <SocialMediaHandler>
                        <Subtitle>Facebook decentralized identifier: </Subtitle>
                        <CopyToClipboard text={ facebookCommitment } style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: '15px', marginLeft: '15px'}}>
                            <Button onClick={changeTextFB}>{facebookCopy}</Button>
                        </CopyToClipboard>
                    </SocialMediaHandler>
                )}
                <SocialMediaHandler>
                    <Subtitle>You may interested in:</Subtitle>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                { interests.map(interest => <Item key={interest} id={interest}>{interest}</Item>) }
              </div>
                </SocialMediaHandler>
            </div>
            <Button onClick={props.handleClose} style={{marginTop: '15px'}}>Close</Button>
          </Modal>
        ) : null}
        </Fragment>
    )
  }
