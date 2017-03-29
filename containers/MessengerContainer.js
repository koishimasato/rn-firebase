'use strict';

import React, {
  Component,
} from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
} from 'react-native';
import  firebaseConfig  from '../components/firebaseConfig';
console.log(firebaseConfig);

const GiftedMessenger = require('react-native-gifted-messenger');
const firebase = require('firebase');

const STATUS_BAR_HEIGHT = 0;
const CONTAINER_MARGIN = 20;
const USER_NAME = 'ios';
const AVATAR_URL = 'https://source.unsplash.com/sseiVD2XsOk/100x100';

if (Platform.OS == 'ios') {
  const STATUS_BAR_HEIGHT = 0;
  const CONTAINER_MARGIN = 20;
  const USER_NAME = 'ios';
  const AVATAR_URL = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
} else {
  const STATUS_BAR_HEIGHT = 27;
  const CONTAINER_MARGIN = 0;
  const USER_NAME = 'android';
  const AVATAR_URL = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
}

class MessengerContainer extends Component {

  constructor(props) {
    super(props);

    const firebaseApp = firebase.initializeApp(firebaseConfig);

    this._messagesRef = firebaseApp.database().ref().child('messages');
    this._messages = [];
    this.storageRef = firebase.storage().ref();
    this._images = [];

    this.state = {
      messages: this._messages,
      images: this._images,
      typingMessage: ''
    };
  }

  componentDidMount() {
    this._messagesRef.on('child_added', (child) => {
      console.log(child.val());
      this.handleReceive({
        text: child.val().text,
        name: child.val().name,
        image: {uri: child.val().avatarUrl || 'https://facebook.github.io/react/img/logo_og.png'},
        position: child.val().name == USER_NAME && 'right' || 'left',
        date: new Date(child.val().date),
        uniqueId: child.key
      });
    });
  }

  setMessages(messages) {
    this._messages = messages;

    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    this._messagesRef.push({
      text: message.text,
      name: USER_NAME,
      avatarUrl: AVATAR_URL,
      date: new Date().getTime()
    })
  }

  handleReceive(message = {}) {
    this.setMessages(this._messages.concat(message));
  }

  render() {
    return (
      <View style={{marginTop: CONTAINER_MARGIN}}>
        <GiftedMessenger
          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          maxHeight={Dimensions.get('window').height - STATUS_BAR_HEIGHT - CONTAINER_MARGIN}
        />
      </View>
    );
  }
}


module.exports = MessengerContainer;
