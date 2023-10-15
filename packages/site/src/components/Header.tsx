import styled, { useTheme } from 'styled-components';
import { getThemePreference } from '../utils';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';

import {
  useWalletLogout,
  useActiveProfile,
} from "@lens-protocol/react-web";
import useLocalStorageState from 'use-local-storage-state';




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
    const { execute: logout } = useWalletLogout();  
    const [signedInUser, setSignedInUser, { removeItem: removeSignedInUser }] = useLocalStorageState('signedInUser', {defaultValue: ""});
    const [did, setDid, { removeItem: removeDid }] = useLocalStorageState('did', {defaultValue: ""});
    const [rejectDouble, setRejectDouble, { removeItem: removeReject}] = useLocalStorageState('rejectDouble', {defaultValue: ""});
    const [isFacebookConnected, setFacebookConnected, { removeItem: removeFacebookConnected}] = useLocalStorageState('isFacebookConnected', {defaultValue: false});
    const [isTwitterConnected, setTwitterConnected, { removeItem: removeTwitterConnect}] = useLocalStorageState('isTwitterConnected', {defaultValue: false});

    const removeEntireLocalState = async() => {
      removeSignedInUser();
      removeDid();
      removeReject();
      removeFacebookConnected();
      removeTwitterConnect();
    }
    const onLogoutClick = async () => {


      // set the signed in user to null no matter which signout is happening
      //localStorage.clear();
      //TODO: Remove all localstorage states
      await removeEntireLocalState();

      if (signedInUser == "lens") {
        logout();
      }
      else if (signedInUser == "orbis") {
        // nothing extra required
      }

      //TODO: Check that the redirection only happens if it is on the twitter url
      const str: string = process.env.GATSBY_UI_BASE_URL!;
      const url = str.endsWith('/') ? str.slice(0, -1) : str;
      window.location.assign(url);
    }

    return (
      <div >
        {((signedInUser == "lens") || (signedInUser == "orbis")) && (
          <div>
            <Button onClick={onLogoutClick}>
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
  const [signedInUser, setSignedInUser] = useLocalStorageState('signedInUser', {defaultValue: ""});
  const [did, setDid] = useLocalStorageState('did', {defaultValue: ""});

  let profile = "";
  let handle = "";
  if (signedInUser == "lens") {
    const lensHandle = wallet?.handle.split(".");
    handle = lensHandle ? lensHandle[0] : "";
    if (lensHandle)
    {
      profile = process.env.GATSBY_LENSTER_URL+"/u/"+lensHandle![0];
    }
  }
  else if (signedInUser == "orbis") {
    profile = process.env.GATSBY_ORBIS_URL+"/profile/"+did;
    handle = did;
  }
  const theme = useTheme();  
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>Plurality</Title>
      </LogoWrapper>
      <RightContainer>
        <a href={profile}><b> {handle} </b></a>
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