import Modal from "@atlaskit/modal-dialog";
import Button from "@atlaskit/button";
import {
    FacebookShareButton,
    FacebookIcon,
    InstapaperShareButton,
    LinkedinShareButton,
    LinkedinIcon,
    MailruShareButton,
    PinterestShareButton,
    PinterestIcon,
    PocketShareButton,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    TumblrShareButton,
    TwitterShareButton,
    TwitterIcon,
    ViberShareButton,
    WhatsappShareButton,

  } from "react-share";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styled from "styled-components";
import { Fragment, useState } from "react";

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;
export function ShareModal( props: any ) {
    const message: string = "GM Frens, I just created my first web3 social profile through plurality. Click the link below to join my social network. Would love to see you there! " + props.handle;

    return (
        <Fragment>
        { props.share ? (
        <Modal onClose={props.handleClose}>
            <div style={{textAlign:'center'}}>
            <br />
            <Subtitle>Share with your network</Subtitle>
            <p>Share your personalized link with your network and earn rewards</p>
            <div style={{display: 'flex', flexDirection: 'column', width: '60%',overflow:'hidden', margin: 'auto'}}>
              {/* <input type="text" disabled={ true } placeholder={ props.handle } style={{textAlign:'center', overflow:'hidden', width:'60%'}}/> */}
              <textarea name="msgToShare" id="msgToShare" cols={30} rows={10} placeholder={ message } style={{resize: 'none'}} disabled></textarea>
              <CopyToClipboard text={ message } style={{width: '30%', margin: 'auto', marginTop: '15px', marginBottom: '10px'}}>
                <Button style={{marginTop: '3px'}}>Copy</Button>
              </CopyToClipboard>
            </div>

            <FacebookShareButton url={props.handle} quote={message}><FacebookIcon size={32} round={true} /></FacebookShareButton> &nbsp;
            <TwitterShareButton url={props.handle} title={"I just joined web3 social"} hashtags={["Plurality", "Web3Social"]}><TwitterIcon size={32} round={true} /></TwitterShareButton> &nbsp;
            <LinkedinShareButton url={props.handle} title={"I just joined web3 social"} summary={message} source={"Plurality"}><LinkedinIcon size={32} round={true} ></LinkedinIcon></LinkedinShareButton> &nbsp;
            <RedditShareButton url={props.handle} title={"Join my web3 social network"}><RedditIcon size={32} round={true} ></RedditIcon></RedditShareButton> &nbsp;
            <TelegramShareButton url={props.handle} title={"Join my web3 social network"}><TelegramIcon size={32} round={true} ></TelegramIcon></TelegramShareButton> &nbsp;
            </div>
            <Button onClick={props.handleClose} style={{marginTop: '15px'}}>Take me to my profile</Button>
          </Modal>
        ) : null}
        </Fragment>
    )
  }
