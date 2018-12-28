import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native'

export default class ListItem extends React.Component {
  state = {
    expanded: false,
  }

  handleToggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { item, onRemove, onEdit } = this.props
    const { expanded } = this.state

    const { ean, name, price, qty, retail_price, retail_qty } = item

    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.header} onPress={() => this.handleToggle(ean)}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{`${price} Kč / ${qty} ks` }</Text>
        </TouchableOpacity>
        { expanded && <View style={styles.content}>
          <Text>{`Kód: ${ean}`}</Text>
          <Text>{`Zakoupeno: ${retail_qty} ks za ${retail_price} Kč`}</Text>

          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
            <View style={{ marginLeft: 10 }}>
              <Button
                onPress={() => onRemove(ean)}
                color="#EF6C00"
                title="Smazat"
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
