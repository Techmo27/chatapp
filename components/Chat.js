import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { db, auth, signInAnonymously, onAuthStateChanged, collection, addDoc, onSnapshot, orderBy, query } from "../firebase"
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'

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

    // reference to the Firestore message collection
    this.referenceChatMessages = collection(db, "messages");
  }

  componentDidMount() {
    // defines name and pulls data from routed input
    let name = this.props.route.params.name;
    // adds given name to screen at the top
    this.props.navigation.setOptions({ title: name });
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

    });
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
    await addDoc(this.referenceChatMessages, {
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

  // appends previous messages into new messages state
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
    })
  }
  // custom chat bubble color settings
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'white',
          },
          left: {
            backgroundColor: 'grey',
          }
        }}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'white',
          }
        }}
      />
    )
  };

  // customizes system messages
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: "#fff",
        }}
      />
    );
  }

  render() {
    // sets bg color which was selected 
    const { bgColor } = this.props.route.params;
    return (
      <View style={{ backgroundColor: bgColor, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderSystemMessage={this.renderSystemMessage}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user,
            name: this.state.name,

          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
