import { ApolloProvider } from '@apollo/client'
import { ChainId } from '@dynamic-amm/sdk'
import { defaultExchangeClient } from 'apollo/client'

import OnlyEthereumRoute from 'components/OnlyEthereumRoute'

import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useWindowSize } from 'hooks/useWindowSize'

import React, { lazy, Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AppDispatch } from 'state'
import { setGasPrice } from 'state/application/actions'
import { useExchangeClient } from 'state/application/hooks'
import { useIsDarkMode } from 'state/user/hooks'
import styled from 'styled-components'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { BLACKLIST_WALLETS } from '../constants'
import SwapV2 from './SwapV2'


// Route-based code splitting
const Migration = lazy(() => import(/* webpackChunkName: 'migration-page' */ './Pool/lp'))


const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  z-index: 3;
`

const BodyWrapper = styled.div<{ isAboutpage?: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  align-items: center;
  min-height: calc(100vh - 148px);
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`

export default function App() {
  const { account, chainId } = useActiveWeb3React()
  const aboutPage = useRouteMatch('/about')
  const apolloClient = useExchangeClient()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchGas = (chain: string) => {
      fetch(process.env.REACT_APP_KRYSTAL_API + `/${chain}/v2/swap/gasPrice`)
        .then(res => res.json())
        .then(json => {
          dispatch(setGasPrice(!!json.error ? undefined : json.gasPrice))
        })
        .catch(e => {
          dispatch(setGasPrice(undefined))
          console.error(e)
        })
    }

    let interval: any = null
    const chain =
      chainId === ChainId.MAINNET
        ? 'ethereum'
        : chainId === ChainId.BSCMAINNET
        ? 'bsc'
        : chainId === ChainId.AVAXMAINNET
        ? 'avalanche'
        : chainId === ChainId.MATIC
        ? 'polygon'
        : chainId === ChainId.FANTOM
        ? 'fantom'
        : chainId === ChainId.CRONOS
        ? 'cronos'
        : ''
    if (!!chain) {
      fetchGas(chain)
      interval = setInterval(() => fetchGas(chain), 30000)
    } else dispatch(setGasPrice(undefined))
    return () => {
      clearInterval(interval)
    }
  }, [chainId, dispatch])

  const theme = useTheme()
  const isDarkTheme = useIsDarkMode()

  const { width } = useWindowSize()

  return (
    <>
      {(!account || !BLACKLIST_WALLETS.includes(account)) && (
        <ApolloProvider client={apolloClient || defaultExchangeClient}>
          <AppWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper isAboutpage={aboutPage?.isExact}>
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/swap" component={SwapV2} />
                  <OnlyEthereumRoute exact path="/migration" component={Migration} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
          </AppWrapper>
        </ApolloProvider>
      )}
    </>
  )
}
