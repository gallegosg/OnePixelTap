import React, { Component } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Feather';
import {height, width, dotMaxHeight, dotMaxWidth, dotMinY} from './utils'

const fontFamily = 'PressStart2P-Regular'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: dotMaxWidth / 2,
      y: dotMaxHeight / 2,
      isPlaying: false,
      timer: 30,
      score: 0,
      highScore: 0,
      isDarkMode: false,
      showTutorial: false,
      tutorialFade: new Animated.Value(1),
    };
  }

  UNSAFE_componentWillMount = () => this.animatedValue = new Animated.Value(1);

  /**
   * get values from async storage
   */
  componentDidMount = async () => {
    try{
      const highScore = await AsyncStorage.getItem('blackoutHighScore')
      highScore >= 25 && this.props.discoUnlocked()
      this.setState({highScore})
    } catch(e) {
      Alert.alert(e)
    }
  }

  /**
   * starts the game and ends the game
   * sets highscore and saves if theyve played or not
   * Timer goes faster if in dark mode
   */
  startGame = () => {
    this.generateNewCoordinates();
    this.setState({isPlaying: true, score: 0})
    this.props.changeGameState(true)
    const timer = setInterval(() => {
      this.setState((prevState) => ({timer: prevState.timer - 1}), async () => {
        if(this.state.timer === 0){
          clearInterval(timer)
          const {score, highScore} = this.state
          if(score > highScore){//set highscore 
            this.setState({highScore: score})
            await AsyncStorage.setItem('blackoutHighScore', JSON.stringify(score));
          }

          //Check if user unlccoked disco mode
          score >= 25 && this.props.discoUnlocked()

          this.setState({
            timer: 30,
            isPlaying: false,
            showTutorial: false
          })
          this.props.changeGameState(false)
        }
      })
    }, 1000)
  }

  handleBeginPress = () => this.startGame()

  toggleDarkMode = () => this.setState(prevState => ({ isDarkMode: !prevState.isDarkMode}))
  
  /**
   * play a brief tutorial when playing for the first time
   */
  runTutorial = () => {
    this.setState({showTutorial: true, dotHeight: 100, dotWidth: 100}, () => this.startGame())
    setTimeout(() => {
      Animated.timing(this.state.tutorialFade, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      }).start(() => this.setState({showTutorial: false}))
    }, 5000)
    Animated.timing(this.animatedValue, {
      toValue: 100,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true
      }).start()
    })
  }
  /**
   * Generate new coordinates for the dot
   */
  generateNewCoordinates = () => {
    const x = this.getRandomArbitrary(5, dotMaxWidth)
    const y = this.getRandomArbitrary(dotMinY, dotMaxHeight)
    this.setState({x, y})
  }

  /**
   * generates a random number
   */
  getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
  }

  /**
   * on tap dot, creates a new dot on the screen
   * and incrememnts the score
   */
  gotDot = () => {
    this.generateNewCoordinates()
    this.setState((prevState) => ({score: prevState.score + 1}))
  }

  render() {
    const { isPlaying, x, y, timer, score, highScore, isDarkMode, showTutorial, tutorialFade, dotHeight, dotWidth } = this.state;
    const timeLeft = timer < 10 ? `0${timer}` : timer;
    const animatedStyles = { transform: [{scale: this.animatedValue }]};

    return (
      <SafeAreaView style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerItem}>0:{timeLeft}</Text>
          <Text style={styles.headerItem}>{score}</Text>
        </View>

        {/* /game board */}
        {isPlaying  && 
          <TouchableOpacity style={[styles.dotContainer, {top: y, left: x}]} onPress={this.gotDot}>
            <Animated.View style={[{ backgroundColor: '#fff', height: 1, width: 1}, animatedStyles]} />
          </TouchableOpacity>
        }

        {/* menu */}
        {!isPlaying && !showTutorial &&
          <View style={styles.main}>
            <View style={{flex: 0.8, justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={styles.titleContainer}>
                <Text style={styles.name}>PIXEL TAP</Text>
                <Text style={styles.gameMode}>Blackout</Text>
              </View>

              <TouchableOpacity onPress={this.handleBeginPress} style={styles.startButton}>
                <Text style={styles.startText}>BEGIN</Text>
              </TouchableOpacity>
            </View>
            {!!highScore && <Text style={styles.highscore}>HIGHSCORE: {highScore}</Text>}
            <View style={styles.footer}>
              {/* <Icon 
                name={isDarkMode ? 'sun' : 'moon'} 
                size={25} 
                color={color} 
                style={styles.icon}
                onPress={this.toggleDarkMode} /> */}
            </View>
          </View>}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#101010'
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
    textAlign: 'center',
    color: '#fff'
  },
  main: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center'
  },
  dotContainer: {
    padding: 10,
    position: 'absolute',
  },
  startButton: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  startText: {
    fontFamily,
    paddingTop: 10,
    color: '#000',
    fontSize: 22,
  },
  name: {
    fontFamily,
    fontSize: 30,
    color: '#fff'
  },
  highscore: {
    fontFamily,
    fontSize: 12,
    color: '#fff'
  },
  tutorialText: {
    fontFamily,
    fontSize: 16,
    textAlign: 'center'
  },
  footer: {
    width: '100%',
    marginRight: 25,
    alignItems: 'flex-end'
  },
  icon: {
    padding: 10
  },
  tutorialContainer: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 100
  },
  gameMode: {
    fontFamily: 'AmaticSC-Bold',
    color: '#ddd',
    fontSize: 80,
    transform: [{ rotate: "-5deg" }]
  }
};