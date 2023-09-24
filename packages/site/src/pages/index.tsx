import { useContext, createContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  getCommitment,
  getZkProof,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { getTwitterID } from '../utils/oauth';
import { ContentFocus, DuplicatedHandleError, ProfileOwnedByMe, useActiveProfile, useActiveWallet, useCreatePost, useCreateProfile, useUpdateProfileDetails, useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'react-bootstrap';
import { generateProof } from '@semaphore-protocol/proof';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import LoadingOverlay from 'react-loading-overlay-ts';
import LoadingContext from '../components/LoadingContext';
import Spinner from '../components/Spinner';
  
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


export function Authentication() {
  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { data: wallet, loading } = useActiveProfile();
  const { execute: logout } = useWalletLogout();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { execute, isPending } = useCreateProfile();  
  const [registerProfile, isRegisterProfile] = useState(false);
  const { showLoading, hideLoading } = useContext(LoadingContext)

  async function createLensProfile (handle:string): Promise<string>  {
    try {
      console.log("Trying to create lens profile with handle: "+handle);
      const result = await execute({ handle });
 
      if (result.isSuccess()) {
        //alert("Please refresh the browser to sign in!");
        window.location.reload();
        isRegisterProfile(false);
        return "SUCCESS";
      }
 
      switch (result.error.constructor) {
        case DuplicatedHandleError:
          console.log("Handle already taken");
          isRegisterProfile(false);
          return "DUPLICATE"
        default:
          alert(`Could not create profile due to: ${result.error.message}`);
          isRegisterProfile(false);
          return "ERROR";
      }
    } catch (e) {
      console.error(e);
    }
    return "";
  };

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    showLoading();
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();

      try {
      const result = await login({
        address: walletClient.account.address,
      });
      if (result.isSuccess()) {
        if (result.value == null)
        {
          isRegisterProfile(true);
          alert("No lens profile found. Creating one..");
            const params = new URLSearchParams(window.location.search)
            let username = params.get('username')!;
            const response = await createLensProfile(username);
            if (response == "DUPLICATE")
            {
              alert("The lens handle matching your twitter username is already taken. Trying a new random handle");
              const min = 1;
              const max = 100000;
              let rand = min + Math.floor(Math.random() * (max - min));
              username=username+rand;
              await createLensProfile(username);
            }
        }
      } else {
        alert(result.error.message);
        hideLoading();
      }
      }
      catch (err) {
        alert(err);
        hideLoading();
      }
    }
    hideLoading();
  };

  return (

    <div>

      {loading && <p>Loading...</p>}
    
      {!wallet && !loading && !registerProfile && (
        <Button
          disabled={isLoginPending}
          onClick={onLoginClick}
        >
          Sign in with lens
        </Button>
        
      )}
      
      {wallet && !loading && (
        <div>
          <Button onClick={logout}>
            Sign out
          </Button>
          </div>
      )}
    </div>
  );
}

const Index = () => {
  const [hidden, isHidden] = useState(true);
  const { showLoading, hideLoading } = useContext(LoadingContext)

  const { data: wallet, loading } = useActiveProfile();

  const { execute: create, error, isPending: isPendingCreatePost } = useCreatePost({ publisher: wallet!, upload: uploadJson });
  const { execute: update, error: updateError, isPending: isUpdatePending } = useUpdateProfileDetails({
    profile: wallet!,
    upload: uploadJson
  });
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
      window.location.replace(`https://testnet.lenster.xyz/u/${lensHandle![0]}`);
      
    } catch(err) {
      console.log({ err })
      hideLoading();
    }
  }

  async function createPost(zkproof: string) {
    const params = new URLSearchParams(window.location.search)
    const username = params.get('username')!;
    const platform = params.get('id_platform')!;


    const postContent = "Gm folks! \n"+
                        "I just connected my " + platform + " with username "+ username + " \n" +
                        "View my zk proof verification on etherscan: " + zkproof +" \n" + 
                        "Let's make social media sovereign!"; 
    try {
      showLoading();
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

    }
    hideLoading();
  }
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onBeforeOAuthLoginClick = async () => {
    // get twitter
    await getTwitterID();
  };
  const onAfterOAuthLoginClick = async () => {
    try {
    // get commitment
    showLoading();
    dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Posting user's commitment on chain" });
    const res = await getCommitment();
    if (!res) {
      hideLoading();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User rejected the authentication request." });
    }
    else {
        
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "User's authentication commitment is now on chain" });
      hideLoading();

      // get zk
      showLoading();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Verifying zk proof on chain..." });
      const result = await getZkProof();
      hideLoading();

        if (result !== "") {
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation ownership proved" });
        }
        else
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Reputation invalid" });
      // port to lens

      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Creating verification post on lens" });
      await createPost(result);

      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Updating lens profile to match your twitter data" });
      await updateProfile();
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Profile updated" });
      }
    }
    catch (err)
    {
      hideLoading();
      alert(err);
    }
  };

  
  const [beforeOauth,setBeforeOauth] = useState(false);
  const [afterOauth, setAfterOauth] = useState(false);

  useEffect(() => {
    // get the proof request params for this popup
     const params = new URLSearchParams(window.location.search)
     const username = params.get('username')!;
   
     if (username!=null) 
        setAfterOauth(true);
    else 
      setBeforeOauth(true);
    
    }, [])
  
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

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


  return (
    <Container>
      <Heading>
        Onboard using <Span>Plurality</Span>
      </Heading>
      <Subtitle>
      Onboard your social profiles on chain
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
        {beforeOauth && (
          <Card
          content={{
            title: 'Onboard using Twitter(X)',
            description:
              'Onboard to web3 social media Lens using your Twitter profile.',
            button: (
              <Button
                onClick={onBeforeOAuthLoginClick}
                disabled={!isMetaMaskReady || !state.installedSnap}
              > Authenticate
              </Button>
            ),
          }}
          disabled={!state.installedSnap || !isMetaMaskReady}
        />

        )}
        {beforeOauth && (
          <Card
          content={{
            title: 'Onboard using Facebook',
            description:
              'Onboard to web3 social media Lens using your Facebook profile.',
            button: (
              <Button
                onClick={onBeforeOAuthLoginClick}
                disabled={true}
              >  Authenticate
              </Button>
            ),
          }}
          disabled={true}
        />

        )}
        {beforeOauth && (
          <Card
          content={{
            title: 'Onboard using Instagram',
            description:
              'Onboard to web3 social media Lens using your Instagram profile.',
            button: (
              <Button
                onClick={onBeforeOAuthLoginClick}
                disabled={true}
              >  Authenticate
              </Button>
            ),
          }}
          disabled={true}
        />

        )}
        {beforeOauth && (
          <Card
          content={{
            title: 'Onboard using LinkedIn',
            description:
              'Onboard to web3 social media Lens using your LinkedIn profile.',
            button: (
              <Button
                onClick={onBeforeOAuthLoginClick}
                disabled={true}
              >  Authenticate
              </Button>
            ),
          }}
          disabled={true}
        />

        )}

        {afterOauth && (wallet == null || wallet==undefined) && (
          <Card
          content={{
            title: 'Onboard using Twitter(X)',
            description:
              'Onboard to web3 social media Lens using your twitter profile.',
            button: (
                <Authentication/>
            ),
          }}
          disabled={!state.installedSnap || (wallet!=null && wallet!=undefined) || !isMetaMaskReady}
          fullWidth={
            Boolean(state.installedSnap) 
          }
        />

        )}


      {afterOauth && (wallet!=null && wallet!=undefined) && (
          <Card
          content={{
            title: 'Onboard using Twitter(X)',
            description:
              'Onboard to web3 social media Lens using your twitter profile.',
            button: (
              <Button
                disabled={!wallet}
                onClick={onAfterOAuthLoginClick}
              >  Connect profile to Lens
              </Button>
            ),
          }}
          disabled={!state.installedSnap || !wallet }
          fullWidth={
            Boolean(state.installedSnap) 
          }
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


