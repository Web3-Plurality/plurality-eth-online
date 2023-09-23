//"use client";
import { useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap } from '../utils';
import { HeaderButtons, SignInLensButton } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';

import {
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";



const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

let walletHandle = "";
export default function Authentication() {
  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { data: wallet, loading } = useActiveProfile();
  const { execute: logout } = useWalletLogout();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();

      await login({
        address: walletClient.account.address,
      });
    }
  };
  //walletHandle = wallet?.handle!;
  return (
    <div >
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
          {/*<p>{wallet.handle}</p>*/}
          <Button onClick={logout}>
            Sign out
          </Button>
          </div>
      )}
    </div>
  );
}


export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const { data: wallet, loading } = useActiveProfile();
  const lensHandle = wallet?.handle.split(".");
  let lensProfile = "";
  if (lensHandle)
    lensProfile = "https://testnet.lenster.xyz/u/"+lensHandle![0];
  const theme = useTheme();
  const [state, dispatch] = useContext(MetaMaskContext);

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
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>Plurality</Title>
      </LogoWrapper>
      <RightContainer>
        <a href={lensProfile}><b> {lensHandle} </b></a>
        &nbsp;
        &nbsp;
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
        &nbsp;
        <div><Authentication /></div>

      </RightContainer>
    </HeaderWrapper>
  );
};
