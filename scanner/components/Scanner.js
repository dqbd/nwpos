import React from 'react'
import {
  View,
  Modal,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Icon, BarCodeScanner, Permissions } from 'expo'

export default class Scanner extends React.Component {
  state = {
    modalOpen: false,
    hasCameraPermission: null,
  }

  handleOpen = () => {
    if (this.state.hasCameraPermission) {
      this.setState({ modalOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { modalOpen } = this.state
    const { onBarcodeRead, style, disabled } = this.props
    

    return (
      <>
        <Modal animationType="slide" visible={modalOpen} presentationStyle="formSheet" onRequestClose={this.handleClose}>
          <View style={{ flex: 1 }}>
            <BarCodeScanner
              style={StyleSheet.absoluteFill}
              type={BarCodeScanner.Constants.Type.back}
              onBarCodeRead={({ data }) => {
                if (onBarcodeRead) onBarcodeRead(data)
                this.handleClose()
              }}
            />

            <View style={{ position: 'absolute', top: 0, left: 0 }}>
              <TouchableOpacity style={{ padding: 15 }} onPress={this.handleClose}>
                <Icon.Ionicons
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  color="#FFF"
                  size={26}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={style}
          disabled={disabled}
          onPress={this.handleOpen}
        >
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'}
            color="#000"
            size={26}
          />
        </TouchableOpacity>
      </>
    )
  }
}