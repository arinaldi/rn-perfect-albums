import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Body,
  Title,
  H1
} from 'native-base'
import { BASE_URL, ERRORS } from '../constants'
import { saveToken } from '../utils'

export default class Setup extends Component {
  state = {
    username: '',
    password: '',
    error: ''
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value,
      error: ''
    })
  }

  handleSubmit = () => {
    const { handleSignIn } = this.props
    const { username, password } = this.state

    if (username && password) {
      fetch(`${BASE_URL}/api/signin`, {
        body: JSON.stringify({ username, password }),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      })
      .then(res => {
        if (res.status === 401) {
          this.setState({ error: ERRORS.INVALID_CREDS })
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data) {
          handleSignIn(data.token)
          saveToken(data.token)
        }
      })
      .catch(err => {
        const error = err.message ? err.message : ERRORS.GENERIC
        this.setState({ error })
      })
    }
  }

  render () {
    const { username, password, error } = this.state

    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <H1 style={styles.header}>Perfect Albums</H1>
          <Form>
            <Item stackedLabel>
              <Label>Username</Label>
              <Input
                value={username}
                onChangeText={value => this.onChangeText('username', value)}
                autoCapitalize='none'
              />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                value={password}
                secureTextEntry
                onChangeText={value => this.onChangeText('password', value)}
                onSubmitEditing={this.handleSubmit}
              />
            </Item>
            <Button
              block
              light
              onPress={this.handleSubmit}
              style={styles.button}
            >
              <Text>Sign In</Text>
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
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20
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
