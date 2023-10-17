import { useContext,  useEffect, useState} from 'react';
import { useNetwork } from 'wagmi'
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  getCommitment,
  getZkProof,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { getTwitterID } from '../utils/oauth';
import { 
  ContentFocus, 
  useActiveProfile,  
  useCreatePost, 
  useUpdateDispatcherConfig, 
  useUpdateProfileDetails 
} from '@lens-protocol/react-web';
import { 
  useAccount, 
  useConnect, 
  useDisconnect 
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'react-bootstrap';
import LoadingContext from '../components/LoadingContext';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { LensClient, development } from "@lens-protocol/client";
import { getTwitterInterestsForLens } from '../utils/twitterUserInterest';
import { getFacebookInterestsForLens } from '../utils/facebookUserInterest';
import { Authentication } from '../components/Authentication';
import { ModalBoxInterests } from '../components/InterestsListModal';
import { translateInterests } from '../utils/interests';
import { ShareModal } from '../components/ShareModal';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { Orbis } from "@orbisclub/orbis-sdk";
import useLocalStorageState from 'use-local-storage-state';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;
//64.8rem
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 80%;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  text-align: center;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;
const Message = styled.div`
background-color: ${({ theme }) => theme.colors.background.alternative};
border: 1px solid ${({ theme }) => theme.colors.border.default};
color: ${({ theme }) => theme.colors.primary.default};
border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;
const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  //border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;



const Index = () => {

  // Lens hooks 
  const { data: wallet, loading } = useActiveProfile();
  const { execute: create, error, isPending: isPendingCreatePost } = useCreatePost({ publisher: wallet!, upload: uploadJson });
  const { execute: update, error: updateError, isPending: isUpdatePending } = useUpdateProfileDetails({ profile: wallet!, upload: uploadJson });
  const { execute: updateDispatcher, error: errorDispatcher, isPending: isPendingDispatcher } = useUpdateDispatcherConfig({ profile: wallet! });
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  // spinner context hook
  const { showLoading, hideLoading } = useContext(LoadingContext)

  //confetti hook
  const { width, height } = useWindowSize();
  const [lensProfileSuccess, setLensProfileSuccess] = useState(false);


  // facebook and twitter info
  const [isFacebookConnected, setFacebookConnected] = useLocalStorageState('isFacebookConnected', {defaultValue: false});
  const [isTwitterConnected, setTwitterConnected] = useLocalStorageState('isTwitterConnected', {defaultValue: false});

  const [isTwitterUseEffectCalled, setTwitterUseEffectCalled] = useState(false);

  // check connected network hook
  const { chain, chains } = useNetwork();

  // interests modal dialog hook
  const [show, setShow] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [userInterestsLabels, setUserInterestsLabels] = useState<{value: string,label: string}[]>([]);
  const [interestsUpdated, setInterestsUpdated] = useState(false);

  // share modal hook
  const [share, setShare] = useState(false);

  const [userInformation, setUserInformation] = useState("");

  // metamask hooks
  const [state, dispatch] = useContext(MetaMaskContext);
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  // orbis hooks
  const [orbisUser, setOrbisUser] = useState();
  const [orbis, setOrbis] = useState(new Orbis({}));

  // local storage states (signed in user & did of user in case of orbis)
  const [signedInUser, setSignedInUser] = useLocalStorageState('signedInUser', {defaultValue: ""});
  const [did, setDid] = useLocalStorageState('did', {defaultValue: ""});
  
  /** Calls the Orbis SDK and handles the results */
  async function orbisConnect() {
      const res = await orbis.connect_v2({ chain: "ethereum", lit: false });
      console.log(orbis);
    /** Check if the connection is successful or not */
    if(res.status == 200) {
      console.log(res.did);
      setOrbisUser(res.did);
      setSignedInUser("orbis");
      setDid(res.did);
    } else {
      console.log("Error connecting to Ceramic: ", res);
      //alert("Error connecting to Ceramic.");
    }
  }
    
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const handleClose = async () => {
    showLoading();
    if (wallet) {
      await addInterestsToLens();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "🎉 Lens profile successfully personalized 🎉" });
    }
    else if (orbisUser || (signedInUser == "orbis")) {
      await addInterestsToOrbis();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "🎉 Orbis profile successfully personalized 🎉" });
    }
    setShow(false);
    hideLoading();
    setLensProfileSuccess(true);
    await delay(5000);
    setLensProfileSuccess(false);
    onShareOpen();
  }
  const handleShow = () => {
    setShow(true);
  }
  
  const handleChangeInterests = (e) => {
    console.log('in Index:')
    console.log(e)
    let newInterests:string[] = [];
    setUserInterests(newInterests);
    for (let i=0;i<e.length;i++)
    {
      newInterests.push(e[i].value);
    }
    setUserInterests(newInterests);
    setInterestsUpdated(true);
    console.log("INTERESTS UPDATED!!!");
  }

  const onShareOpen = async () => {
    setShare(true);
  }
  const onShareClose = () => {
    setShare(false);

    if (signedInUser == "lens") {
      const lensHandle = wallet?.handle.split(".");
      window.open(`${process.env.GATSBY_LENSTER_URL}/u/${lensHandle![0]}`,"_blank");
    }
    else if (signedInUser == "orbis") {
      window.open(`${process.env.GATSBY_ORBIS_URL}/profile/${did}`,"_blank");

    }
  }
  async function uploadJson(data: unknown){
    try {
      console.log("uploading post with data: "+ JSON.stringify(data));
      const response = await fetch(process.env.GATSBY_API_BASE_URL+'/permaweb/', {
        method: 'POST',
        body: JSON.stringify(data), 
        headers: new Headers({'content-type': 'application/json'})
      })
      console.log("got response from api");

      const json = await response.json()
      console.log(json.url);

      return json.url
    } catch(err) {
      console.log({ err })
    }
  }
  async function updateLensProfile(zkproof: string, platform: string, username: string){
    try {
      console.log("updating profile");
      const existingBio = wallet?.bio;
      let updatedBio = "";
      let updatedAttributes = {};
      if (existingBio == "" || existingBio == null) {
        updatedBio = `GM frens. My verified ${platform} proof: ${zkproof}. `;

        if (platform == process.env.GATSBY_TWITTER) {
          updatedAttributes = {
            location: "earth",
            website: "",
            x: "https://x.com/"+username,
          }
        }

        else if (platform == process.env.GATSBY_FACEBOOK) {
          updatedAttributes = {
            location: "earth",
            website: "www.facebook.com/"+username,
            x: ""
          }
        }
      }

      else {

        // check if both facebook and twitter have already been updated. return in that case.

        if (platform == process.env.GATSBY_TWITTER) {
          if (existingBio!.includes(`${process.env.GATSBY_TWITTER}`)) {
            console.log("Twitter is already verified. Returning");
            return -1;
          }
          // only update the extra verification that has been added
          updatedAttributes = {
            x: "https://x.com/"+username  
          }
        }
        else if (platform == process.env.GATSBY_FACEBOOK) {
          if (existingBio!.includes(`${process.env.GATSBY_FACEBOOK}`)) {
            console.log("Facebook is already verified. Returning");
            return -1;
          }
          // only update the extra verification that has been added
          updatedAttributes = {
            website: "www.facebook.com/"+username,
          }
        }
        updatedBio = existingBio + `My verified ${platform} proof: ${zkproof}`;
      }
      const name = username;
      const bio = updatedBio;
      const attributes = updatedAttributes;
      await update({ name, bio, attributes });
      console.log("Profile updated");      
    } catch(err) {
      console.log({ err })
      hideLoading();
    }
  }
  async function updateOrbisProfile(zkproof: string, platform: string, name: string) {
    try {
      console.log("updating profile");
      const { data, error } = await orbis.getProfile(did);
      console.log(JSON.stringify(data));
      const existingBio = data?.details.profile.description;
      let updatedBio = "";
      if (!existingBio) {
        updatedBio = `GM frens. My verified ${platform} proof: ${zkproof}. `;
      }

      else {

        // check if both facebook and twitter have already been updated. return in that case.
        if (platform == process.env.GATSBY_TWITTER) {
          if (existingBio!.includes(`${process.env.GATSBY_TWITTER}`)) {
            console.log("Twitter is already verified. Returning");
            return -1;
          }
        }
        else if (platform == process.env.GATSBY_FACEBOOK) {
          if (existingBio!.includes(`${process.env.GATSBY_FACEBOOK}`)) {
            console.log("Facebook is already verified. Returning");
            return -1;
          }
        }
        updatedBio = existingBio + `My verified ${platform} proof: ${zkproof} `;
      }

      const res = await orbis.updateProfile({username:name, description: updatedBio});
      console.log(res);

    }
    catch (err) {
      console.log(err);
    }
  }

  async function createLensPost(zkproof: string, platform: string, username: string) {

      const postContent = "Gm folks! \n"+
                          "I just connected my " + platform + " with username "+ username + " \n" +
                          "View my zk proof verification on etherscan: " + zkproof +" \n" + 
                          userInformation +
                          "Let's make social media sovereign!"; 
      try {
        if ( wallet == null || undefined)
        //showLoading();
        console.log(userInformation);
        const result = await create({
          content: postContent,
          contentFocus: ContentFocus.TEXT_ONLY,
          locale: 'en',
        })
        return result.toString();
      }
      catch(err) {
        console.log(""+ err);
        hideLoading();
        alert(`Could not create profile due to: ${err}`);
      }
    
    hideLoading();
  }

  async function createOrbisPost(zkproof: string, platform: string, username: string) {
    const postContent = "Gm folks! \n"+
    "I just connected my " + platform + " with username "+ username + " \n" +
    "View my zk proof verification on etherscan: " + zkproof +" \n" + 
    userInformation +
    "Let's make social media sovereign!";
    /** Add the results in a media array used when sharing the post (the media object must be an array) */
    const res = await orbis.createPost({
      body: postContent,
    });
    console.log(res);
    hideLoading();
  }

  async function addInterestsToLens() {

    console.log("In add interests");
    const lensClient = new LensClient({
      environment: development
    });

    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      console.log("connected");

      const wallet = walletClient.account;
      const address = wallet.address;
      const challenge = await lensClient.authentication.generateChallenge(address);
      console.log(challenge);
      const signature = await walletClient.signMessage({account: address,message: challenge});
      await lensClient.authentication.authenticate(address, signature);
      console.log ("is client authenticated? " + await lensClient.authentication.isAuthenticated());
        // check the state with
      const allOwnedProfiles = await lensClient.profile.fetchAll({
        ownedBy: [address],
        limit: 1,
      });
      
      console.log("all owned profiles: ");
      console.log(allOwnedProfiles);
      const defaultProfile = allOwnedProfiles.items[0];

      try {
        const profileId = defaultProfile.id;
        console.log("Profile interests were: "+await lensClient.profile.allInterests());
        // add interests
        console.log(userInterests);

        await lensClient.profile.addInterests({
          interests: userInterests,
          profileId,
        });
        console.log(defaultProfile);
      }
      catch(err) {
        console.log(""+ err);
        hideLoading();
        alert(`Could not create profile due to: ${err}`);
        }
    }
    else {
      alert("Please login first");
    }
    
  }

  async function addInterestsToOrbis() {
    try {
      const { data, error } = await orbis.getProfile(did);
      console.log(JSON.stringify(data));
      const name = data.details.profile.username;
      const updatedBio = data.details.profile.description;
      const res = await orbis.updateProfile({username:name, description: updatedBio, data: {interests:userInterests}});
    }
    catch (error) {
      console.log(error);
    }
  }

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const loginTwitter = async () => {
    if (isTwitterConnected) {
      alert("Twitter is already verified");
      return;
    }

    // get twitter
    if (wallet && !wallet.dispatcher)
      await updateDispatcher({ enabled: true });
    await getTwitterID();
  };

  const portProfileToWeb3 = async (profileType:string, username: string) => {
    try {
      let groupId; 
      if (profileType == process.env.GATSBY_FACEBOOK)
        groupId = process.env.GATSBY_FACEBOOK_GROUP_ID!;
      else if (profileType == process.env.GATSBY_TWITTER)
        groupId = process.env.GATSBY_TWITTER_GROUP_ID!;

      if (wallet || (signedInUser == "lens")) {

        console.log(`Connecting ${profileType} with lens`);
        console.log("Chain name is: "+ chain!.name);
        if (chain!.name !== "Polygon Mumbai") {
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Please connect your Metamask to Polygon Mumbai Testnet\nhttps://chainlist.org/chain/80001" });
        return -1;
        }

        // get commitment
        showLoading();

        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Posting user's commitment on chain" });
        const res =  await getCommitment(profileType, groupId);
        
        if (!res) {
                    hideLoading();
                    dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User rejected the authentication request." });
                    return -1;
        }
        else {
          
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User's authentication commitment is now on chain" });

          // get zk
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Verifying zk proof on chain..." });
          const result = await getZkProof(profileType, groupId);

          if (result !== "") {
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation ownership proved" });
          }
          else
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation invalid" });

          // port to lens
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Creating verification post on lens" });
          await createLensPost(result, profileType, username);

          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Updating lens profile to match your web2 profile data" });
          await updateLensProfile(result, profileType, username);
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Profile updated" });
                
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Personalizing lens profile by adding your interests" });
          handleShow();
          hideLoading();
          }
        }
      else if (orbisUser || (signedInUser == "orbis")) {
        if (!orbisUser) {
          showLoading();
          await orbisConnect();
          hideLoading();
        }
        console.log(`Connecting ${profileType} with orbis`);
        console.log("Chain name is: "+ chain!.name);
        if (chain!.name !== "Ethereum") {
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Please connect your Metamask to Ethereum Mainnet \nhttps://chainlist.org/chain/1" });
          //throw new Error("Incorrect network"); 
          return -1; 
        }
  
        // get commitment
        showLoading();
  
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Posting user's commitment on chain" });
        const res =  await getCommitment(profileType, groupId);
        
        if (!res) {
          hideLoading();
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User rejected the authentication request." });
          return -1;
        }
        else {
            
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User's authentication commitment is now on chain" });
  
          // get zk
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Verifying zk proof on chain..." });
          const result = await getZkProof(profileType, groupId);
  
          if (result !== "") {
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation ownership proved" });
          }
          else
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation invalid" });
  
          // port to orbis
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Creating verification post on orbis" });
          await createOrbisPost(result, profileType, username);
  
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Updating orbis profile to match your web2 profile data" });
          await updateOrbisProfile(result, profileType, username);
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Profile updated" });
                
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Personalizing orbis profile by adding your interests" });
          handleShow();
          hideLoading();

        }
      }
    }
    catch (err)
    {
      console.log(err);
      hideLoading();
    }
    hideLoading();
  };



  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const twitter = async () => {
    const params = new URLSearchParams(window.location.search)
    const username = params.get('username')!;
    const platform = params.get('id_platform')!;

    if (!isTwitterUseEffectCalled && username!=null && platform == process.env.GATSBY_TWITTER) {
      setTwitterUseEffectCalled(true);
      const interests = getTwitterInterestsForLens(username);
      setUserInterests(interests);
      setUserInterestsLabels(translateInterests(interests));
      const res = await portProfileToWeb3(platform, username);
      if (res != -1)
        setTwitterConnected(true);
    }
 }

  useEffect(() => {
    //use effect for twitter with lens
    if (signedInUser == "orbis") {
      return;
    }

    if ((signedInUser == "lens") && !wallet)  {
      return;
    }
    if ( signedInUser  && !isTwitterConnected && !isTwitterUseEffectCalled) {      
      twitter().catch(console.error);
    }
  }, [wallet])

  useEffect(() => {
    //use effect for twitter with orbis
    if (signedInUser == "lens") {
      return;
    }

    if ( signedInUser && !isTwitterConnected && !isTwitterUseEffectCalled) {      
      twitter().catch(console.error);
    }
  }, [])

  useEffect(() => {

    // use effect for facebook
    (window as any).fbAsyncInit = function() {
      (window as any).FB.init({
        appId            : '696970245672784',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v18.0'
      });

      (window as any).FB.AppEvents.logPageView();   


      (window as any).FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
      });
        
    };

    (function(d, s, id) {
      let js, fjs: any = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));  
  }, [])


    function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
      console.log('statusChangeCallback');
      console.log(response);                   // The current login status of the person.
      if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        testAPI();  
      } else {                                 // Not logged into your webpage or we are unable to tell.
        console.log('Please log ' +
          'into this webpage.');
      }
    }

    function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
      console.log('Welcome!  Fetching your information.... ');
      (window as any).FB.api('/me?fields=name,picture,gender,inspirational_people,languages,meeting_for,quotes,significant_other,sports, music, photos, age_range, favorite_athletes, favorite_teams, hometown, feed, likes', function(response) {
        console.log('Successful login for: ' + response.name);
        
        //setUserInterests(getFacebookInterestsForLens(response));
        const interests = getFacebookInterestsForLens(response);
        setUserInterests(interests);
        setUserInterestsLabels(translateInterests(interests));
        //setUserInformation(getFacebookInformationForLens(response));
        (window as any).FB.api(
          `/${response.id}`,
          function (response) {
            console.log(response);
            if (response && !response.error) {
              /* handle the result */
              console.log("Result from me: ");
              console.log(response);
              //setFacebookConnected(true);
            }
          }
      );
      });
    }

  const responseFacebook = async (response) => {
    console.log(response);
    const accessToken = response.accessToken;
    console.log("Access token is: "+accessToken);

    const interests = getFacebookInterestsForLens(response);
     setUserInterests(interests);
     setUserInterestsLabels(translateInterests(interests));
    //setUserInformation(getFacebookInformationForLens(response));
    if (wallet && !wallet.dispatcher)
      await updateDispatcher({ enabled: true });

    try {
      const res = await portProfileToWeb3(process.env.GATSBY_FACEBOOK!, response.name);
      if (res != -1)
        setFacebookConnected(true);
    }
    catch (err) {
      console.log(err);
    }
    hideLoading();
  };

  let handle = "";
  if (signedInUser == "lens")
    handle = `${process.env.GATSBY_LENSTER_URL}/u/${wallet?.handle.split(".")[0]}`;
  else if (signedInUser == "orbis") {
    handle = `${process.env.GATSBY_ORBIS_URL}/profile/${did}`;
  }
  return (
    <Container>
      
      <Heading>
        Join web3 social using <Span>Plurality</Span>
      </Heading>
      <Subtitle>
      Connect your web2 socials and bring your reputation with you! 
      </Subtitle>
        {/*{!hidden && (
          <Message>
          Connecting on chain...
          </Message>
        )}*/}
      {state.infoMessage && (
        <Notice>
          <b> <Subtitle>{state.infoMessage} </Subtitle></b>
          </Notice>
        )}
      
      <ModalBoxInterests show={show} handleClose={handleClose} onChange={handleChangeInterests} userInterests={userInterestsLabels}/>
      <ShareModal share={share} handle={handle} handleClose={onShareClose}></ShareModal>
      {lensProfileSuccess && (
        <Confetti tweenDuration= { 2000 } width={width} height={height} />
      )}
      
      <CardContainer style={{ justifyContent: Boolean(state.installedSnap) ? "center": "flex-start" }}>

        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {/* Workflow Step 0:  Install Flask */}
        {!signedInUser && !isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}

        {/* Workflow Step 0: Connect MetaMask Snap */}
        {!signedInUser && !state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to Plurality snap',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}

      {/* Workflow Step 1: Sign in to lens */}
      {!signedInUser && isMetaMaskReady && state.installedSnap && (
          <Card
          content={{
            title: 'Lens',
            description:
              'Onboard to web3 social Lens.',
            button: (
              <Authentication/>
            ),
          }}
          disabled={!state.installedSnap || !isMetaMaskReady}
        />

        )}

      {/* Workflow Step 1: Sign in to orbis */}
      {!signedInUser && isMetaMaskReady && state.installedSnap && (
          <Card
          content={{
            title: 'Orbis',
            description:
              'Onboard to web3 social Orbis',
            button: (
              <Button
              disabled={!state.installedSnap || !isMetaMaskReady}
              onClick={orbisConnect}
              >  Connect
              </Button>
            ),
          }}
          disabled={!state.installedSnap || !isMetaMaskReady}
        />
        )}
        {/* Workflow Step 1: Sign in to farcaster */}
        {!signedInUser && isMetaMaskReady && state.installedSnap && (
          <Card
          content={{
            title: 'Farcaster',
            description:
              'Onboard to web3 social Farcaster',
            button: (
              <Button
                disabled={ true }
                //onClick={onAfterOAuthLoginClick}
              >  Coming Soon
              </Button>
            ),
          }}
          disabled={ true }
        />
        )}
        {!signedInUser && isMetaMaskReady && state.installedSnap && (
          <Card
          content={{
            title: 'Friend.tech',
            description:
              'Onboard to web3 social Friend.tech',
            button: (
              <Button
                disabled={ true }
                //onClick={onAfterOAuthLoginClick}
              >  Coming Soon
              </Button>
            ),
          }}
          disabled={ true }
        />
        )}

      {/* Workflow Step 2: Connect twitter */}
        {((signedInUser && isMetaMaskReady) || !state.installedSnap) && (
          <Card
          content={{
            title: 'Twitter (X)',
            description:
              'Connect your twitter profile to your web3 socials',
            button: (
              <Button
                onClick={loginTwitter}
                disabled={!isMetaMaskReady || !state.installedSnap || isTwitterConnected}
              > Verify Profile
              </Button>
            ),
          }}
          connected={ isTwitterConnected }
          disabled={!state.installedSnap || !isMetaMaskReady || isTwitterConnected}
        />

        )}
      
      {/* Workflow Step 2: Connect Facebook */}
        {((signedInUser && isMetaMaskReady)|| !state.installedSnap) && (
          <Card
          content={{
            title: 'Facebook',
            description:
              'Connect your Facebook profile to your web3 socials.',
            button: (
              <FacebookLogin
              appId="696970245672784"
              autoLoad={false}
              fields="name,picture,gender,inspirational_people,languages,meeting_for,quotes,significant_other,sports, music, photos, age_range, favorite_athletes, favorite_teams, hometown, feed, likes "
              callback={responseFacebook}
              scope="public_profile, email, user_hometown, user_likes, user_friends, user_gender, user_age_range"
              render={renderProps => (
                <button onClick={renderProps.onClick} 
                disabled={!state.installedSnap || !isMetaMaskReady || isFacebookConnected}
                >Verify Profile</button>
              )}
            />
            ),
          }}
          connected={ isFacebookConnected }
          disabled={!state.installedSnap || !isMetaMaskReady || isFacebookConnected}
        />
        )}

        {/* Workflow Step 2: Connect TikTok */}
        {((signedInUser && isMetaMaskReady)|| !state.installedSnap) && (
          <Card
          content={{
            title: 'TikTok',
            description:
              'Connect your TikTok profile to your web3 socials.',
            button: (
              <Button
                //onClick={loginTwitter}
                disabled={true}
              >  Coming Soon
              </Button>
            ),
          }}
          disabled={true}
        />

        )}
        {((signedInUser && isMetaMaskReady)|| !state.installedSnap) && (
          <Card
          content={{
            title: 'Instagram',
            description:
              'Connect your Instragram profile to your web3 socials.',
            button: (
              <Button
                //onClick={onBeforeOAuthLoginClick}
                disabled={true}
              >  Coming Soon
              </Button>
            ),
          }}
          disabled={true}
        />

        )}

        
        {/*{state.infoMessage && (
          <Message>
            <b> {state.infoMessage}</b>
          </Message>
        )}*/}


      </CardContainer>

        
    </Container>

  );
};

export default Index;


