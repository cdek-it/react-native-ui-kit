import { IconUser } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'

import { SvgUniversal, SvgUniversalTestId } from '../SvgUniversal'

describe('SvgUniversal', () => {
  const svgXmlMock = '<svg viewBox="0 0 1 1"><path d="M1 1h1v1H1z" /></svg>'

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('при передаче компонента в качестве источника', () => {
    test('должен отрендерить компонент', () => {
      const { getAllByTestId } = render(<SvgUniversal source={IconUser} />)

      expect(
        getAllByTestId(SvgUniversalTestId.component).length
      ).toBeGreaterThan(0)
    })
  })

  describe('при передаче uri в качестве источника', () => {
    test('рендерит компонент SvgUri', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(new Response(svgXmlMock, { status: 200 }))

      const { findByTestId } = render(
        <SvgUniversal source={{ uri: 'https://google.com' }} />
      )

      const svgUri = await findByTestId(SvgUniversalTestId.uri)

      expect(svgUri).toBeOnTheScreen()
    })
  })

  describe('при передаче XML в качестве источника', () => {
    test('рендерит компонент SvgXml', () => {
      const { getByTestId } = render(
        <SvgUniversal source={{ xml: '<svg><path d="M1 1h1v1H1z" /></svg>' }} />
      )

      expect(getByTestId(SvgUniversalTestId.xml)).toBeOnTheScreen()
    })
  })
})
