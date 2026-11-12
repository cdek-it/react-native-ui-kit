import { FullUI } from '@storybook/react-native-ui'
import { type ComponentProps, useMemo } from 'react'
import { Text } from 'react-native'

import { StorybookTags } from './StorybookTags'
import { view } from './storybook.requires'

export const StorybookStatusUI = ({
  storyHash,
  ...props
}: ComponentProps<typeof FullUI>) => {
  const taggedStoryHash = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(storyHash).map(([id, entry]) => {
          if (entry.type !== 'story') return [id, entry]

          // eslint-disable-next-line no-underscore-dangle -- RN 10.3 хранит CSF-теги только в подготовленных сторис.
          const tags = view._idToPrepared[id].tags

          return [
            id,
            {
              ...entry,
              tags,
              renderLabel: (item: { name: string }) => (
                <Text>
                  {item.name}
                  <StorybookTags tags={tags} />
                </Text>
              ),
            },
          ]
        })
      ),
    [storyHash]
  )

  return <FullUI {...props} storyHash={taggedStoryHash} />
}
