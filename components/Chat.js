import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import firebase from "firebase";
import "firebase/firestore";

// firebase config credentials
const firebaseConfig = {
  apiKey: "AIzaSyBA8JfGJlneemNummlt1VvL4Tyl4L1bY5Y",
  authDomain: "chat-app-d8756.firebaseapp.com",
  projectId: "chat-app-d8756",
  storageBucket: "chat-app-d8756.appspot.com",
  messagingSenderId: "345183361524",
  appId: "1:345183361524:web:cfec4f3f24efffde1c41a1"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
    };
    //initializing firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to the Firestore message collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    // defines name and pulls data from routed input
    let name = this.props.route.params.name;
    // adds given name to screen at the top
    this.props.navigation.setOptions({ title: name });
    // anonymous sign-in - authentication 
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // updates state of user 
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      // listens for updates in the collection
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
    // reference to specific collection
    this.referenceMessages = firebase.firestore().collection('messages');
    // listens for updates in collection
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)

  }
  // when col. gets updated, message state is set with current data
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loops through documents
    querySnapshot.forEach((doc) => {
      // gets 'snapshot' of data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages
    });
  };

  componentWillUnmount() {
    //unsubscribes from collection updates
    this.authUnsubscribe();
    this.unsubscribe();

  }

  // message added to databse
  addMessages() {
    const message = this.state.messages[0];
    // adds a new messages to collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

  // message gets send by user and shown in the chatroom
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    })
  }
  // custom chat bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          }
        }}
      />
    )
  }

  render() {
    // sets bg color which was selected 
    const { bgColor } = this.props.route.params;
    return (
      <View style={{ backgroundColor: bgColor, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}