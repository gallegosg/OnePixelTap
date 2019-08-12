import React, { Component } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Feather';

const {height, width} = Dimensions.get('window')
const dotMaxHeight = isIphoneX() ? (height - (getBottomSpace() - 25)) : height - 60;
const dotMaxWidth = width - 25;
const fontFamily = 'PressStart2P-Regular'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 5,
      y: 30,
      isPlaying: false,
      timer: 30,
      score: 0,
      highScore: 0,
      isDarkMode: false
    };
  }

  componentDidMount = async () => {
    try{
      const highScore = await AsyncStorage.getItem('highScore')
      this.setState({highScore})
    } catch(e) {
      console.log(e)
    }
  }

  startGame = () => {
    this.generateNewCoordinates();
    this.setState({isPlaying: true, score: 0})
    const timer = setInterval(() => {
      this.setState((prevState) => ({timer: prevState.timer - 1}), async () => {
        if(this.state.timer === 0){
          clearInterval(timer)
          const {score, highScore} = this.state
          if(score > highScore){
            this.setState({highScore: score})
            await AsyncStorage.setItem('highScore', JSON.stringify(score));
          }
          this.setState({
            timer: 30,
            isPlaying: false
          })
        }
      })
    }, 1000)
  }

  toggleDarkMode = () => this.setState(prevState => ({ isDarkMode: !prevState.isDarkMode}))
  

  /**
   * Generate new coordinates for the dot
   */
  generateNewCoordinates = () => {
    const minY = isIphoneX ? 50 : 30
    const x = this.getRandomArbitrary(5, dotMaxWidth)
    const y = this.getRandomArbitrary(minY, dotMaxHeight)
    this.setState({x, y})
  }

  getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
  }

  gotDot = () => {
    this.generateNewCoordinates()
    this.setState((prevState) => ({score: prevState.score + 1}))
  }

  render() {
    const { isPlaying, x, y, timer, score, highScore, isDarkMode } = this.state;
    const timeLeft = timer < 10 ? `0${timer}` : timer;
    const backgroundColor = isDarkMode ? '#000' : '#fff'
    const color = isDarkMode ? '#fff' : '#000'
    return (
      <SafeAreaView style={[styles.container, {backgroundColor}]}>
        {/* header */}
        <View style={styles.header}>
          <Text style={[styles.headerItem, { color }]}>0:{timeLeft}</Text>
          <Text style={[styles.headerItem, { color }]}>{score}</Text>
        </View>

        {/* /game board */}
        {isPlaying && 
          <TouchableOpacity style={[styles.dotContainer, {top: y, left: x}]} onPress={this.gotDot}>
            <View style={[styles.dot, { backgroundColor: color }]} />
          </TouchableOpacity>
        }

        {/* menu */}
        {!isPlaying && 
          <View style={styles.main}>
            <View style={{flex: 0.8, justifyContent: 'space-around', alignItems: 'center'}}>
              <Text style={[styles.name, { color }]}>PIXEL TAP</Text>
              <TouchableOpacity onPress={this.startGame} style={styles.startButton}>
                <Text style={[styles.startText, { color }]}>BEGIN</Text>
              </TouchableOpacity>
            </View>
            {!!highScore && <Text style={[styles.highscore, { color }]}>HIGHSCORE: {highScore}</Text>}
            <View style={styles.footer}>
              <Icon 
                name={isDarkMode ? 'sun' : 'moon'} 
                size={25} 
                color={color} 
                style={styles.icon}
                onPress={this.toggleDarkMode} />
            </View>
          </View>}
          
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  headerItem: {
    fontFamily,
    flex: 0.5,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center'
  },
  main: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dotContainer: {
    padding: 10,
    position: 'absolute',
  },
  dot: {
    height: 1,
    width: 1
  },
  startButton: {
    padding: 20
  },
  startText: {
    fontFamily,
    color: '#111',
    fontSize: 22,
  },
  name: {
    fontFamily,
    fontSize: 30,
  },
  highscore: {
    fontFamily,
    fontSize: 12
  },
  footer: {
    width: '100%',
    marginRight: 25,
    alignItems: 'flex-end'
  },
  icon: {
    padding: 10
  }
};