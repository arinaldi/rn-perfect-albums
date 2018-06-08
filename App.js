import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { Root, Toast } from 'native-base'
import * as Expo from 'expo'
import SignIn from './components/SignIn'
import Albums from './components/Albums'
import EditAlbum from './components/EditAlbum'
import AddAlbum from './components/AddAlbum'
import { getToken, clearToken } from './utils'
import { BASE_URL, ERRORS } from './constants'

const MainStack = createStackNavigator({
  Albums: { screen: Albums },
  EditAlbum: { screen: EditAlbum }
},
{
  headerMode: 'none'
})

const RootStack = createStackNavigator({
  Main: { screen: MainStack },
  AddAlbum: { screen: AddAlbum },
},
{
  mode: 'modal',
  headerMode: 'none'
})

export default class App extends Component {
  state = {
    isReady: false,
    isSignedIn: false,
    token: '',
    data: [],
    filteredData: [],
    isLoading: true,
    isRefreshing: false
  }

  componentWillMount () {
    this.loadFonts()
  }

  async componentDidMount () {
    const token = await getToken()
    if (token) {
      this.handleSignIn(token)
    }
  }

  async loadFonts () {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
    });
    this.setState({ isReady: true })
  }

  handleSignIn = (token) => {
    this.setState({
      isSignedIn: true,
      token
    })
  }

  handleSignOut = () => {
    clearToken()
    this.setState({
      isSignedIn: false,
      token: ''
    })
  }

  handleToast = (action) => {
    Toast.show({
      text: `Album ${action} successfully`,
      type: 'success',
      position: 'top',
      duration: 2000
    })
  }

  fetchData = () => {
    fetch(`${BASE_URL}/albums`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data,
          filteredData: data.slice(0, 50),
          isLoading: false,
          isRefreshing: false
        })
      })
  }

  refetchData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.fetchData()
    })
  }

  filterData = (query) => {
    const data = this.state.data.filter(item => {
      return item.artist.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      item.album.toLowerCase().indexOf(query.toLowerCase()) >= 0
    })

    this.setState({ filteredData: data.slice(0, 50) })
  }

  handleAdd = (album) => {
    const { data } = this.state
    data.push(album)

    this.setState({
      data,
      filteredData: data.slice(0, 50)
    })
  }

  handleEdit = (_id, album) => {
    let { data } = this.state
    const index = data.findIndex(item => item._id === _id)
    const updatedAlbum = { ...album, _id }
    data = [
      ...data.slice(0, index),
      updatedAlbum,
      ...data.slice(index + 1)
    ]

    this.setState({
      data,
      filteredData: data.slice(0, 50)
    })
  }

  handleDelete = (id) => {
    let { data } = this.state
    data = data.filter(item => item._id !== id)

    this.setState({
      data,
      filteredData: data.slice(0, 50)
    })
  }

  render () {
    const { isReady, isSignedIn, token, filteredData, isLoading, isRefreshing } = this.state

    if (!isReady) return <Expo.AppLoading />
    if (!isSignedIn) return <SignIn handleSignIn={this.handleSignIn} />

    return (
      <Root>
        <RootStack
          screenProps={{
            token,
            filteredData,
            isLoading,
            isRefreshing,
            fetchData: this.fetchData,
            refetchData: this.refetchData,
            filterData: this.filterData,
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleDelete: this.handleDelete,
            handleToast: this.handleToast,
            handleSignOut: this.handleSignOut
        }}
        />
      </Root>
    )
  }
}
