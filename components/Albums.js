import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Title,
  Left,
  Right,
  Button,
  Icon,
  Spinner,
  Item,
  Input,
  ActionSheet
} from 'native-base'
import { BASE_URL, ERRORS } from '../constants'

const OPTIONS = ['Sign Out', 'Cancel']
const SIGN_OUT_INDEX = OPTIONS.indexOf('Sign Out')
const CANCEL_INDEX = OPTIONS.indexOf('Cancel')

export default class ListExample extends Component {
  state = {
    search: ''
  }

  componentDidMount () {
    this.props.screenProps.fetchData()
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
    this.props.screenProps.filterData(value)
  }

  handleClear = () => {
    this.setState({ search: '' })
    this.props.screenProps.filterData('')
  }

  handleAddModal = () => {
    this.props.navigation.navigate('AddAlbum')
    this.setState({ search: '' })
  }

  handleMore = () => {
    ActionSheet.show({
      options: OPTIONS,
      cancelButtonIndex: CANCEL_INDEX
    },
    buttonIndex => {
      if (buttonIndex === SIGN_OUT_INDEX) {
        this.props.screenProps.handleSignOut()
      }
    })
  }

  handleEditScreen = (data) => {
    this.props.navigation.navigate('EditAlbum', data)
    this.setState({ search: '' })
  }

  renderItem = ({ item }) => {
    return (
      <ListItem onPress={() => this.handleEditScreen({ item })}>
        <Body>
          <Text>{item.album}</Text>
          <Text note>{item.artist}</Text>
        </Body>
        <Right>
          <Icon name='arrow-forward' />
        </Right>
      </ListItem>
    )
  }

  render () {
    const { filteredData, isLoading, isRefreshing, refetchData } = this.props.screenProps
    const { search } = this.state

    if (isLoading) {
      return (
        <View style={[styles.flex, styles.center]}>
          <Spinner color='gray' />
        </View>
      )
    }

    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name='ios-search' />
            <Input
              placeholder='Search'
              value={search}
              onChangeText={value => this.onChangeText('search', value)}
            />
            <Icon name='ios-close-circle' style={styles.clear} onPress={this.handleClear} />
          </Item>
          <Right>
            <Button transparent onPress={this.handleAddModal}>
              <Icon name='add' />
            </Button>
            <Button transparent onPress={this.handleMore}>
              <Icon name='more' />
            </Button>
          </Right>
        </Header>
        <View style={styles.flex}>
          {
            filteredData.length === 0 ?
            <View style={[styles.flex, styles.empty]}><Text>No results</Text></View> :
            <FlatList
              data={filteredData}
              renderItem={this.renderItem}
              keyExtractor={item => item._id}
              onRefresh={refetchData}
              refreshing={isRefreshing}
            />
          }
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  center: {
    justifyContent: 'center'
  },
  empty: {
    alignItems: 'center',
    marginTop: 20
  },
  clear: {
    color: 'gray'
  }
})
