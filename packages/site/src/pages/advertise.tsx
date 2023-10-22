import { useState } from "react";
import Select from "react-select";
import { lensInterests } from "../utils/interests";
import { Button } from "react-bootstrap";
import { getLocalStorage, setLocalStorage } from "../utils";
import styled from "styled-components";
const Advertise = () => {
    const [selectedValues, setSelectedValues] = useState<any>()
    const [message, setMessage] = useState('');

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

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleChange = (e) => {
        let newInterests:string[] = [];
        setSelectedValues(newInterests);
        for (let i=0;i<e.length;i++)
        {
            newInterests.push(e[i].value);
            console.log(e[i].value)
        }
    }

    const onPostClick = () => {
        for (let interest of selectedValues) {
            console.log("adding interet" + interest.value + "with advertisement");
            const advertisements = getLocalStorage(interest.value) ?  getLocalStorage(interest.value) + ";" + message : message
            setLocalStorage(interest.value, advertisements)
        }
        alert("advertisement added!")
    }

    const recordChange = (event) => {
        setSelectedValues(event)
    }

    return (
        <div style={contentComponent}>
            <Subtitle>Please pick some interests below and send your advertisement</Subtitle>
            <div style={{marginLeft: '10%', marginRight: '10%', width: '-webkit-fill-available'}}>
            <Select
            value={selectedValues}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{ menuPortal: base => ({ ...base, zIndex: 10000 }) }}
            menuPortalTarget={document.body}
            options={lensInterests}
            onChange={(e)=>{handleChange(e); recordChange(e)}}
            />
            </div>
            <div>
                <Subtitle>What you want to post?</Subtitle>
                <textarea name="advertisement" id="advertisement" cols={100} rows={20} placeholder={ "type your advertisement here"} value={message} onChange={handleMessageChange} style={{resize: 'none'}}></textarea>
                <br />
                <Button onClick={onPostClick} style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}>Post</Button>
            </div>
        </div>
    )
}

export default Advertise;