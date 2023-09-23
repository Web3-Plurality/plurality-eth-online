import { Modal, Button } from 'react-bootstrap';

export function ModalBox(props: any) {
    return (
        <Modal size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.modalBody}</Modal.Body>
          <Modal.Footer>
            {/*<Button variant="secondary" onClick={handleClose}>
              Close
            </Button>*/}
            {/* TODO: Pick button styles from a css file */}
            <Button variant="primary" onClick={props.handleClose} style={{backgroundColor:'#DE3163', borderColor: '#DE3163', color:'#FFFFFF'}}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
    )
  }
