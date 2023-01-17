import { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';

import { BeaconWalletHook } from './types';
import { useTezosContext } from './TezosContext';
import { useBalance } from './use-balance';

import { char2Bytes } from "@taquito/utils";
import { SigningType } from "@airgap/beacon-sdk";

export function useBeaconWallet(): BeaconWalletHook {
  const { tezos }: { tezos?: TezosToolkit } = useTezosContext();
  const [initialized, setInit] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const balanceState = useBalance(address);
  const [wallet, setWallet] = useState<any>(null);

  return {
    wallet,
    initialized,
    address,
    connect,
    disconnect,
    getWallet,
    activeAccount,
    err: error,
    loading: loading,
    balance: balanceState.balance,
    clearErrors,
  };

  async function connect(
  ) {
    try {
      setLoading(true);
      const address: string = await initWallet({name: "Beacon"}, "mainnet");
      setInit(true);
      setAddress(address);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }

  async function disconnect() {
    try {
      setLoading(true);
      const address: string = '';
      setAddress(address);

      const Wallet: any = getWallet();

      await Wallet.client.clearActiveAccount();
      
    } catch (error) {
      setError(error as string);
    } finally {
      setActiveAccount(null);
      setLoading(false);
    }
  }
  async function getWallet(){
    return await wallet;
  }

  function clearErrors() {
    setError('');
    balanceState.clearError();
  }

  // Create function like below that returns wallet;

  async function initWallet(
    options: any,
    network: 'mainnet' | 'delphinet' | 'custom'
  ): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Window is undefined');
    }
    if (!tezos) {
      throw new Error('Tezos object is undefined');
    }

    let Wallet: any;

    if (!initialized){
      const { BeaconWallet } = await import('@taquito/beacon-wallet');

      Wallet = new BeaconWallet(options);
    }
    else Wallet = getWallet();

    console.log("Requesting permissions...");
    await Wallet.requestPermissions({
      network: { type: network as any },
    });

    const addr = await Wallet.getPKH();
    console.log("Got permissions:", address);

    /*console.log("Signing ...");
    const input = "Gallery uses this cryptographic signature in place of a password, verifying that you are the owner of this address: " + addr;

    const formattedInput: string = ["Tezos Signed Message:", input].join(" ");

    const bytes = char2Bytes(formattedInput);
    const payloadBytes =
      "05" + "0100" + char2Bytes(bytes.length.toString()) + bytes;

    const response = await Wallet.client.requestSignPayload({
      signingType: SigningType.MICHELINE,
      payload: payloadBytes,
      sourceAddress: addr,
    });

    setSignedResponse(JSON.stringify(response));
    console.log("Signed!");*/


    tezos.setWalletProvider(Wallet);
    setWallet(Wallet);

    console.log(Wallet);
    setActiveAccount(await Wallet.client.getActiveAccount());

    
    /*const ask_id = 2876502;
    const proxy = null;
    const objkt_mrkt_v2 = "KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC";

    const contract = await tezos.wallet.at(objkt_mrkt_v2);

    const result = await contract.methods.fulfill_ask(ask_id, proxy).send({amount: 990000, mutez: true});*/

    return addr;
  }
}
