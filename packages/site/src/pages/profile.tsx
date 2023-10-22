import styled from "styled-components";
import { ScrollingCarousel } from '@trendyol-js/react-carousel';
import { useEffect, useState } from "react";
import { fetchCommitment, getCommitment, getLocalStorage } from "../utils";
import { Button } from "react-bootstrap";


const Profile = () => {
    const [ads, setAds] = useState<string[]>([]);
    const [contents, setContents] = useState<string[]>([]);

    const fetchAdvertisements = async () => {
        console.log("Fetching for "+process.env.GATSBY_FACEBOOK);
        const commitmentFB =  await fetchCommitment(process.env.GATSBY_FACEBOOK!);
        console.log("commitment from FB" + commitmentFB)
        console.log("Fetching for "+process.env.GATSBY_TWITTER);
        const commitmentTW =  await fetchCommitment(process.env.GATSBY_TWITTER!);
        console.log("commitment from TW" + commitmentTW)
    }

    useEffect(() => {
        let interests = ["ART_ENTERTAINMENT__BOOKS", "ART_ENTERTAINMENT__ART"]; // todo: dynamically fetch it from user
       
        let localAds: string[] = []
        for (let i of interests) {
            const ad = getLocalStorage(i);
            if (ad) {
                localAds.push(ad);
            };
        };
        if (localAds.length != 0) {
            setAds(localAds);
        };
      }, []);
    
    useEffect(() => {
        let localContent: string[] = [];
        for (let ad of ads) {
            const adContents = ad.split(";")
            for (let adContent of adContents) {
                localContent.push(adContent);
            }
        };
        localContent = [...new Set(localContent)]
        setContents(localContent);
        }, [ads]);
    
    const contentComponent = {
        marginLeft: '20%',
        marginRight: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }

    const Subtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: 500;
    margin-top: 30px;
    margin-bottom: 20px;
    ${({ theme }) => theme.mediaQueries.small} {
        font-size: ${({ theme }) => theme.fontSizes.text};
    }
    `;

    

    return (
        <div style={contentComponent}>
            <div style={{height: "100px"}}></div>
            <Subtitle>You may interested in...</Subtitle>
            <ScrollingCarousel hideArrows={true} show={2.5} slide={2} dynamic={true} swiping swipeOn={0.3}>
                {contents.map(content => <Sticker key={content} id={content} color="#ffffff">{content}</Sticker>)}
	        </ScrollingCarousel>
            <div style={{height: "220px"}}></div>
            <Button
                onClick={fetchAdvertisements}
              >  Fetch Advertisements
              </Button>
        </div>
    )
}

const Sticker = ({children, color}) => {
    return ( 
        <span style={{ backgroundColor: color, borderRadius: '2px', color: '#000000', padding: '20px 10px', display: 'block', height: '200px', margin: '16px 16px 16px 0', minWidth: '250px', maxWidth: "350px", border: "1px solid #BBC0C5", boxShadow: "7px 7px 7px rgba(0, 255, 0, 0.1)"}}> {children} 
        </span>
    );
}

export default Profile;