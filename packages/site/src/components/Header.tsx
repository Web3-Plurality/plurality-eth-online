//"use client";
import { FormEvent, useContext, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap } from '../utils';
import { HeaderButtons } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';
import { isValidHandle, useCreateProfile, DuplicatedHandleError, useUpdateDispatcherConfig } from '@lens-protocol/react-web';

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

  export function Signout() {
    const { data: wallet, loading } = useActiveProfile();
    const { execute: logout } = useWalletLogout();  
    return (
      <div >
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
   
export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const { data: wallet, loading } = useActiveProfile();
  const {
    execute: updateDispatcher,
    error: errorDispatcher,
    isPending: isPendingDispatcher,
  } = useUpdateDispatcherConfig({ profile: wallet! });
  
  const lensHandle = wallet?.handle.split(".");
  const handle = lensHandle ? lensHandle[0] : "";

  const setDispatcher = async () => {
    //TODO: Add dispatcher here
    await updateDispatcher({ enabled: true });
  }
  let lensProfile = "";
  if (lensHandle)
  {
    lensProfile = process.env.GASTBY_LENSTER_URL+"/u/"+lensHandle![0];
    /*if (wallet && !loading && !wallet.dispatcher)
      setDispatcher();*/
    
  }
  const theme = useTheme();  
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>Plurality</Title>
      </LogoWrapper>
      <RightContainer>
        <a href={lensProfile}><b> {handle} </b></a>
        &nbsp;
        &nbsp;
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        &nbsp;
        &nbsp;
        <div><Signout /></div>

      </RightContainer>
    </HeaderWrapper>
  );
};