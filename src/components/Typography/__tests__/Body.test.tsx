/* eslint-disable @typescript-eslint/no-deprecated -- тесты фиксируют fallback до следующей мажорной версии */
import { render } from '@testing-library/react-native'

import { Body, type BodyProps } from '../Body'

describe('Body component tests', () => {
  const snapshotCases: ReadonlyArray<{ name: string; props: BodyProps }> = [
    {
      name: 'base regular paragraph',
      props: {
        color: 'secondary',
        paragraph: true,
        size: 'base',
        weight: 'regular',
      },
    },
    { name: 'lg regular paragraph', props: { paragraph: true, size: 'lg' } },
    {
      name: 'xl bold strikethrough disabled',
      props: {
        color: 'primary',
        disabled: true,
        size: 'xl',
        strikethrough: true,
        weight: 'bold',
      },
    },
  ]

  test.each(snapshotCases)('$name', ({ props }) => {
    const renderedBody = render(<Body {...props}>Text</Body>)

    expect(renderedBody.toJSON()).toMatchSnapshot()
  })

  test('default props', () => {
    const renderedBody = render(<Body>Text</Body>)

    expect(renderedBody.toJSON()).toMatchSnapshot()
  })

  test.each([
    { name: 'base=true', base: true, size: 'base' as const },
    { name: 'base=false', base: false, size: 'lg' as const },
  ])('$name использует deprecated fallback', ({ base, size }) => {
    const legacyBody = render(<Body base={base}>Text</Body>)
    const body = render(<Body size={size}>Text</Body>)

    expect(legacyBody.toJSON()).toStrictEqual(body.toJSON())
  })

  test('без size и deprecated base сохраняется размер lg', () => {
    const legacyDefaultBody = render(<Body>Text</Body>)
    const body = render(<Body size='lg'>Text</Body>)

    expect(legacyDefaultBody.toJSON()).toStrictEqual(body.toJSON())
  })

  test('size имеет приоритет над deprecated base', () => {
    const bodyWithFallback = render(
      <Body base size='xl'>
        Text
      </Body>
    )
    const body = render(<Body size='xl'>Text</Body>)

    expect(bodyWithFallback.toJSON()).toStrictEqual(body.toJSON())
  })
})
