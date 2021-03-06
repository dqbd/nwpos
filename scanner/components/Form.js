import React from 'react'
import { StyleSheet, Text, View, Button, TextInput, Platform, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Icon } from 'expo'
import { withNavigation } from 'react-navigation'
import Scanner from './Scanner'

class Form extends React.PureComponent {
  getInitialValues = () => Object.assign({}, this.props.initialValues)

  state = {
    submitting: false,
    values: this.getInitialValues(),
  }

  static navigationOptions = {
    title: 'Přidat zboží',
  }

  handleBarCodeRandom = async () => {
    const ean = await this.props.onGenerateEan()
    this.handleChange('ean', `${ean}`)
  }

  handleSubmit = async () => {
    if (!this.isSubmitValid()) return
    
    this.setState({ submitting: true }, async () => {

      const values = Object.assign({}, this.state.values, { 
        qty: (this.state.values.qty && Number.parseInt(this.state.values.qty, 10)) || 0,
        price: (this.state.values.price && Number.parseFloat(this.state.values.price, 10)) || 0,
        retail_price: (this.state.values.retail_price && Number.parseFloat(this.state.values.retail_price, 10)) || 0,
        retail_qty: (this.state.values.retail_qty && Number.parseInt(this.state.values.retail_qty, 10)) || 0
      })

      await this.props.onSubmit({ values })
      this.setState({ submitting: false, values: this.getInitialValues() })
      if (this.props.onSubmitDone) {
        this.props.onSubmitDone()
      }
    })
  }

  handleChange = (name, value) => {
    const normalized = value.length <= 0 ? undefined : value
    this.setState({ values: Object.assign({}, this.state.values, { [name]: normalized }) })
  }

  isSubmitValid = () => {
    const { values } = this.state
    return (
      !!values.ean && !!values.name &&
      !isNaN(values.price) && !isNaN(values.qty) &&
      (!values.retail_price || !isNaN(values.retail_price)) &&
      (!values.retail_qty || !isNaN(values.retail_qty))
    )
  }

  render() {
    const { values, submitting } = this.state
    const { eanDisabled, submitTitle, onClose } = this.props
    const valid = this.isSubmitValid()

    return (
      <>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>{`Čárový kód${eanDisabled ? `: ${values.ean}` : ''}`}</Text>
            { !eanDisabled && <View style={styles.horizontal}>
              <TextInput
                style={Object.assign({}, styles.input, styles.ean)}
                onChangeText={(val) => this.handleChange('ean', val)}
                value={values.ean}
              /> 
              <Scanner
                style={styles.scan}
                disabled={eanDisabled}
                onBarcodeRead={(ean) => this.handleChange('ean', ean)}
              />
              {/* <TouchableOpacity style={styles.scan} disabled={eanDisabled} onPress={this.handleBarCodeRandom}>
                <Icon.Ionicons
                  name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'}
                  color="#000"
                  size={26}
                />
              </TouchableOpacity> */}
            </View> }
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Jméno</Text>
            <TextInput style={styles.input} onChangeText={(val) => this.handleChange('name', val)} value={values.name} name="name" />
          </View>
          <View style={styles.horizontal}>
            <View style={Object.assign({}, styles.formContainer, styles.price)}>
              <Text style={styles.label}>Cena</Text>
              <TextInput style={styles.input} onChangeText={(val) => this.handleChange('price', val)} value={values.price} name="price" keyboardType="numeric" />
            </View>
            <View style={Object.assign({}, styles.formContainer, styles.qty)}>
              <Text style={styles.label}>Ks</Text>
              <TextInput style={styles.input} onChangeText={(val) => this.handleChange('qty', val)} value={values.qty} name="qty" keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.horizontal}>
            <View style={Object.assign({}, styles.formContainer, styles.price)}>
              <Text style={styles.label}>Původní cena</Text>
              <TextInput style={styles.input} onChangeText={(val) => this.handleChange('retail_price', val)} value={values.retail_price} name="retail_price" keyboardType="numeric" />
            </View>
            <View style={Object.assign({}, styles.formContainer, styles.qty)}>
              <Text style={styles.label}>Původ. Ks</Text>
              <TextInput style={styles.input} onChangeText={(val) => this.handleChange('retail_qty', val)} value={values.retail_qty} name="retail_qty" keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.submit}>
            <Button
              title={submitTitle}
              onPress={this.handleSubmit}
              disabled={submitting || !valid}
            />
          </View>
          <View style={styles.close}>
            <Button
              title="Zavřít"
              onPress={onClose}
              disabled={submitting}
            />
          </View>
        </View>
        { submitting && <View style={styles.loading}>
            <ActivityIndicator size="large" />
        </View> }
      </>
    )
  }
}

export default withNavigation(Form)

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#fff',
  },
  cameraView: {
    flex: 1,
  },
  label: {
    paddingBottom: 5,
    fontSize: 12,
    position: 'absolute',
    backgroundColor: '#fff',
    top: -9,
    left: 3,
    paddingLeft: 5,
    paddingRight: 5,
    color: '#888',
  },
  formContainer: {
    marginBottom: 15,
    padding: 8,
    paddingTop: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: 5,
    paddingBottom: 5,
  },
  ean: {
    flexGrow: 1,
  },
  submit: {
    paddingBottom: 5,
  },

  price: {
    flexGrow: 3,
    marginRight: 5,
  },
  qty: {
    flexGrow: 1,
    marginLeft: 5,
  },
  scan: {
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    marginLeft: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
  }
})
