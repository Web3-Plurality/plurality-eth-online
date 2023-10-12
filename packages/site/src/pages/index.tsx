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
import FacebookLogin from 'react-facebook-login';
import { LensClient, development } from "@lens-protocol/client";
import { getTwitterInformationForLens, getTwitterInterestsForLens } from '../utils/twitterUserInterest';
import { getFacebookInformationForLens, getFacebookInterestsForLens } from '../utils/facebookUserInterest';
import { Authentication } from '../components/Authentication';


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
  const [hidden, isHidden] = useState(true);
  const [isFacebookConnected, setFacebookConnected] = useState(false);
  const [isTwitterConnected, setTwitterConnected] = useState(false);

  const { showLoading, hideLoading } = useContext(LoadingContext)
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { data: wallet, loading } = useActiveProfile();

  const { execute: create, error, isPending: isPendingCreatePost } = useCreatePost({ publisher: wallet!, upload: uploadJson });
  const { execute: update, error: updateError, isPending: isUpdatePending } = useUpdateProfileDetails({
    profile: wallet!,
    upload: uploadJson
  });
  const {
    execute: updateDispatcher,
    error: errorDispatcher,
    isPending: isPendingDispatcher,
  } = useUpdateDispatcherConfig({ profile: wallet! });
  const { chain, chains } = useNetwork();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [userInformation, setUserInformation] = useState("");
  
  
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;



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
  async function updateProfile(){
    try {
      console.log("updating profile");
      const params = new URLSearchParams(window.location.search)
      const username = params.get('username')!;

      const name = username;
      const bio = `Hi, I'm <a href="www.google.com"/> ${username} </a>`;
      const attributes = {
        location: "earth",
        website: "",
        x: "https://x.com/"+username,
        test: "https://google.com"
      };
      showLoading();
      await update({ name, bio, attributes });
      hideLoading();
      console.log("Profile updated");
      alert("Taking you to your lens profile");
      const lensHandle = wallet?.handle.split(".");
      window.location.replace(`${process.env.GASTBY_LENSTER_URL}/u/${lensHandle![0]}`);
      
    } catch(err) {
      console.log({ err })
      hideLoading();
    }
  }

  async function createPost(zkproof: string, platform: string, username: string) {

    const postContent = "Gm folks! \n"+
                        "I just connected my " + platform + " with username "+ username + " \n" +
                        "View my zk proof verification on etherscan: " + zkproof +" \n" + 
                        userInformation +
                        "Let's make social media sovereign!"; 
    try {
      //alert("Posting with: "+ userInformation);

      if ( wallet == null || undefined)
        alert("Wallet is null");
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

  async function addInterests() {

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
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const loginTwitter = async () => {
    // get twitter
    if (wallet && !wallet.dispatcher)
      await updateDispatcher({ enabled: true });
    await getTwitterID();
  };



  const portProfileToLens = async (profileType:string, username: string) => {

    try {
      console.log(`Connecting ${profileType} with lens`);
      if (chain!.name !== "Polygon Mumbai") {
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Please connect your Metamask to Polygon Mumbai Testnet\nhttps://chainlist.org/chain/80001" });
        return;
      }

    let groupId; 
    if (profileType == process.env.GATSBY_FACEBOOK)
      groupId = process.env.GATSBY_FACEBOOK_GROUP_ID!;
    else if (profileType == process.env.GATSBY_TWITTER)
      groupId = process.env.GATSBY_TWITTER_GROUP_ID!;


    // get commitment
    showLoading();

    dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Posting user's commitment on chain" });
    const res =  await getCommitment(profileType, groupId);
    
    if (!res) {
      hideLoading();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User rejected the authentication request." });
    }
    else {
        
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User's authentication commitment is now on chain" });
      //hideLoading();

      // get zk
      showLoading();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Verifying zk proof on chain..." });
      const result = await getZkProof(profileType, groupId);
      //hideLoading();

      if (result !== "") {
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation ownership proved" });
      }
      else
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation invalid" });
      
      // port to lens
      //showLoading();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Personalizing lens profile by adding your interests" });
      await addInterests();
      //hideLoading();
      
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Creating verification post on lens" });
      await createPost(result, profileType, username);

      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Updating lens profile to match your web2 profile data" });
      await updateProfile();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Profile updated" });
      hideLoading();
      }
    }
    catch (err)
    {
      hideLoading();
      alert(err);
    }
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

  useEffect(() => {
    //use effect for twitter
    // get the proof request params for this popup
    const params = new URLSearchParams(window.location.search)
    const username = params.get('username')!;
    const platform = params.get('id_platform')!;

    const twitter = async () => {
     setUserInterests(getTwitterInterestsForLens(username));
     //setUserInformation(getTwitterInformationForLens(username));
     await portProfileToLens(platform, username);
   }

    if (wallet && username!=null && platform == process.env.GATSBY_TWITTER && !isTwitterConnected) {
       twitter().catch(console.error);
       setTwitterConnected(true);
    }
  }, [wallet])

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
        //alert('Thanks for logging in, ' + response.name + '!');
        
        setUserInterests(getFacebookInterestsForLens(response));
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
    setUserInterests(getFacebookInterestsForLens(response));
    //setUserInformation(getFacebookInformationForLens(response));
    if (wallet && !wallet.dispatcher)
      await updateDispatcher({ enabled: true });
    await portProfileToLens(process.env.GATSBY_FACEBOOK!, response.name);
    setFacebookConnected(true);
    hideLoading();
  };


  return (
    <Container>
      <Heading>
        Join web3 social using <Span>Plurality</Span>
      </Heading>
      <Subtitle>
      Connect your web2 socials and bring your reputation with you! 
      </Subtitle>
        {!hidden && (
          <Message>
          Connecting on chain...
          </Message>
        )}
      {state.infoMessage && (
        <Notice>
          <b> <Subtitle>{state.infoMessage} </Subtitle></b>
          </Notice>
        )}

      <CardContainer style={{ justifyContent: Boolean(state.installedSnap) ? "center": "flex-start" }}>

        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {/* Workflow Step 0:  Install Flask */}
        {!isMetaMaskReady && (
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
        {!state.installedSnap && (
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
      {!wallet && isMetaMaskReady && (
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
      {!wallet && isMetaMaskReady &&(
          <Card
          content={{
            title: 'Orbis',
            description:
              'Onboard to web3 social Orbis',
            button: (
              <Button
                disabled={ true}
                //onClick={onAfterOAuthLoginClick}
              >  Sign in
              </Button>
            ),
          }}
          disabled={true}
        />
        )}
        {/* Workflow Step 1: Sign in to farcaster */}
        {!wallet && isMetaMaskReady && (
          <Card
          content={{
            title: 'Farcaster',
            description:
              'Onboard to web3 social Farcaster',
            button: (
              <Button
                disabled={ true }
                //onClick={onAfterOAuthLoginClick}
              >  Sign in
              </Button>
            ),
          }}
          disabled={ true }
        />
        )}

      {/* Workflow Step 2: Connect twitter */}
        {wallet && (
          <Card
          content={{
            title: 'Twitter (X)',
            description:
              'Connect your twitter profile to your web3 socials',
            button: (
              <Button
                onClick={loginTwitter}
                disabled={!isMetaMaskReady || !state.installedSnap}
              > Login with X
              </Button>
            ),
          }}
          connected={ isTwitterConnected }
          disabled={!state.installedSnap || !isMetaMaskReady || isTwitterConnected}
        />

        )}
      
      {/* Workflow Step 2: Connect Facebook */}
        {wallet && (
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
            />
            ),
          }}
          connected={ isFacebookConnected }
          disabled={!state.installedSnap || !isMetaMaskReady || isFacebookConnected}
        />
        )}

        {/* Workflow Step 2: Connect TikTok */}
        {wallet && (
          <Card
          content={{
            title: 'TikTok',
            description:
              'Connect your TikTok profile to your web3 socials.',
            button: (
              <Button
                //onClick={loginTwitter}
                disabled={true}
              >  Authenticate
              </Button>
            ),
          }}
          disabled={!state.installedSnap || !isMetaMaskReady}
        />

        )}
        {wallet && (
          <Card
          content={{
            title: 'Instagram',
            description:
              'Connect your Instragram profile to your web3 socials.',
            button: (
              <Button
                //onClick={onBeforeOAuthLoginClick}
                disabled={true}
              >  Authenticate
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


