import React, { useState, useMemo, useCallback } from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'
import { Box, Composition, Only } from 'atomic-layout'

import { Grid } from '../../components/Grid'
import { Breadcrumbs } from './components/Breadcrumbs'
import { Menu } from './components/Menu'
import { TableOfContents } from './components/TableOfContents'
import { DocsPageFooter } from './components/DocsPageFooter'
import { BaseLayout } from '../../components/BaseLayout'
import { DocsHeader } from './components/DocsHeader'
import { Footer } from '../../components/Footer'

interface Props {
  page?: any
  navTree: any
  breadcrumbs: any
}

const BodyStylesOverride = createGlobalStyle`
  html {
    overflow: hidden;
  }
`

const Content = styled.div<{ isMenuOpen?: boolean }>`
  transform: translateX(${({ isMenuOpen }) => (isMenuOpen ? 275 : 0)}px);
  transition: transform 0.5s ease;

  ${({ isMenuOpen }) =>
    isMenuOpen &&
    css`
      body {
        background-color: red;
      }
    `}
`

const TransitionContainer = styled.div`
  overflow-x: hidden;
`

const OverlayMask = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.75);
  transition: opacity 0.5s ease;
  opacity: 0;
  visibility: hidden;
  z-index: 5;

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      visibility: visible;
    `}
`

const DocsLayout: React.FC<Props> = ({
  children,
  page,
  navTree,
  breadcrumbs,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const handleBurgerClick = useCallback(() => {
    setMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  const handleOverlayClick = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const threeColLayout = useMemo(() => {
    // Skip the right-most column when there is no table of contents
    return ['300px', '1fr', page?.tableOfContents && '186px']
      .filter(Boolean)
      .join(' ')
  }, [page])

  return (
    <BaseLayout>
      <DocsHeader onBurgerClick={handleBurgerClick} />
      <Grid as={TransitionContainer}>
        <Composition templateColsLg={threeColLayout} gap={64}>
          <Menu tree={navTree} isOpen={isMenuOpen} />
          <Box as={Content} isMenuOpen={isMenuOpen} paddingVertical={48}>
            <Breadcrumbs items={breadcrumbs} />
            <Box as="article" id="docs-page">
              {children}
            </Box>
            {page && (
              <DocsPageFooter
                relativeFilePath={page.fields.relativeFilePath}
                editUrl={page.fields.editUrl}
              />
            )}
          </Box>
          {page?.tableOfContents?.items && (
            <Only from="lg">
              <TableOfContents items={page.tableOfContents.items} />
            </Only>
          )}
        </Composition>
      </Grid>
      <OverlayMask isVisible={isMenuOpen} onClick={handleOverlayClick} />
      <Footer />
      {isMenuOpen && <BodyStylesOverride />}
    </BaseLayout>
  )
}

export default DocsLayout
