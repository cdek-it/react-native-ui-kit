import AsyncStorage from '@react-native-async-storage/async-storage'

import { view } from './storybook.requires'

const StorybookUIRoot = view.getStorybookUI({
  storage: { getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem },
  theme: {
    typography: {
      size: {
        s1: 20,
        s2: 24,
        s3: 28,
        m1: 20,
        m2: 24,
        m3: 28,
        l1: 20,
        l2: 24,
        l3: 28,
        code: 30,
      },
    },
  },
})

export default StorybookUIRoot
