'use strict';

import React, { Component } from 'react';
import ReactNative from 'react-native';
import firebaseConfig from './firebaseConfig';

const StatusBar = require('./StatusBar');
const ActionButton = require('./ActionButton');
const ListItem = require('./ListItem');
const styles = require('../styles.js');
const firebase = require('firebase');

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

class TodoContainer extends Component {

  constructor(props) {
    console.log("constructor");
    super(props);

    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
    this.itemsRef = firebaseApp.database().ref().child('items');
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    console.log("mount");
    this.listenForItems(this.itemsRef);
  }

  render() {
    console.log(this.state.dataSource);

    return (
      <View style={styles.container}>

        <StatusBar title="Grocery List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add" />

      </View>
    );
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}
module.exports = TodoContainer;

