import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import * as firebase from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [addressee, setAddressee] = useState('');
 
  useEffect(() => {
    if(route?.params?.userToChatWith){
      firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )
      firebase.getByDocIdFromFirestore("users", route.params.userToChatWith.key).then( (us) => { setAddressee(us) })
      route.params.setHaveNewMessages(false)
    }
  }, [route])
 
  useLayoutEffect(()=>{
    const action = (doc) => {
      // const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      setMessages(doc.data().messages.map(doc => ({
        _id: doc._id,
        createdAt: doc.createdAt.toDate(),
        text: doc.text,
        user: doc.user
      })))
    }

    firebase.setSnapshotById("chats", route.params.hKey, action)
   
  },[user,addressee])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user
    } = messages[0]
  }, [])
 
  useLayoutEffect(()=>{
    if(messages.length !== 0)
      firebase.updateCollectAtFirestore("chats", route.params.hKey, {messages})
  },[messages])

  return (
    <GiftedChat
      timeFormat='HH:mm:ss'
      dateFormat='DD/MM/YYYY'
      messages={messages}
      showAvatarForEveryMessage={true}
      showUserAvatar={true }
      onSend={messages => onSend(messages)}
      renderUsernameOnMessage
      renderAvatarOnTop
      messagesContainerStyle={{ backgroundColor: "white"}}
      user={{
        _id: user.email,
        name: user.fName + " " + user.lName,
        avatar: user.uImage
      }}
    />
  )
}

export default ChatScreen

const styles = StyleSheet.create({})