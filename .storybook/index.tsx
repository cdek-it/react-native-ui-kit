import { createAsyncStorage } from '@react-native-async-storage/async-storage'

import { view } from './storybook.requires'

const storage = createAsyncStorage('storybook')

const StorybookUIRoot = view.getStorybookUI({
  storage,
  theme: {
    typography: {
      size: {
        s1: 16,
        s2: 20,
        s3: 24,
        m1: 16,
        m2: 20,
        m3: 24,
        l1: 16,
        l2: 20,
        l3: 24,
        code: 28,
      },
    },
  },
})

export default StorybookUIRoot
