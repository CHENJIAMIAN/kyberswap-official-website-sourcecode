import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui' //字体
import React, { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { NetworkContextName, sentryRequestId } from './constants'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

window.version = process.env.REACT_APP_VERSION

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const preloadhtml = document.querySelector('.preloadhtml')
const preloadhtmlStyle = document.querySelector('.preloadhtml-style')
const hideLoader = () => {
  setTimeout(() => {
    preloadhtml?.remove()
    preloadhtmlStyle?.remove()
  }, 100)
}

const ReactApp = ({ hideLoader }: { hideLoader: () => void }) => {
  useEffect(hideLoader, [])

  return (
    <StrictMode>
      <FixedGlobalStyle />
      <Provider store={store}>
        <HashRouter>
          <LanguageProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <Web3ProviderNetwork getLibrary={getLibrary}>
                <Updaters />
                <ThemeProvider>
                  <ThemedGlobalStyle />
                  <App />
                </ThemeProvider>
              </Web3ProviderNetwork>
            </Web3ReactProvider>
          </LanguageProvider>
        </HashRouter>
      </Provider>
    </StrictMode>
  )
}

ReactDOM.render(<ReactApp hideLoader={hideLoader} />, document.getElementById('root'))

// if (process.env.REACT_APP_SERVICE_WORKER === 'true') {
//   serviceWorkerRegistration.register()
// } else {
//   serviceWorkerRegistration.unregister()
// }
serviceWorkerRegistration.unregister()
