import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TezosToolkit } from '@taquito/taquito'
import { TezosContextProvider } from './components/tezhooks/TezosContext'

const tezos = new TezosToolkit("https://rpc.tzbeta.net");

function MyApp({ Component, pageProps }: AppProps) {

  return ( 
    <TezosContextProvider tezos={tezos}>
      <Component {...pageProps} />
    </TezosContextProvider>
  )
}

export default MyApp
