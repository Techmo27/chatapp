import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor
      }}>
        <Text style={styles.bodyText} >Hey there, welcome!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  bodyText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  }
});