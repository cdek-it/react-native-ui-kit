import { type within, screen } from '@testing-library/react-native'

import { type AccordionProps, AccordionTestids } from '../Accordion'

type TestInstance = ReturnType<typeof within>

export const assertAccordionIsDisplaying = (
  props: Omit<AccordionProps, 'children'>,
  testInstance?: TestInstance
) => {
  const instance = testInstance ?? screen

  expect(instance.getByText(props.title)).toBeVisible()

  if (props.Icon) {
    expect(instance.getAllByTestId(AccordionTestids.icon).length).toBeTruthy()
  } else {
    expect(instance.queryByTestId(AccordionTestids.icon)).toBeFalsy()
  }

  if (props.extra) {
    expect(instance.getByTestId(AccordionTestids.extra)).toBeVisible()
  } else {
    expect(instance.queryByTestId(AccordionTestids.extra)).toBeFalsy()
  }
}
