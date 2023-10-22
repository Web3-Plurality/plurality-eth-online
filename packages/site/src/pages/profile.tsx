import styled from "styled-components";
import { ScrollingCarousel } from '@trendyol-js/react-carousel';
import { useEffect, useState } from "react";
import { fetchCommitment, getLocalStorage } from "../utils";
import { Button } from "react-bootstrap";
import useLocalStorageState from "use-local-storage-state";


const Profile = () => {
    const [interests, setInterests] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [facebookCommitment, setFacebookCommitment] = useState("");
    const [twitterCommitment, setTwitterCommitment] = useState("");

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
        setInterests(interests!);
        return interests;
    }

    useEffect(() => {
        fetchInterests().catch(console.error);
      }, []);
    
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

    

    return (
        <div style={contentComponent}>
            <div style={{height: "100px"}}></div>
            <h1>My Profile</h1>
            {!signedInUser && (
                <p>Please sign in first to view your profile details</p>
            )}
            {walletAddress && (
                <p>Address: {walletAddress}</p>
            )}
            {signedInUser && interests && (
                <p>We have captured the following interests: {interests}</p>
            )}
            {signedInUser && (
                <p>Currently signed in with: {signedInUser}</p>
            )}
            {did && (
                <p>Orbis did:pkh is : {signedInUser}</p>
            )}
            {isTwitterConnected && (
                <p>Twitter social connected? : YES</p>
            )}
            {signedInUser && twitterCommitment && isTwitterConnected && (
                <p>Twitter decentralized identifier : {twitterCommitment}</p>
            )}
            {isFacebookConnected && (
                <p>Facebook social connected? : YES</p>
            )}
            {signedInUser && facebookCommitment && isFacebookConnected && (
                <p>Facebook decentralized identifier : {facebookCommitment}</p>
            )}
            <div style={{height: "220px"}}></div>
        </div>
    )
}

export default Profile;