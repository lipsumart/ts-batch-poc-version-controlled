
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/CloseButton";

import { BatchUnit } from "../types";
import { DAppClientOptions } from '@airgap/beacon-sdk';

export const CartModal = ({ onChange, show, onHideModal, cart, connect, activeAccount, checkout } : 
    { onChange: Function; show: boolean; onHideModal: ()=>void; cart: BatchUnit[]; connect: () => void; activeAccount: any; checkout: () => void })=>{
    return (
    <Modal show={show} onHide={onHideModal}>
      <Container>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
          {
            cart.map((token: BatchUnit) => (
              <Col key={token.index}>              
                <CloseButton onClick={(e) => onChange(token.index, 0, token.token, token.tgt)}/>
                <h5>{token.token.token.name}</h5>
                <p>{token.token.price / 1000000} {" xtz"}</p>
                <p>{token.count}</p>
              </Col>
            ))
          }
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHideModal}>
            Close
          </Button>
          <Button variant={!activeAccount ? "success" : "danger"} onClick={!activeAccount ? connect : checkout}>
            {!activeAccount ? "Connect Wallet" : "Checkout"}
          </Button>
        </Modal.Footer>
      </Container>
    </Modal>);
}