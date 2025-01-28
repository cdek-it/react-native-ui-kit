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
    ['label', { index: 0, label: 'label', onPress: jest.fn() }],
    ['label, icon', { index: 0, label: 'label', Icon: IconUser, onPress: jest.fn() }],
    ['label, badge', { index: 0, label: 'label', badge: <Badge>99</Badge>, onPress: jest.fn() }],
    [
      'label, icon, badge',
      { index: 0, label: 'label', Icon: IconUser, badge: <Badge>99</Badge>, onPress: jest.fn() },
    ],

    // active
    ['active: label', { active: true, index: 0, label: 'label', onPress: jest.fn() }],
    [
      'active: label, icon',
      { active: true, index: 0, label: 'label', Icon: IconUser, onPress: jest.fn() },
    ],
    [
      'active: label, badge',
      { active: true, index: 0, label: 'label', badge: <Badge>99</Badge>, onPress: jest.fn() },
    ],
    [
      'active: label, icon, badge',
      {
        active: true,
        index: 0,
        label: 'label',
        Icon: IconUser,
        badge: <Badge>99</Badge>,
        onPress: jest.fn(),
      },
    ],

    // disabled
    ['disabled: label', { disabled: true, index: 0, label: 'label', onPress: jest.fn() }],
    [
      'disabled: label, icon',
      { disabled: true, index: 0, label: 'label', Icon: IconUser, onPress: jest.fn() },
    ],
    [
      'disabled: label, badge',
      { disabled: true, index: 0, label: 'label', badge: <Badge>99</Badge>, onPress: jest.fn() },
    ],
    [
      'disabled: label, icon, badge',
      {
        disabled: true,
        index: 0,
        label: 'label',
        Icon: IconUser,
        badge: <Badge>99</Badge>,
        onPress: jest.fn(),
      },
    ],

    // disabled + active
    [
      'disabled + active : label',
      { disabled: true, active: true, index: 0, label: 'label', onPress: jest.fn() },
    ],
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
    ['normal', { activeIndex: 0, disabled: false, onChange: jest.fn(), items: [] }],
    ['disabled', { activeIndex: 0, disabled: true, onChange: jest.fn(), items: [] }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedTabItem = render(
      <Tabs
        {...props}
        items={[
          { Icon: IconUser, label: 'First Tab', key: '0' },
          { label: 'Second Tab', key: '1' },
          { badge: <Badge severity='danger'>0</Badge>, label: 'Third Tab', key: '2' },
        ]}
      />
    )
    expect(renderedTabItem.toJSON()).toMatchSnapshot()
  })

  test('should handle tap on tabitem', async () => {
    const mockedOnTapTabItem = jest.fn()
    const testableIndex = 1

    const { getByTestId } = render(
      <Tabs
        activeIndex={testableIndex}
        items={[
          { Icon: IconUser, label: 'First Tab', key: '0' },
          { label: 'Second Tab', key: '1' },
        ]}
        onChange={mockedOnTapTabItem}
      />
    )
    const container = getByTestId(TestId.Container + testableIndex)
    const user = userEvent.setup()

    expect(mockedOnTapTabItem).not.toHaveBeenCalled()
    await user.press(container)
    expect(mockedOnTapTabItem).toHaveBeenCalled()
  })
})
