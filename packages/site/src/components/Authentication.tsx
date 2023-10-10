import { ContentFocus, DuplicatedHandleError, useActiveProfile,  useCreatePost, useCreateProfile, useUpdateDispatcherConfig, useUpdateProfileDetails, useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useContext,  useEffect, useState} from 'react';
import LoadingContext from '../components/LoadingContext';
import { useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'react-bootstrap';


export function Authentication() {
    const { execute: login, isPending: isLoginPending } = useWalletLogin();
    const { data: wallet, loading } = useActiveProfile();
    const { execute: logout } = useWalletLogout();
    const { isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const { execute, isPending } = useCreateProfile();  
    const [registerProfile, isRegisterProfile] = useState(false);
    const { showLoading, hideLoading } = useContext(LoadingContext)
  
    const { chain, chains } = useNetwork();
  
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
        alert(`Could not create profile due to: ${e}`);
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