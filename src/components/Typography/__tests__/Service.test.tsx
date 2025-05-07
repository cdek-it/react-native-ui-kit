import { IconBuildingSkyscraper } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'

import { Service, type ServiceProps } from '../Service'

describe('Service component tests', () => {
  const snapshotCases = generatePropsCombinations<ServiceProps>({
    base: [true, false],
    showIcon: [true, false],
    variant: ['danger', 'help', 'info', 'success', 'warning'],
    Icon: [undefined, IconBuildingSkyscraper],
  })

  test.each(snapshotCases)(
    'base = $base, showIcon = $showIcon, variant = $variant',
    (props) => {
      const renderedBody = render(<Service {...props}>Text</Service>)

      expect(renderedBody.toJSON()).toMatchSnapshot()
    }
  )
})
