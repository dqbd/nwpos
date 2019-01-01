import React from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  AsyncStorage,
  Button,
} from 'react-native'
import Form from '../components/Form'
import NativeModal from 'react-native-modal'

import { Icon } from 'expo'
import { withNavigation, NavigationEvents } from 'react-navigation'

import ListItem from '../components/ListItem'
import Scanner from '../components/Scanner'
import UrlChangeButton from '../components/UrlChangeButton'

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Seznam zboží',
    headerStyle: {
      backgroundColor: 'transparent',
    },
    headerRight: (
      <UrlChangeButton
        onUrlChange={navigation.getParam('resetUrl')}
        getInitialUrl={navigation.getParam('getUrl')}
      />
    )
  })

  state = {
    url: null,
    refreshing: true,
    editing: false,
    adding: false,
    editingValues: {},
    items: [],
  }

  async componentDidMount() {
    const url = (await AsyncStorage.getItem('@nwpos:url')) || 'http://192.168.1.103:8080'
    this.setState({ url }, this.fetchData)
    this.props.navigation.setParams({ resetUrl: this.resetUrl, getUrl: () => this.state.url })
  }
  
  fetchData = async (bootstrap = false) => {
    if (!this.state.url) return
    if (!bootstrap) this.setState({ refreshing: true })
    const { items } = await fetch(`${this.state.url}/items`).then(a => a.json())
    this.setState({ items, refreshing: false })
  }

  handleFormSubmit = async ({ values }) => {
    const { editing, adding } = this.state
    if (!editing && !adding) return
    
    await fetch(`${this.state.url}${editing ? '/setitem' : '/additem'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ean: values.ean,
        name: values.name,
        price: Number(values.price),
        qty: Number(values.qty),
        retail_price: Number(values.retail_price),
      })
    })

    await this.fetchData()
  }

  handleItemRemove = async (ean) => {
    await fetch(`${this.state.url}/deleteitem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ean }),
    })

    return this.fetchData()
  }

  handleFormClose = () => {
    this.setState({ editingValues: {}, editing: false, adding: false })
  }

  handleEanGenerate = async () => {
    const { ean } = await fetch(`${this.state.url}/ean`).then(a => a.json())
    return ean
  }

  handleItemEdit = (values) => this.setState({ editingValues: values, editing: true })

  handleBarCodeScanned = (data) => this.setState({ modalOpen: false, searchValue: `${data}` })

  resetUrl = async (url) => {
    await AsyncStorage.setItem('@nwpos:url', url)
    this.setState({ url }, this.fetchData)
  }

  render() {
    const { items, refreshing, editing, adding, editingValues, searchValue } = this.state

    const filteredItems = !searchValue ? items : items.filter(({ ean, name }) => {
      return `${ean}`.toLowerCase().includes(searchValue.toLowerCase()) || `${name}`.toLowerCase().includes(searchValue.toLowerCase())
    })

    return (
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={this.fetchData}
        />
        <FlatList
          data={[false, ...filteredItems]}
          onRefresh={this.fetchData}
          refreshing={refreshing}
          style={{ flexGrow: 1 }}
          keyExtractor={({ ean }) => `${ean}`}
          renderItem={({ item }) => {

            if (item === false) {
              return (
                <View style={styles.horizontal}>
                  <TextInput
                    style={styles.search}
                    value={searchValue}
                    placeholder="Najít zboží"
                    placeholderTextColor="#ccc"
                    onChangeText={searchValue => this.setState({ searchValue })}
                  />

                  <Scanner
                    style={styles.scanbtn}
                    onBarcodeRead={this.handleBarCodeScanned}
                  />

                  <TouchableOpacity style={styles.addbtn} onPress={() => this.setState({ adding: true })}>
                    <Icon.Ionicons
                      name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}
                      color="#000"
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
              )
            }
            
            return <ListItem item={item} onRemove={this.handleItemRemove} onEdit={this.handleItemEdit} />
          }}
        />
        <NativeModal
          avoidKeyboard 
          isVisible={editing || adding}
          onBackButtonPress={this.handleFormClose}
          onBackdropPress={this.handleFormClose}
          hardwareAccelerated
        >
          <View style={styles.modal}>
            <Form
              eanDisabled={editing}
              submitTitle={editing ? 'Upravit' : 'Přidat'}
              initialValues={editingValues}
              onSubmit={this.handleFormSubmit}
              onGenerateEan={this.handleEanGenerate}
              onSubmitDone={this.handleFormClose}
              onClose={this.handleFormClose}
            />
          </View>
        </NativeModal>
      </View>
    )
  }
}

export default withNavigation(ListScreen)

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 18,
    paddingBottom: 10,
    borderRadius: 8,
  },
  horizontal: {
    flexDirection: 'row',
    margin: 10,
  },
  cameraView: {
    flex: 1,
  },
  search: {
    backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 20,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    flexGrow: 1,
  },
  scanbtn: {
    backgroundColor: '#fff',
    paddingRight: 20,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderLeftWidth: 0
  },
  addbtn: {
    backgroundColor: '#fff',
    marginLeft: 10,
    flexShrink: 0,
    paddingLeft: 18,
    paddingRight: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  container: {
    flex: 1,
  },
  item: {
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  content: {
    padding: 10,
    backgroundColor: '#fbfbfb',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  name: {
    fontSize: 18,
    flexGrow: 1,
  },
  price: {
    fontSize: 18,
  }
})
