import React from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';

import image from '../assets/background-image.png';
import icon from '../assets/icon.svg';

export default class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      bgColor: ''
    };
  }

  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  colors = {
    dark: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE'
  };

  render() {
    return (
      <View style={styles.container}>

        <ImageBackground source={image} resizeMode='cover' style={styles.image}>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>ChatApp</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.inputField}>
              <Image source={icon} style={styles.icon} />
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder='Type Your Name Here...'
              />
            </View>

            <View style={styles.colorField}>
              <Text style={styles.color}> Choose Your Background Color: </Text>
            </View>

            <View style={styles.colorPalette}>
              <TouchableOpacity
                style={styles.color1}
                onPress={() => this.changeBgColor(this.colors.dark)}>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.color2}
                onPress={() => this.changeBgColor(this.colors.purple)}>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.color3}
                onPress={() => this.changeBgColor(this.colors.blue)}>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.color4}
                onPress={() => this.changeBgColor(this.colors.green)}>
              </TouchableOpacity>
            </View>


            <Pressable style={styles.button} onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}>
              <Text style={styles.buttonText}>Go to Chat</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    width: '88%',
    height: 70,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600"
  },

  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainer: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',

  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  inputField: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'grey',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  textInput: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 0.5,

  },

  titleContainer: {
    height: '50%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100
  },

  title: {
    fontSize: 45,
    fontWeight: "600",
    color: '#FFFFFF',
  },

  colorField: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '88%'
  },

  color: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 1,
  },

  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    paddingRight: 60
  },

  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25
  },
});