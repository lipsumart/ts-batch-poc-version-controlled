import { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';

import { BeaconWalletHook } from './types';
import { useTezosContext } from './TezosContext';
import { useBalance } from './use-balance';

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
    options: any,
    network: 'mainnet' | 'delphinet' | 'custom' = 'mainnet'
  ) {
    try {
      setLoading(true);
      const address: string = await initWallet(options, network);
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

    await Wallet.requestPermissions({
      network: { type: network as any },
    });
    tezos.setWalletProvider(Wallet);
    setWallet(Wallet);

    console.log(Wallet);
    setActiveAccount(await Wallet.client.getActiveAccount());

    return await Wallet.getPKH();
  }
}
