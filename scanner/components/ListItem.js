import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Icon } from 'expo'

export default class ListItem extends React.Component {
  state = {
    expanded: false,
    deleting: false,
  }

  handleToggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  handleRemove = async () => {
    const { onRemove, item: { ean } } = this.props
    this.setState({ deleting: true })
    try {
      await onRemove(ean)
    } catch (err) {
      this.setState({ deleting: false })
    }
  }

  render() {
    const { item, onEdit } = this.props
    const { expanded, deleting } = this.state

    const { ean, name, price, qty, retail_price, retail_qty } = item

    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.header} onPress={() => this.handleToggle(ean)}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{`${price} Kč / ${qty} ks` }</Text>
          <Icon.Ionicons
            style={{ marginLeft: 10, transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
            name={Platform.OS === 'ios' ? 'ios-arrow-dropdown' : 'md-arrow-dropdown'}
            color="#000"
            size={26}
          />
        </TouchableOpacity>
        { expanded && <View style={styles.content}>
          
          <Text>{`Kód: ${ean}`}</Text>
          <Text>{`Aktuální cena: ${price} Kč`}</Text>
          <Text>{`Počet kusů ve skladu: ${qty} ks`}</Text>
          <Text />
          <Text>{`Cena zakoupení: ${retail_price} Kč`}</Text>
          <Text>{`Původní počet kusů: ${retail_qty} ks`}</Text>

          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
            { deleting && <ActivityIndicator size="small" /> }
            <View style={{ flexGrow: 1 }} />
            <View style={{ marginLeft: 10 }}>
              <Button
                onPress={this.handleRemove}
                color="#EF6C00"
                title="Smazat"
                disabled={deleting}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Button
                onPress={() => onEdit({
                  ean, name,
                  price: `${price}`,
                  qty: `${qty}`,
                  retail_price: `${retail_price}`,
                })}
                title="Upravit"
              />
            </View>
          </View>
        </View> }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  item: {
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  content: {
    padding: 10,
    backgroundColor: '#fbfbfb',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  name: {
    fontSize: 18,
    flexGrow: 1,
  },
  price: {
    fontSize: 14,
  }
})
