import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { db, auth, signInAnonymously, onAuthStateChanged, collection, addDoc, onSnapshot, orderBy, query } from "../firebase"
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
      isConnected: false,
      image: null,
      location: null,
    };

    // reference to the Firestore message collection
    this.referenceChatMessages = collection(db, "messages");
  }

  // retrieves messages form storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // saves messages in the storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // deletes messages during deveopment
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // defines name and pulls data from routed input
    let name = this.props.route.params.name;
    // adds given name to screen at the top
    this.props.navigation.setOptions({ title: name });

    // checks if the app is connected
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
      } else {
        console.log('offline');
      }
    });

    // anonymous sign-in - authentication 
    this.authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      }

      this.setState((prevState) => ({
        ...prevState,
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      }));
      // listens for updates in the collection
      this.unsubscribe = onSnapshot(query(this.referenceChatMessages, orderBy("createdAt", "desc")), this.onCollectionUpdate);
      //orderBy("createdAt", "desc"),
    });
    this.getMessages();

  }
  // when col. gets updated, message state is set with current data
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loops through documents
    querySnapshot.forEach((doc) => {
      // gets 'snapshot' of data
      let data = doc.data();
      if (data._id) {
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
      }
      // console.log(messages)
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
  async addMessages() {
    const message = this.state.messages[0];
    // adds a new messages to collection
    //https://firebase.google.com/docs/firestore/manage-data/add-data
    await addDoc(this.referenceChatMessages, {
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
      // this.addMessages();
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

  // renders the input toolbar if the user is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  //return a MapView 
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

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
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}