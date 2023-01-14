import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { QuantityForm } from "./QuantityForm";
import { StateImg } from "./StateImg";

import { validateAddress } from "@taquito/utils";
import { Data, BatchUnit } from "../types";

export const DataMap = ({ data, batch, onChange, target, error } : { data: Data | undefined, batch: BatchUnit[], onChange: Function, target: string, error: Error | undefined}) => {
    if (target === "") return <div>No target.</div>;
    else if (target !== "" && validateAddress(target) as number !== 3) return <div>Invalid address.</div>;
    else if (error) {
      console.log(error);
      return <div>Failed to Load</div>;
    }
    else if (!data) return <div>Loading...</div>;
    else if (!error && data){
      console.log(data.listing[0]);
      return (
        <Row>
          {data.listing.map((el, index, arr) => (
            <Col key={index} xs={4} sm={4} md={3} lg={2}>
              {el.token.display_uri ?<StateImg src={"https://ipfs.io/ipfs/" + el.token.display_uri.slice(7,)}/>: null}
              <h5>{el.token.name}</h5>
              <p>{el.price / 1000000}</p>
              <Row>
                <QuantityForm
                value={batch.find((b) => b.index === index)?.count || 0}
                maxValue={el.amount_left}
                onChange={(v: number) => onChange(index, v, arr[index], target)}
              />
              </Row>
            </Col>
          ))}
        </Row>
      );
    }
    else return null;
    
  };