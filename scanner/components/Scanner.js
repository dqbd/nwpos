import React from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Icon, BarCodeScanner, Permissions, Audio } from 'expo'

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

  handleClose = async (success = false) => {
    if (success === true) {
      await Audio.Sound.createAsync(require('../assets/beep.mp3'), { shouldPlay: true })
    }

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
              style={{ flex: 1}}
              type={BarCodeScanner.Constants.Type.back}
              barCodeTypes={[
                BarCodeScanner.Constants.BarCodeType.code39,
                BarCodeScanner.Constants.BarCodeType.code128,
                BarCodeScanner.Constants.BarCodeType.code93,
                BarCodeScanner.Constants.BarCodeType.codabar,
                BarCodeScanner.Constants.BarCodeType.upc_a,
                BarCodeScanner.Constants.BarCodeType.upc_e,
                BarCodeScanner.Constants.BarCodeType.ean13,
                BarCodeScanner.Constants.BarCodeType.ean8
              ]}
              onBarCodeRead={({ data }) => {
                if (onBarcodeRead) onBarcodeRead(data)
                this.handleClose(true)
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

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <TouchableOpacity style={{ padding: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={this.handleClose}>
                <Text style={{ color: '#fff' }}>Zavřít</Text>
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