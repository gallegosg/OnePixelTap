import React, { Component } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'

const {height, width} = Dimensions.get('window')
const dotMaxHeight = isIphoneX ? height - getBottomSpace() : height - 50
const dotMaxWidth = width - 10
const fontFamily = 'PressStart2P-Regular'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 30,
      y: 30,
      isPlaying: false,
      timer: 10,
      score: 0,
      highScore: 0
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

  /**
   * Generate new coordinates for the dot
   */
  generateNewCoordinates = () => {
    const minY = isIphoneX ? 50 : 25
    const x = this.getRandomArbitrary(0, dotMaxWidth)
    const y = this.getRandomArbitrary(minY, dotMaxHeight)
    this.setState({x, y})
  }

  getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
  }

  renderStart = () => (
    <TouchableOpacity onPress={this.startGame} style={styles.startButton}>
      <Text style={styles.startText}>BEGIN</Text>
    </TouchableOpacity>
  )

  gotDot = () => {
    this.generateNewCoordinates()
    this.setState((prevState) => ({score: prevState.score + 1}))
  }

  render() {
    const { isPlaying, x, y, timer, score, highScore } = this.state;
    const timeLeft = timer < 10 ? `0${timer}` : timer
    return (
      <SafeAreaView style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerItem}>0:{timeLeft}</Text>
          <Text style={styles.headerItem}>{score}</Text>
        </View>

        {/* /game board */}
        {isPlaying && 
          <TouchableOpacity style={[styles.dotContainer, {top: y, left: x}]} onPress={this.gotDot}>
            <View style={styles.dot} />
          </TouchableOpacity>
        }

        {/* menu */}
        {!isPlaying && 
          <View style={styles.main}>
            <View style={{flex: 0.8, justifyContent: 'space-around', alignItems: 'center'}}>
              <Text style={styles.name}>PIXEL TAP</Text>
              {this.renderStart()}
            </View>
            {!!highScore && <Text style={styles.highscore}>HIGHSCORE: {highScore}</Text>}
          </View>}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10
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
    padding: 1,
    position: 'absolute',
  },
  dot: {
    backgroundColor: '#000',
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
  }
};