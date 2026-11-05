import { Text } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../src/theme'

type TagTone = keyof ThemeType['components']['tag']['colorScheme']

const tagDefinitions: Record<
  string,
  { label: string; tone: TagTone } | undefined
> = {
  deprecated: { label: 'deprecated', tone: 'warn' },
  'version:2.0': { label: '2.0', tone: 'info' },
  'design:pending': { label: 'design pending', tone: 'secondary' },
  'migration:excluded': { label: '× no migration', tone: 'danger' },
}

const StorybookTag = ({ tag }: { readonly tag: string }) => {
  const definition = tagDefinitions[tag]

  if (!definition) return null

  return (
    <Text>
      {' '}
      <Text style={styles.badge(definition.tone)}>
        {` ${definition.label} `}
      </Text>
    </Text>
  )
}

export const StorybookTags = ({
  tags,
}: {
  readonly tags: readonly string[]
}) => (
  <>
    {tags.map((tag) => (
      <StorybookTag key={tag} tag={tag} />
    ))}
  </>
)

const styles = StyleSheet.create(({ components, fonts, semantic }) => ({
  badge: (tone: TagTone) => ({
    fontSize: components.tag.root.fontSize - 1,
    fontWeight: fonts.fontWeight.demibold,
    color: semantic.colorScheme.color.fg.default,
    backgroundColor: components.tag.colorScheme[tone].background,
  }),
}))
