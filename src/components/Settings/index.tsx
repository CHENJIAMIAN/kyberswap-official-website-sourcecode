import React, { useRef, useState, useEffect } from 'react'
import { Settings } from 'react-feather'
import styled, { css } from 'styled-components'

import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { useDarkModeManager, useUserLocale } from 'state/user/hooks'
import { ButtonEmpty } from '../Button'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import ThemeToggle from 'components/Toggle/ThemeToggle'
import useTheme from 'hooks/useTheme'
import ArrowRight from 'components/Icons/ArrowRight'
import { LOCALE_LABEL, SupportedLocale } from 'constants/locales'
import LanguageSelector from 'components/LanguageSelector'
import MenuFlyout from 'components/MenuFlyout'
import { isMobile } from 'react-device-detect'
const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text};
  }
`

const StyledMenuButton = styled.button<{ active?: boolean }>`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};

  border-radius: 0.5rem;

  :hover {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.buttonBlack};
  }

  ${({ active }) =>
    active
      ? css`
          cursor: pointer;
          outline: none;
          background-color: ${({ theme }) => theme.buttonBlack};
        `
      : ''}
`
const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyoutBrowserStyle = css`
  min-width: 20.125rem;
  right: -10px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    min-width: 18.125rem;
  `};
`
const StyledLabel = styled.div`
  font-size: ${isMobile ? '14px' : '12px'};
  color: ${({ theme }) => theme.text};
  font-weigh: 400;
  line-height: 20px;
`
export default function SettingsTab() {
  const theme = useTheme()
  const [darkMode, toggleSetDarkMode] = useDarkModeManager()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const userLocale = useUserLocale()

  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false)

  useEffect(() => {
    if (!open) setIsSelectingLanguage(false)
  }, [open])

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton active={open} onClick={toggle} id="open-settings-dialog-button" aria-label="Settings">
        <StyledMenuIcon />
      </StyledMenuButton>
      <MenuFlyout
        node={node}
        browserCustomStyle={MenuFlyoutBrowserStyle}
        isOpen={open}
        toggle={toggle}
        translatedTitle={isSelectingLanguage ? undefined : `Preferences`}
        hasArrow
        mobileCustomStyle={{ paddingBottom: '40px' }}
      >
        {!isSelectingLanguage ? (
          <>
            <RowBetween style={{ marginTop: '15px' }}>
              <RowFixed>
                <StyledLabel>
                  Dark Mode
                </StyledLabel>
              </RowFixed>
              <ThemeToggle id="toggle-dark-mode-button" isDarkMode={darkMode} toggle={toggleSetDarkMode} />
            </RowBetween>

            <RowBetween style={{ marginTop: '15px' }}>
              <RowFixed>
                <StyledLabel>
                  Language
                </StyledLabel>
              </RowFixed>
              <ButtonEmpty
                padding="0"
                width="fit-content"
                style={{ color: theme.text, textDecoration: 'none', fontSize: '14px' }}
                onClick={() => setIsSelectingLanguage(true)}
              >
                <span style={{ marginRight: '10px' }}>
                  {LOCALE_LABEL[userLocale as SupportedLocale] || LOCALE_LABEL['en-US']}
                </span>
                <ArrowRight fill={theme.text} />
              </ButtonEmpty>
            </RowBetween>
          </>
        ) : (
          <AutoColumn gap="md">
            <LanguageSelector setIsSelectingLanguage={setIsSelectingLanguage} />
          </AutoColumn>
        )}
      </MenuFlyout>
    </StyledMenu>
  )
}
