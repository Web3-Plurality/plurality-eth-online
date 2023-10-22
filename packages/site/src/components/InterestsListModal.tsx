import Modal from "@atlaskit/modal-dialog";
import Button from "@atlaskit/button";

import Select from "react-select";
import { lensInterests } from "../utils/interests";
import styled from "styled-components";
import { Fragment, useEffect, useState } from "react";

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Item = styled.button`
margin: 5px 4px 5px
`;
export function ModalBoxInterests( props: any ) {
    const [selectedValues, setSelectedValues] = useState<any>(props.userInterests)

    useEffect(() => {
      setSelectedValues(props.userInterests)
    }, [props.show]);

    useEffect(() => {
      props.onChange(selectedValues)
    }, [selectedValues]);

    const handleClick = (event) => {
      for (let interest of lensInterests) {
        if (interest.label === event.target.id)
          {
            let duplicated = false
            for (let selectedValue of selectedValues) {
              if (selectedValue === interest) {
                console.log('duplicated')
                duplicated = true
                break;
              }
            }
            if (!duplicated) 
            {
              setSelectedValues([...selectedValues, interest])   
            }
          }
      }
    }

    const handleChange = (event) => {
      setSelectedValues(event)
    }

    const interests = ['Books', 'Art', 'Design', 'Photography', 'Fashion', 'Anime', 'Memes', 'Films', 'Music']

    return (
        <Fragment>
        { props.show ? (
        <Modal onClose={props.handleClose}>
            <div style={{textAlign:'center', marginLeft: '2%', marginRight: '2%'}}>
            <br />
            <Subtitle>Your interests</Subtitle>
            <p>We found the following interests. Please select if there is something else you are interested in</p>
            </div>
            <div style={{marginLeft: '2%', marginRight: '2%'}}>
              <Select
                value={selectedValues}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{ menuPortal: base => ({ ...base, zIndex: 10000 }) }}
                menuPortalTarget={document.body}
                options={lensInterests}
                onChange={(e)=>{console.log(e); handleChange(e); props.onChange(e)}}
              />
            </div>
            <div style={{marginLeft: '2%', marginRight: '2%', marginTop: '5px', marginBottom: '10px'}}>
              <div>
                <p style={{fontWeight:'bold', marginLeft: '2%'}}>Most frequently picked topics: </p>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                { interests.map(interest => <Item key={interest} id={interest} onClick={handleClick}>{interest}</Item>) }
              </div>
            </div>
            <div style={{marginLeft: '2%', marginRight: '2%', marginTop: '5px', marginBottom: '10px'}}>
              <label style={{display: 'flex'}}>
                <input type="checkbox" style={{marginTop: '6px'}}/>
                I want to share my interests
              </label>
            </div>
            <Button onClick={props.handleClose}>Save changes</Button>
          </Modal>
        ) : null}
        </Fragment>
    )
  }
