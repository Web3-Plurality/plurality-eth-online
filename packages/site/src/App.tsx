import { FunctionComponent, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { Footer, Header } from './components';

import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';
import Spinner from './components/Spinner';
import LoadingProvider from './components/LoadingProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tos from "./pages/tos";
import Privacy from "./pages/privacy";
import Ddi from "./pages/ddi";
import Profile from './pages/profile'
import Advertiser from './pages/advertiser';
import Advertisement from './pages/advertisement';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);

  return (
    <>
      <GlobalStyle />
      <LoadingProvider>
      <Spinner />

      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
        <Router>
          <Routes>
            <Route path="/" element={children}></Route>
            <Route path="/terms-of-service" element={<Tos />}></Route>
            <Route path="/privacy-policy" element={<Privacy />}></Route>
            <Route path="/data-delete-instructions" element={<Ddi />}></Route>
            <Route path="/advertise" element={<Advertiser />}></Route>
            <Route path="/myAds" element={<Advertisement />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </Router>
        <Footer />
      </Wrapper>
      </LoadingProvider>

    </>
  );
};
