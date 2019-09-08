import React, { Component, Fragment } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Alert, Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/Feather';
import DiscoDot from './components/DiscoDot'

const fontFamily = 'PressStart2P-Regular'

export default class DiscoGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      const highScore = await AsyncStorage.getItem('discoHighScore')
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
    this.setState({isPlaying: true, score: 0})
    this.props.changeGameState(true)
    const secondDuration = this.state.isDarkMode ? 750 : 1000
    const timer = setInterval(() => {
      this.setState((prevState) => ({timer: prevState.timer - 1}), async () => {
        if(this.state.timer === 0){
          clearInterval(timer)
          const {score, highScore} = this.state
          if(score > highScore){//set highscore 
            this.setState({highScore: score})
            await AsyncStorage.setItem('discoHighScore', JSON.stringify(score));
          }
          this.setState({
            timer: 30,
            isPlaying: false,
            showTutorial: false
          })
          this.props.changeGameState(false)
        }
      })
    }, secondDuration)
  }

  handleBeginPress = () => this.startGame()

  /**
   * on tap dot, creates a new dot on the screen
   * and incrememnts the score
   */
  gotDot = () => {
    this.setState((prevState) => ({score: prevState.score + 1}))
  }

  render() {
    const { isPlaying, x, y, timer, score, highScore, isDarkMode, showTutorial, tutorialFade, dotHeight, dotWidth } = this.state;
    const timeLeft = timer < 10 ? `0${timer}` : timer;
    const backgroundColor = isDarkMode ? '#000' : '#fff'
    const color = isDarkMode ? '#fff' : '#000'
    const animatedStyles = { transform: [{scale: this.animatedValue }]};
// edd6a4
    return (
      <SafeAreaView style={[styles.container, {backgroundColor}]}>
        {/* header */}
        <View style={styles.header}>
          <Text style={[styles.headerItem, { color }]}>0:{timeLeft}</Text>
          <Text style={[styles.headerItem, { color }]}>{score}</Text>
        </View>

        {/* /game board */}
        {isPlaying && 
          <Fragment>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
            <DiscoDot onPress={this.gotDot}/>
          </Fragment>
        }

        {/* menu */}
        {!isPlaying &&
          <View style={styles.main}>
            <View style={{flex: 0.8, justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={styles.titleContainer}>
                <Text style={[styles.name, { color }]}>PIXEL TAP</Text>
                <Text style={styles.disco}>Disco</Text>
              </View>
              <TouchableOpacity onPress={this.handleBeginPress} style={[styles.startButton, { backgroundColor: color}]}>
                <Text style={[styles.startText, { color: backgroundColor }]}>BEGIN</Text>
              </TouchableOpacity>
            </View>
            {!!highScore && <Text style={[styles.highscore, { color }]}>HIGHSCORE: {highScore}</Text>}
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
  titleContainer: {
    alignItems: 'center'
  },
  dotContainer: {
    padding: 10,
    position: 'absolute',
  },
  startButton: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily,
    paddingTop: 10,
    color: '#111',
    fontSize: 22,
  },
  name: {
    fontFamily,
    fontSize: 30,
  },
  disco: {
    fontFamily: Platform.OS == 'ios' ? 'dreamland' : 'dreamlan',
    color: 'blue',
    fontSize: 70,
    transform: [{ rotate: "-5deg" }]
  },
  highscore: {
    fontFamily,
    fontSize: 12,
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
  }
};