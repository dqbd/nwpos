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

const capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}


export default class ListItem extends React.PureComponent {
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
    const { item, onEdit, searching } = this.props
    const { expanded, deleting } = this.state

    const { ean, name, price, qty, retail_price, retail_qty } = item

    return (
      <View style={Object.assign({}, styles.item, (searching && styles.searching) || {})}>
        <TouchableOpacity style={styles.header} onPress={() => this.handleToggle(ean)}>
          <View style={styles.name}>
            <Text style={styles.namePart}>{capitalize(name)}</Text>
            <Text style={styles.eanPart}>{ean}</Text>
          </View>
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
          <Text>{`Jméno: ${name}`}</Text>
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
                title="Upravit"
                onPress={() => onEdit({
                  ean, name,
                  price: `${price}`,
                  qty: `${qty}`,
                  retail_price: `${retail_price}`,
                  retail_qty: `${retail_qty}`,
                })}
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
  searching: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
    fontSize: 18,
    flexWrap: 'wrap',
  },
  namePart: {
    flexWrap: 'wrap',
    fontSize: 18,
  },
  eanPart: {
    flexWrap: 'wrap',
    fontSize: 12,
  },
  price: {
    fontSize: 14,
  }
})
