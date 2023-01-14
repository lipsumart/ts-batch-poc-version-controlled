import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormEventHandler, MouseEventHandler } from "react";

export const TopBar = ({ cartTotal, onSubmit, onCartClick } : { cartTotal: number; onSubmit: FormEventHandler<HTMLFormElement>; onCartClick: MouseEventHandler<HTMLButtonElement>})=>{
    return (          
    <Navbar bg="light" expand="lg" sticky={"top"} fixed={"top"}>
      <Navbar.Brand href="#home">Tezos Batch Collector v0.1</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>
                Target Tezos Address:
                <Form.Control type={"text"} placeholder={"Enter Tez Address of creator"}/>
              </Form.Label>
            </Form.Group>
            <Button type={"submit"}>Submit</Button>
          </Form>      
        </Nav>
        <Button onClick={onCartClick}>{"Cart: " + cartTotal}</Button>  
      </Navbar.Collapse>                  
    </Navbar>);
}