import React from 'react'
import { Text } from 'rebass/styled-components'
import { useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { GroupButtonReturnTypes, ButtonReturnType } from './styleds'

import { GasStation, MoneyFill } from 'components/Icons'

export default function TradeTypeSelection() {
  const { saveGas } = useSwapState()
  const { onChooseToSaveGas } = useSwapActionHandlers()
  return (
    <GroupButtonReturnTypes>
      <ButtonReturnType onClick={() => onChooseToSaveGas(false)} active={!saveGas} role="button">
        <MoneyFill />
        <Text marginLeft="4px">
          Maximum Return
        </Text>
      </ButtonReturnType>
      <ButtonReturnType onClick={() => onChooseToSaveGas(true)} active={saveGas} role="button">
        <GasStation />
        <Text marginLeft="4px">
          Lowest Gas
        </Text>
      </ButtonReturnType>
    </GroupButtonReturnTypes>
  )
}
