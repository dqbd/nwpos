import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'

import ListScreen from '../screens/ListScreen'

const ListStack = createStackNavigator({
  list: ListScreen,
})

ListStack.navigationOptions = {
  tabBarLabel: 'Seznam zboží',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-list' : 'md-list'
      }
    />
  ),
}

export default ListStack