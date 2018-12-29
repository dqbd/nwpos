import React from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Button,
} from 'react-native'
import NativeModal from 'react-native-modal'

import { Icon } from 'expo'


export default class UrlChangeButton extends React.Component {
  state = {
    isOpen: false,
    url: null,
  }

  render() {
    return (
      <>
        <NativeModal
          isVisible={this.state.isOpen}
          onBackButtonPress={() => this.setState({ isOpen: false })}
          onBackdropPress={() => this.setState({ isOpen: false })}
        >
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 10 }}
              value={this.state.url}
              onChangeText={url => this.setState({ url })}
            />
            <Button title="Uložit" onPress={() => {
              this.props.onUrlChange(this.state.url)
              this.setState({ isOpen: false })
            }} />
          </View>
        </NativeModal>
        <TouchableOpacity style={{ marginRight: 15, marginLeft: 15 }} onPress={() => this.setState({ isOpen: true, url: this.props.getInitialUrl() })}>
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'}
            color="#000"
            size={26}
          />
        </TouchableOpacity>
      </>
    )
  }
}