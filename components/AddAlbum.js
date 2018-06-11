import React, { Component } from 'react'
import { StyleSheet, Switch } from 'react-native'
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
  Form
} from 'native-base'
import { BASE_URL, ERRORS } from '../constants'

export default class AddAlbum extends Component {
  state = {
    artist: '',
    album: '',
    cd: false,
    aotd: false,
    error: ''
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
      error: ''
    })
  }

  handleSubmit = () => {
    const { screenProps, navigation } = this.props
    const { artist, album, cd, aotd } = this.state

    if (artist && album) {
      fetch(`${BASE_URL}/albums`, {
        body: JSON.stringify({ artist, album, cd, aotd }),
        headers: {
          'content-type': 'application/json',
          'authorization': screenProps.token
        },
        method: 'POST'
      })
      .then(res => res.json())
      .then(data => {
        if (data) {
          screenProps.handleAdd(data)
          screenProps.handleToast('added')
          navigation.goBack()
        }
      })
      .catch(err => {
        const error = err.message ? err.message : ERRORS.GENERIC
        this.setState({ error })
      })
    }
  }

  render () {
    const { artist, album, cd, aotd, error } = this.state

    return (
      <Container>
        <Header>
          <Left>
            <Button hasText transparent onPress={() => this.props.navigation.goBack()}>
              <Text>Cancel</Text>
            </Button>
          </Left>
          <Body>
            <Title>Add Album</Title>
          </Body>
          <Right>
            <Button hasText transparent onPress={this.handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={styles.content}>
          <Form>
            <Item stackedLabel>
              <Label>Artist</Label>
              <Input
                value={artist}
                onChangeText={value => this.handleChange('artist', value)}
                autoFocus
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
  saveText: {
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center'
  }
})
