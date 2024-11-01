import type { Icon } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { View, Text } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import type { BadgeSeverity } from '../../Badge/Badge'
import { type MenuItemTemplateAccessory, MenuItemAccessory } from '../MenuItemAccessory'
import { MenuItemIcon } from '../MenuItemIcon'

export interface MenuItemTemplateProps {
  title: string
  caption?: string
  Icon?: Icon
  badgeSeverity?: BadgeSeverity
  prefix: MenuItemTemplateAccessory
  suffix: MenuItemTemplateAccessory
  extra: React.ReactNode
}

export const MenuItemTemplate = memo<MenuItemTemplateProps>(
  ({ title, caption, Icon, badgeSeverity, prefix = 'none', suffix = 'none', extra }) => {
    const styles = useStyles()

    const icon = useMemo(() => {
      return Icon !== undefined ? (
        <MenuItemIcon Icon={Icon} badgeSeverity={badgeSeverity} style={styles.icon} />
      ) : null
    }, [Icon, styles.icon, badgeSeverity])

    return (
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          <MenuItemAccessory iconStyle={styles.accessory} type={prefix} />
          <View style={styles.templateContainer}>
            {icon}
            <View style={styles.textContainer}>
              <Text style={[styles.title, styles.titleColor]}>{title}</Text>
              <Text style={[styles.caption, styles.captionColor]}>{caption}</Text>
            </View>
            {extra}
          </View>
        </View>
        <MenuItemAccessory iconStyle={styles.accessory} type={suffix} />
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, spacing, typography }) => ({
  accessory: {
    color: theme.Menu.Item.menuitemIconColor,
    width: theme.Menu.Item.menuitemSubmenuIconFontSize,
    height: theme.Menu.Item.menuitemSubmenuIconFontSize,
  },
  icon: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
    color: theme.Menu.Item.menuitemIconColor,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  templateContainer: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-2'],
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: theme.General.inlineSpacing,
    paddingHorizontal: theme.Menu.Item.menuitemPaddingLeftRight,
    paddingVertical: theme.Menu.Item.menuitemPaddingTopBottom,
    borderColor: theme.Menu.Item.menuitemBorderColor,
    borderWidth: 1, // theme.Menu.Item.menuitemBorder, - установить когда там будет числовое значение
    borderRadius: theme.Menu.Item.menuitemBorderRadius,
    backgroundColor: 'lightgray', // theme.Menu.Item.menuitemBg,
  },
  textContainer: {
    flexDirection: 'column',
    gap: spacing.Gap['gap-1'],
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
  },
  titleColor: {
    color: theme.Menu.Item.menuitemTextColor,
  },
  caption: {
    fontSize: 12,
    textAlign: 'left',
  },
  captionColor: {
    color: theme.Menu.Item.menuitemTextColor,
  },
}))

/*
 import * as React from "react";
import {Image, StyleSheet, Text, View} from "react-native";

const MenuItemTemplate = () => {
  	
  	return (
    		<View style={[styles.statedefaultCheckedfalse, styles.containerTemplateFlexBox]}>
      			<Image style={[styles.tiChevronRightIcon, styles.iconLayout]} resizeMode="cover" source="ti-chevron-right.png" />
      			<View style={styles.containerTemplateFlexBox}>
        				<Image style={styles.iconLayout} resizeMode="cover" source="container-icon.png" />
        				<View style={styles.containerText}>
          					<Text style={[styles.menuitem, styles.captionTypo]}>MenuItem</Text>
          					<Text style={[styles.caption, styles.captionTypo]}>Caption</Text>
        				</View>
        				<View style={styles.layoutvertical1}>
          					<View style={[styles.layoutmaster, styles.labelFlexBox]}>
            						<Text style={[styles.label, styles.labelFlexBox]}>{`◇
              							Cell`}</Text>
          					</View>
        				</View>
      			</View>
      			<Image style={[styles.tiChevronRightIcon, styles.iconLayout]} resizeMode="cover" source="ti-chevron-right.png" />
    		</View>);
};

const styles = StyleSheet.create({
  	containerTemplateFlexBox: {
    		gap: 7,
    		flexDirection: "row",
    		alignItems: "center"
  	},
  	iconLayout: {
    		height: 18,
    		width: 18
  	},
  	captionTypo: {
    		textAlign: "left",
    		fontFamily: "Roboto-Regular"
  	},
  	labelFlexBox: {
    		justifyContent: "center",
    		alignItems: "center"
  	},
  	tiChevronRightIcon: {
    		overflow: "hidden"
  	},
  	menuitem: {
    		fontSize: 14,
    		color: "rgba(0, 0, 0, 0.8)"
  	},
  	caption: {
    		fontSize: 12,
    		color: "rgba(0, 0, 0, 0.6)"
  	},
  	containerText: {
    		gap: 4
  	},
  	label: {
    		fontSize: 10,
    		lineHeight: 10,
    		color: "#188700",
    		textAlign: "center",
    		display: "flex",
    		width: 35,
    		height: 35,
    		fontFamily: "Roboto-Regular",
    		justifyContent: "center"
  	},
  	layoutmaster: {
    		alignSelf: "stretch",
    		borderStyle: "dashed",
    		borderColor: "#188700",
    		borderRadius: 0.001,
    		overflow: "hidden",
    		borderWidth: 1
  	},
  	layoutvertical1: {
    		alignItems: "center"
  	},
  	statedefaultCheckedfalse: {
    		borderRadius: 7,
    		backgroundColor: "rgba(255, 255, 255, 0)",
    		borderStyle: "solid",
    		borderColor: "rgba(255, 255, 255, 0)",
    		flex: 1,
    		width: "100%",
    		paddingHorizontal: 11,
    		paddingVertical: 7,
    		borderWidth: 1
  	}
});

export default MenuItemTemplate;
 
 */
