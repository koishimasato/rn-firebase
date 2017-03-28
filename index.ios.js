'use strict';

import React, { Component } from 'react';
import ReactNative from 'react-native';
import TodoContainer from './containers/TodoContainer'
import MessengerContainer from './containers/MessengerContainer'

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = ReactNative;

class ReactNativeTodo extends Component {
  render() {
    return (
      <TodoContainer/>
    );
  }
}
AppRegistry.registerComponent('ReactNativeTodo', () => ReactNativeTodo);
