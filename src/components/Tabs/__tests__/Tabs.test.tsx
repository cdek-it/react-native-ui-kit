import { IconUser } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { Badge } from '../../Badge'
import { TabItem, type TabItemProps, TestId } from '../TabItem/TabItem'
import { TabPanel, type TabPanelProps } from '../TabPanel/TabPanel'
import { Tabs, type TabsProps } from '../Tabs'

describe('TabItem component tests', () => {
  const snapshotCases: Array<[string, TabItemProps]> = [
    ['label', { index: 0, label: 'label' }],
    ['label, icon', { index: 0, label: 'label', Icon: IconUser }],
    ['label, badge', { index: 0, label: 'label', badge: <Badge>99</Badge> }],
    ['label, icon, badge', { index: 0, label: 'label', Icon: IconUser, badge: <Badge>99</Badge> }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedTabItem = render(<TabItem {...props} />)
    expect(renderedTabItem.toJSON()).toMatchSnapshot()
  })
})

describe('TabPanel component tests', () => {
  const snapshotCases: Array<[string, TabPanelProps]> = [
    ['activeIndex === index', { activeIndex: 0, index: 0 }],
    ['activeIndex !== index', { activeIndex: 1, index: 0 }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedTabItem = render(
      <TabPanel {...props}>
        <Text>Content</Text>
      </TabPanel>
    )
    expect(renderedTabItem.toJSON()).toMatchSnapshot()
  })
})

describe('Tabs component tests', () => {
  const snapshotCases: Array<[string, TabsProps]> = [
    ['normal', { activeIndex: 0, disabled: false, onChange: jest.fn() }],
    ['disabled', { activeIndex: 0, disabled: true, onChange: jest.fn() }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedTabItem = render(
      <Tabs {...props}>
        <TabItem Icon={IconUser} index={0} label='First Tab' />
        <TabItem index={1} label='Second Tab' />
        <TabItem badge={<Badge severity='danger'>0</Badge>} index={2} label='Third Tab' />
      </Tabs>
    )
    expect(renderedTabItem.toJSON()).toMatchSnapshot()
  })

  test('should handle tap on tabitem', async () => {
    const mockedOnTapTabItem = jest.fn()
    const testableIndex = 1

    const { getByTestId } = render(
      <Tabs activeIndex={testableIndex} onChange={mockedOnTapTabItem}>
        <TabItem Icon={IconUser} index={0} label='First Tab' />
        <TabItem index={1} label='Second Tab' />
      </Tabs>
    )
    const container = getByTestId(TestId.Container + testableIndex)
    const user = userEvent.setup()

    expect(mockedOnTapTabItem).not.toHaveBeenCalled()
    await user.press(container)
    expect(mockedOnTapTabItem).toHaveBeenCalled()
  })
})
