/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, FormEvent, FormEventHandler, MouseEventHandler, ReactElement, useCallback } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

// React-bootstrap variables
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import { TopBar } from "./components/TopBar";
import { CartModal } from "./components/CartModal";
import { DataMap } from "./components/DataMap";

// Data fetching variables
import useSWR from "swr";
import { request } from "graphql-request";
import { DataUnit, BatchUnit, Data } from "./types";
import { char2Bytes } from "@taquito/utils";
import { SigningType } from "@airgap/beacon-sdk";
import { useTezosContext } from './components/tezhooks/TezosContext';
import { useBeaconWallet } from './components/tezhooks/use-beacon-wallet';
import { disconnect } from "process";
//import { TezosToolkit } from "@taquito/taquito";
//import { BeaconWallet } from "@taquito/beacon-wallet";

//const Tezos = new TezosToolkit("https://rpc.tzbeta.net");
//const wallet: any = new BeaconWallet({name: "Beacon Docs Taquito"});
//Tezos.setWalletProvider(wallet);
//wallet.client.clearActiveAccount();

export default function Home(){

  // General state
  const {tezos} = useTezosContext();
  const [batch, setBatch] = useState<BatchUnit[]>([]); // [{index, count}]
  const [target, setTarget] = useState<string>("");
  const [cart, setCart] = useState<BatchUnit[]>([]);
  const [cartModalStatus, setCartModalStatus] = useState<boolean>(false);
  const [connectedAddress, setConnectedAddress] = useState<any>(null);
  const [signedResponse, setSignedResponse] = useState<any>(null);
  const [loadedOnce, setLoadedOnce] = useState<boolean>(false);
  

  const fetcher = (query: string) => request("https://data.objkt.com/v3/graphql", query);

  const { data, error } = useSWR<Data, Error>(`{
    listing(where: {token: {creators: {creator_address: {_eq: ` + target + `}}, supply: {_gt: "0"}}, status: {_eq: "active"}}, order_by: {token: {timestamp: asc}, price: asc}) {
      token {
        name
        display_uri
        timestamp
        supply
      }
      price
      seller {
        address
        alias
      }
      amount_left
      bigmap_key
      marketplace_contract
    }
  }`, fetcher);
  
  const {
    wallet, // the wallet object returned from taquito
    initialized, // true iff the wallet is initialized
    address, // null when wallet is not initialized, otherwise it's the wallet's address
    connect, //call this function with DAppClientOptions to connect to a beacon wallet
    disconnect,
    getWallet,
    activeAccount,
    loading, // true when wallet is loading
    balance, // holds the account's balance (for now it's not reactive)
    err, // string, not empty when there's an error
    clearErrors // can be called to clear the error
  } = useBeaconWallet();

  //const objkt_mrkt_v2 = "KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC";
  //const ask_id = 2842792;
  //const proxy = null;

  const onCartClick = () => {
    setCartModalStatus(true);
  }

  const onHideModal = () => {
    setCartModalStatus(false);
  }

  /*useEffect(()=>{
    
    connect({name: "Beacon"});

  }, []);*/

  useEffect(()=>{
    //console.log(target);

    setBatch(cart.filter((b) => target === b.tgt));

  }, [target]);

  const onSubmit : FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
    const target = (e.currentTarget.elements[0] as HTMLInputElement).value
    setTarget(target);
    
    e.preventDefault();
  };

  const batchCount = cart.reduce((sum, item) => sum + item.count, 0);

  const onChange = (index: number, count: number, token: DataUnit, tgt: string) => {
    if (count === 0) {
      setBatch(batch.filter((b) => b.index !== index)); // remove from batch
      setCart(cart.filter((b) => b.token !== token)); // remove from cart if same element
    } else {
      const found = batch.find((b) => b.index === index);
      if (found) {
        setBatch(batch.map((b) => (b.index === index ? { index, count, token, tgt } : b)));
        setCart(cart.map((b) => (b.token === token ? { index, count, token, tgt }: b)));
      } else {
        setBatch([...batch, { index, count, token, tgt }]);
        setCart([...cart, { index, count, token, tgt }])
      }
    }
  };

  const handleClick = useCallback(async () => {
    try {

      /*if (getWallet()){
        console.log("Requesting permissions...");
        await wallet.requestPermissions();
        
        const address = wallet.getPKH(); 
        console.log("Got permissions:", address);
        setConnectedAddress(address);
      
        const input = `Gallery uses this cryptographic signature in place of a password, verifying that you are the owner of this address: 12345678`;

        const formattedInput: string = ["Tezos Signed Message:", input].join(" ");

        const bytes = char2Bytes(formattedInput);
        const payloadBytes =
          "05" + "0100" + char2Bytes(bytes.length.toString()) + bytes;

        const response = await wallet.client.requestSignPayload({
          signingType: SigningType.MICHELINE,
          payload: payloadBytes,
          sourceAddress: connectedAddress,
        });

        setSignedResponse(JSON.stringify(response));*/

        /*const tx = await dAppClient.requestOperation({
          operationDetails: [
            {
              kind: TezosOperationType.TRANSACTION,
              destination: 'tz1VuwFoPMkZpgQTijYcTNL8WzTCo6KMTkQd', // Send to ourselves
              amount: "1", // Amount in mutez, the smallest unit in Tezos
            },
          ],
        });*/
        //setActiveAccount(await wallet.client.getActiveAccount());

        //const contract = await Tezos.wallet.at(objkt_mrkt_v2);

        //const result = await contract.methods.fulfill_ask(ask_id, proxy).send({amount: 1110000, mutez: true});

      //}
      connect({name: "Beacon"});
    } catch (error) {
      console.log("Got error:", error);
    }
    //connect({name: "Beacon"});
    

  }, []);

  const handleDisconnect = useCallback(async ()=> {
    try{
      //dAppClient.disconnect();
      //setActiveAccount(null);
      //setConnectedAddress('');
      disconnect();
    }
    catch(error){
      console.log("Got error:", error);
    }  

  }, []);

  return (
    <Container>
      <div>
        <Button variant={!activeAccount ? "success" : "danger"} onClick={!activeAccount ? handleClick : handleDisconnect}>{!activeAccount ? "Connect Wallet" : address}</Button>
      </div>
      <TopBar cartTotal={batchCount} onSubmit={onSubmit} onCartClick={onCartClick}/>
      <DataMap data={data} batch={batch} onChange={onChange} target={target} error={error}/>
      <CartModal onChange={onChange} show={cartModalStatus} onHideModal={onHideModal} cart={cart}/>
    </Container>
  );
};