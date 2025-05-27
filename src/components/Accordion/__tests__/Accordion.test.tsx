import { IconAddressBook, IconUser } from '@tabler/icons-react-native'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  type within,
} from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { Accordion, AccordionTestIds, type AccordionProps } from '../Accordion'

describe('Accordion', () => {
  test('Header elements minimal', () => {
    const props: Omit<AccordionProps, 'children'> = { title: 'Accordion' }
    const contentText = 'This is Accordion content'
    const { toJSON } = render(
      <Accordion {...props}>
        <Text>{contentText}</Text>
      </Accordion>
    )

    expect(toJSON()).toMatchSnapshot()

    assertAccordionIsDisplaying(props)
  })

  test('Header elements maximal', () => {
    const props: Omit<AccordionProps, 'children'> = {
      Icon: IconUser,
      title: 'Accordion',
      titleExtra: <IconAddressBook />,
      withSeparator: true,
    }
    const contentText = 'This is Accordion content'
    const { toJSON } = render(
      <Accordion {...props}>
        <Text>{contentText}</Text>
      </Accordion>
    )

    expect(toJSON()).toMatchSnapshot()

    assertAccordionIsDisplaying(props)
  })

  test('Content toggle', async () => {
    const title = 'Title'
    render(
      <Accordion isInitiallyExpanded title={title}>
        <View style={{ height: 100 }} />
      </Accordion>
    )

    fireEvent(screen.getByTestId(AccordionTestIds.contentWrapper), 'layout', {
      nativeEvent: { layout: { height: 100, width: 200, x: 0, y: 0 } },
    })

    await waitFor(() =>
      expect(screen.getByTestId(AccordionTestIds.content)).toHaveAnimatedStyle({
        height: 100,
        opacity: 1,
      })
    )

    expect(screen.getByTestId(AccordionTestIds.arrow)).toHaveAnimatedStyle({
      transform: [{ rotate: `${Math.PI / 2}rad` }],
    })

    fireEvent.press(screen.getByText(title))

    await waitFor(() =>
      expect(screen.getByTestId(AccordionTestIds.content)).toHaveAnimatedStyle({
        height: 0,
        opacity: 0,
      })
    )

    expect(screen.getByTestId(AccordionTestIds.arrow)).toHaveAnimatedStyle({
      transform: [{ rotate: '0rad' }],
    })
  })
})

type TestInstance = ReturnType<typeof within>

const assertAccordionIsDisplaying = (
  props: Omit<AccordionProps, 'children'>,
  testInstance?: TestInstance
) => {
  const instance = testInstance ?? screen

  expect(instance.getByText(props.title)).toBeVisible()

  if (props.Icon) {
    expect(instance.getAllByTestId(AccordionTestIds.icon).length).toBeTruthy()
  } else {
    expect(instance.queryByTestId(AccordionTestIds.icon)).toBeFalsy()
  }

  if (props.titleExtra) {
    expect(instance.getByTestId(AccordionTestIds.titleExtra)).toBeVisible()
  } else {
    expect(instance.queryByTestId(AccordionTestIds.titleExtra)).toBeFalsy()
  }

  if (props.withSeparator) {
    expect(instance.getByTestId(AccordionTestIds.component)).toHaveStyle({
      borderTopWidth: 1,
    })
  } else {
    expect(instance.getByTestId(AccordionTestIds.component)).not.toHaveStyle({
      borderTopWidth: 1,
    })
  }
}
