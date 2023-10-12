import { ContentFocus, DuplicatedHandleError, useActiveProfile,  useCreatePost, useCreateProfile, useUpdateDispatcherConfig, useUpdateProfileDetails, useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useContext,  useEffect, useState} from 'react';
import LoadingContext from '../components/LoadingContext';
import { useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'react-bootstrap';
import { MetaMaskContext, MetamaskActions } from '../hooks/MetamaskContext';


export function Authentication() {
    const { execute: login, isPending: isLoginPending } = useWalletLogin();
    const { data: wallet, loading } = useActiveProfile();
    const { execute: logout } = useWalletLogout();
    const { isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const { execute, isPending } = useCreateProfile();  
    const [registerProfile, isRegisterProfile] = useState(false);
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const [state, dispatch] = useContext(MetaMaskContext);

    const { chain, chains } = useNetwork();
    const {
      execute: updateDispatcher,
      error: errorDispatcher,
      isPending: isPendingDispatcher,
    } = useUpdateDispatcherConfig({ profile: wallet! });
  
    async function createLensProfile (handle:string): Promise<string>  {
      try {
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Trying to create lens profile with handle: "+handle });
        console.log("Trying to create lens profile with handle: "+handle);
        const result = await execute({ handle });
   
        if (result.isSuccess()) {
          window.location.reload();
          return "SUCCESS";
        }
   
        switch (result.error.constructor) {
          case DuplicatedHandleError:
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Handle already taken" });
            console.log("Handle already taken");
            return "DUPLICATE"
          default:
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: `Could not create profile due to: ${result.error.message}` });
            alert(`Could not create profile due to: ${result.error.message}`);
            return "ERROR";
        }
      } catch (e) {
        console.error(e);
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: `Could not create profile due to: ${e}` });
        alert(`Could not create profile due to: ${e}`);
      }
      return "";
    };
  
    const { connectAsync } = useConnect({
      connector: new InjectedConnector(),
    });
  
    const onLoginClick = async () => {

      //TODO: Check if this check is actually required
      if (chain!.name !== "Polygon Mumbai") {
        dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Please connect your Metamask to Polygon Mumbai Testnet\nhttps://chainlist.org/chain/80001" });
        return;
      }
      dispatch({ type: MetamaskActions.SetInfoMessage, payload: "Signing in your lens profile" });
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
            dispatch({ type: MetamaskActions.SetInfoMessage, payload: "No lens profile found with this address. Creating one.." });
            let username = window.prompt("Please provide your preferred lens handle");
            const response = await createLensProfile(username!);
            if (response == "DUPLICATE")
            {
              dispatch({ type: MetamaskActions.SetInfoMessage, payload: "The lens handle matching your preferred username is already taken. Adding some randomness for uniqueness" });
              const min = 1;
              const max = 100000;
              let rand = min + Math.floor(Math.random() * (max - min));
              username=username!+rand;
              await createLensProfile(username);
            }
          }
          dispatch({ type: MetamaskActions.SetInfoMessage, payload: "" });
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
      
        {!wallet && !loading && (
          <Button
            disabled={isLoginPending}
            onClick={onLoginClick}
          >
            Sign in
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