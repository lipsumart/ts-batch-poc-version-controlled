/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, FormEvent, FormEventHandler, MouseEventHandler, ReactElement, useCallback } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

// React-bootstrap variables
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import useSWR from "swr";
import { request } from "graphql-request";

import { WalletParamsWithKind } from '@taquito/taquito';

import { TopBar } from "./components/TopBar";
import { CartModal } from "./components/CartModal";
import { DataMap } from "./components/DataMap";
import { DataUnit, BatchUnit, Data } from "./types";
import { useTezosContext } from './components/tezhooks/TezosContext';
import { useBeaconWallet } from './components/tezhooks/use-beacon-wallet';
import { batchCollect } from './utils/batchCollect';

export default function Home(){

  // General state
  const {tezos} = useTezosContext();
  const [batch, setBatch] = useState<BatchUnit[]>([]); // [{index, count}]
  const [target, setTarget] = useState<string>("");
  const [cart, setCart] = useState<BatchUnit[]>([]);
  const [cartModalStatus, setCartModalStatus] = useState<boolean>(false);

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

  const checkout = async () => {
    if (tezos){        
      const Wallet = await getWallet();
      const txs: WalletParamsWithKind[] = await batchCollect(cart, tezos);
      const batch = tezos.wallet.batch(txs); 

      try
      {
        const batchOp = await batch.send();
        await batchOp.confirmation();
        return true;
      }
      catch(err)
      {
        console.log("Error while sending batch: " + err);
        throw err;
      }  
    }
  };

  const clearOrder = () => {
    setBatch([]);
    setCart([]);
  };

  const onCartClick = () => {
    setCartModalStatus(true);
  };

  const onHideModal = () => {
    setCartModalStatus(false);
    return true;
  };

  useEffect(()=>{ setBatch(cart.filter((b) => target === b.tgt)); }, [target, cart]);

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
      connect();
    } catch (error) {
      console.log("Got error:", error);
      throw error;
    }
  }, []);

  const handleDisconnect = useCallback(async ()=> {
    try{
      disconnect();
    } catch(error){
      console.log("Got error:", error);
      throw error;
    }  
  }, []);

  return (
    <Container>
      <div>
        <Button variant={!activeAccount ? "success" : "danger"} onClick={!activeAccount ? handleClick : handleDisconnect}>{!activeAccount ? "Connect Wallet" : address}</Button>
      </div>
      <TopBar cartTotal={batchCount} onSubmit={onSubmit} onCartClick={onCartClick}/>
      <DataMap data={data} batch={batch} onChange={onChange} target={target} error={error}/>
      <CartModal onChange={onChange} show={cartModalStatus} onHideModal={onHideModal} cart={cart}
      connect={connect} checkout={checkout} activeAccount={activeAccount} clearOrder={clearOrder}/>
    </Container>
  );
};