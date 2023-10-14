import Modal from "@atlaskit/modal-dialog";
import Button from "@atlaskit/button";

import Select from "react-select";
import { lensInterests } from "../utils/interests";
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
export function ModalBoxInterests( props: any ) {
    const [value, setValue] = useState<any>();

    return (
        <Fragment>
        { props.show ? (
        <Modal onClose={props.handleClose}>
            <div style={{textAlign:'center'}}>
            <br />
            <Subtitle>Your interests</Subtitle>
            <p>We found the following interests. Please select if there is something else you are interested in</p>
            </div>
            <Select
              defaultValue={props.userInterests}
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{ menuPortal: base => ({ ...base, zIndex: 10000 }) }}
              menuPortalTarget={document.body}
              options={lensInterests}
              onChange={(e)=>{setValue(e); props.onChange(e)}}
            />
            <Button onClick={props.handleClose}>Save changes</Button>
          </Modal>
        ) : null}
        </Fragment>
    )
  }
