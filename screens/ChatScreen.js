import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import * as firebase from '../firebase'

const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [addressee, setAddressee] = useState('');
 
  useEffect(() => {
    if(route?.params?.userToChatWith){
      firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )
      firebase.getByDocIdFromFirestore("users", route.params.userToChatWith.key).then( (us) => { setAddressee(us)
      // setMessages([
      //   {
      //     _id: us.email,
      //     text: 'Hello developer',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 2,
      //       name: 'React Native',
      //       avatar: us.uImage,
      //     },
      //   },
      // ])
    }
      )
    }
  }, [route])
 
  useLayoutEffect(()=>{
    // firebase.getChatFromFirestore([user.email].concat([addressee.email]),route.params.hKey).then((messages) => setMessages(messages))
    firebase.getByDocIdFromFirestore('chats', route.params.hKey).then((obj) => setMessages(obj.messages.map(doc => ({
        _id: doc._id,
        createdAt: doc.createdAt.toDate(),
        text: doc.text,
        user: doc.user
    })))
  )
    
    // return unsubscribe
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