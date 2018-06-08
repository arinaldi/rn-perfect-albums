import React, { Component } from 'react'
import { StyleSheet, Switch, Alert } from 'react-native'
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
  Item,
  Label,
  Input,
  Form,
  Icon
} from 'native-base'
import { BASE_URL, ERRORS } from '../constants'

export default class EditAlbum extends Component {
  state = {
    artist: '',
    album: '',
    cd: false,
    aotd: false,
    error: ''
  }

  componentDidMount () {
    const { artist, album, cd, aotd } = this.props.navigation.state.params.item
    this.setState({ artist, album, cd, aotd })
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
      error: ''
    })
  }

  handleEdit = () => {
    const { screenProps, navigation } = this.props
    const { artist, album, cd, aotd } = this.state
    const { _id } = navigation.state.params.item
    const newData = { artist, album, cd, aotd }

    if (artist && album) {
      fetch(`${BASE_URL}/albums/${_id}`, {
        body: JSON.stringify(newData),
        headers: {
          'content-type': 'application/json',
          'authorization': screenProps.token
        },
        method: 'PUT'
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          screenProps.handleEdit(data.id, newData)
          screenProps.handleToast('updated')
          navigation.goBack()
        }
      })
      .catch(err => {
        const error = err.message ? err.message : ERRORS.GENERIC
        this.setState({ error })
      })
    }
  }

  handleDelete = () => {
    const { _id } = this.props.navigation.state.params.item

    Alert.alert(
      'Delete Album',
      'Are you sure you want to delete this album?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        { text: 'Delete', style: 'destructive', onPress: () => this.deleteItem(_id) }
      ]
    )
  }

  deleteItem = (id) => {
    const { screenProps, navigation } = this.props

    fetch(`${BASE_URL}/albums/${id}`, {
      headers: {
        'content-type': 'application/json',
        'authorization': screenProps.token
      },
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      if (data) {
        screenProps.handleDelete(id)
        screenProps.handleToast('deleted')
        navigation.goBack()
      }
    })
    .catch(err => {
      const error = err.message ? err.message : ERRORS.GENERIC
      this.setState({ error })
    })
  }

  render () {
    const { artist, album, cd, aotd, error } = this.state

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Edit Album</Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={styles.content}>
          <Form>
            <Item stackedLabel>
              <Label>Artist</Label>
              <Input
                value={artist}
                onChangeText={value => this.handleChange('artist', value)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Album</Label>
              <Input
                value={album}
                onChangeText={value => this.handleChange('album', value)}
              />
            </Item>
            <Item stackedLabel>
              <Label>CD</Label>
              <Switch
                value={cd}
                onValueChange={value => this.handleChange('cd', value)}
              />
            </Item>
            <Item stackedLabel>
              <Label>AotD</Label>
              <Switch
                value={aotd}
                onValueChange={value => this.handleChange('aotd', value)}
              />
            </Item>
            <Button
              block
              light
              onPress={this.handleEdit}
              style={styles.button}
            >
              <Text>Save</Text>
            </Button>
            <Button
              block
              danger
              onPress={this.handleDelete}
              style={styles.button}
            >
              <Text>Delete</Text>
            </Button>
            <Text style={styles.error}>{error}</Text>
          </Form>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1
  },
  button: {
    marginTop: 20
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center'
  }
})
