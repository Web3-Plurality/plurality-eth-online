import { ContentFocus, DuplicatedHandleError, useActiveProfile,  useCreatePost, useCreateProfile, useUpdateDispatcherConfig, useUpdateProfileDetails, useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useContext,  useEffect, useState} from 'react';
import LoadingContext from './LoadingContext';
import { useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'react-bootstrap';
import { MetaMaskContext, MetamaskActions } from '../hooks/MetamaskContext';
import { Orbis } from "@orbisclub/orbis-sdk";


export function AuthenticationOrbis() {

    const { showLoading, hideLoading } = useContext(LoadingContext);
    // orbis hooks
    const [orbisUser, setOrbisUser] = useState();
    const [orbis, setOrbis] = useState(new Orbis({}));
  
    /** Calls the Orbis SDK and handles the results */
    async function orbisConnect() {
      showLoading();
      const res = await orbis.connect_v2({ chain: "ethereum", lit: false });
      console.log(orbis);
      alert(res.did);
      localStorage.setItem("signedInUser", "orbis");
      /** Check if the connection is successful or not */
      if(res.status == 200) {
        console.log(res.did);
        setOrbisUser(res.did);
        localStorage.setItem("signedInUser", "orbis");
        localStorage.setItem("did", res.did);
      } else {
        console.log("Error connecting to Ceramic: ", res);
        alert("Error connecting to Ceramic.");
      }
      hideLoading();
    }
  
    return (
  
      <div>
        
        {!orbisUser && (
          <Button
            onClick={orbisConnect}
          >
            Connect
          </Button>
          
        )}
        {orbisUser && (
          <Button
            onClick={orbisConnect}
          >
            Sign out
          </Button>
        )}
      </div>
    );
  }