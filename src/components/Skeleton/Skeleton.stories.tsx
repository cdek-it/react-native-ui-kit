import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from './Skeleton'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowSkeleton: {
    height: 50,
    flex: 1,
  },
})

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
  render: () => (
    <View style={{ gap: 10 }}>
      <Skeleton style={{ height: 50 }} />
      <View style={styles.row}>
        <Skeleton style={{ height: 50, width: 100 }} />
        <Skeleton style={styles.rowSkeleton} />
      </View>
      <View style={styles.row}>
        <Skeleton style={styles.rowSkeleton} />
        <Skeleton style={styles.rowSkeleton} />
        <Skeleton style={styles.rowSkeleton} />
        <Skeleton style={styles.rowSkeleton} />
        <Skeleton style={styles.rowSkeleton} />
      </View>
      <View style={styles.row}>
        <Skeleton style={{ width: 50, height: 50, borderRadius: 50 }} />
        <View style={{ gap: 5, justifyContent: 'center' }}>
          <Skeleton style={{ height: 15, width: 100 }} />
          <Skeleton style={{ height: 15, width: 200 }} />
        </View>
      </View>
    </View>
  ),
}

export default meta

type Story = StoryObj<typeof Skeleton>

const SkeletonStory: Story = {}

export { SkeletonStory as Skeleton }
