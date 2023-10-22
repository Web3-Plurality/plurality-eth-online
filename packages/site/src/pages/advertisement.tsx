import styled from "styled-components";
import { ScrollingCarousel } from '@trendyol-js/react-carousel';
import { useEffect, useState } from "react";
import { fetchCommitment, getLocalStorage } from "../utils";


const Advertisement = () => {
    const [ads, setAds] = useState<string[]>([]);
    const [contents, setContents] = useState<string[]>([]);
    const [interests, setInterests] = useState("");


    async function fetchInterestsFromSubgraph(commitments: string[]){
        try {
            console.log("Fetching interests for commitments: "+ JSON.stringify(commitments));
            const response = await fetch(process.env.GATSBY_API_BASE_URL+'/subgraph/', {
              method: 'POST',
              body: JSON.stringify(commitments), 
              headers: new Headers({'content-type': 'application/json'}),
            })
            const json = await response.json()
            const interestsObj = json.data.interestsMetaDatas;
            let interests = "";
            for (let i=0; i< interestsObj.length;i++) {
                interests = interests + interestsObj[i].interests;
            }
            return interests;

          } catch(err) {
            console.log({ err })
        }
    }

    const fetchAdvertisements = async () => {
        const commitmentFB =  await fetchCommitment(process.env.GATSBY_FACEBOOK!);
        const commitmentTW =  await fetchCommitment(process.env.GATSBY_TWITTER!);
        let commitments: string[] = [];
        if (commitmentFB)   commitments.push(commitmentFB);
        if (commitmentTW)   commitments.push(commitmentTW);
        const fetchedInterests = await fetchInterestsFromSubgraph(commitments);
        console.log("Got interests: "+ fetchedInterests);
        setInterests(fetchedInterests!);

    }

    useEffect(() => {
        //let interests = ["ART_ENTERTAINMENT__BOOKS", "ART_ENTERTAINMENT__ART"]; // todo: dynamically fetch it from user
        fetchAdvertisements().catch(console.error);
        if (interests.length <=0)   return;
        let splitted = interests!.split(","); 
        console.log(splitted);
        
        let localAds: string[] = []
        for (let i of splitted) {
            const ad = getLocalStorage(i);
            if (ad) {
                localAds.push(ad);
            };
        };
        if (localAds.length != 0) {
            setAds(localAds);
        };
      }, [interests]);
    
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
        </div>
    )
}

const Sticker = ({children, color}) => {
    return ( 
        <span style={{ backgroundColor: color, borderRadius: '2px', color: '#000000', padding: '20px 10px', display: 'block', height: '200px', margin: '16px 16px 16px 0', minWidth: '250px', maxWidth: "350px", border: "1px solid #BBC0C5", boxShadow: "7px 7px 7px rgba(0, 255, 0, 0.1)"}}> {children} 
        </span>
    );
}

export default Advertisement;