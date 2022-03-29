import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'

import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'
import Loader from '../Loader'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // 尝试急切地连接到注入的提供者，如果它存在并且已经授予访问权限
  const triedEager = useEagerConnect()

  // 在急切地尝试注入后，如果网络连接不活跃或处于错误状态，请激活 itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // 当没有连接帐户时，对注入的提供者的登录（广义上讲）做出反应，如果它存在
  useInactiveListener(!triedEager)

  // 处理延迟加载器状态
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // 在页面加载时，在我们尝试连接到注入的连接器之前什么都不做
  if (!triedEager) {
    return <></>
  }

  // 如果帐户上下文未激活，并且网络上下文出现错误，则这是不可恢复的错误
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>
          <Trans>
            Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
          </Trans>
        </Message>
      </MessageWrapper>
    )
  }

  // 如果两个上下文都没有激活，则旋转
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    ) : null
  }

  return children
}
