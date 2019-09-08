import React, { Component } from 'react';
import { View, Text } from 'react-native'

import Game from './Game'
import DiscoGame from './DiscoGame'
import Swiper from 'react-native-swiper'
import Locked from './components/Locked'
import Blackout from './Blackout'
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      discoUnlocked: false,
      blackoutUnlocked: false,
    };
  }

  /**
  * Determines if the game is in session
  */
  changeGameState = (isPlaying) => {
    this.setState({isPlaying})
  }

  blackoutUnlocked = () => {
    this.setState({blackoutUnlocked: true})
  }

  discoUnlocked = () => {
    this.setState({discoUnlocked: true})
  }

  render() {
    const { isPlaying, discoUnlocked, blackoutUnlocked } = this.state
    return (
      <Swiper 
        loop={false}
        scrollEnabled={!isPlaying}
        dot={isPlaying ? <View /> : <View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
        activeDot={isPlaying ? <View /> : <View style={{backgroundColor:'#555', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
      >
        <Game blackoutUnlocked={this.blackoutUnlocked} changeGameState={this.changeGameState} />
        {blackoutUnlocked ? <Blackout discoUnlocked={this.discoUnlocked} changeGameState={this.changeGameState}/> : <Locked points={15}/>}
        {discoUnlocked ? <DiscoGame changeGameState={this.changeGameState}/> : <Locked points={25}/>}
      </Swiper>
    );
  }
}
