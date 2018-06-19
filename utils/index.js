import { AsyncStorage } from 'react-native'

const KEY = 'PerfectAlbums:token'

export const getToken = async () => {
  const token = await AsyncStorage.getItem(KEY)
  return token ? token : ''
}

export const saveToken = async (token) => {
  await AsyncStorage.setItem(KEY, token)
}

export const clearToken = async () => {
  await AsyncStorage.removeItem(KEY)
}

export const sortByAlbum = (a, b) => {
  if (a.artist < b.artist) return -1
  if (a.artist > b.artist) return 1
  if (a.album < b.album) return -1
  if (a.album > b.album) return 1
  return 0 
}
