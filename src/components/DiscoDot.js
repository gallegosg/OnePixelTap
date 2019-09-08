

import React, { useState, Component } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import {height, width, dotMaxHeight, dotMaxWidth, dotMinY} from '../utils'

/**
 * generates a random number
 */
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min
}

const generateRandomColor = () => {
  const r = getRandomArbitrary(50, 200)
  const g = getRandomArbitrary(50, 200)
  const b = getRandomArbitrary(50, 200)
  return `rgb(${r}, ${g}, ${b})`
}

const initialX = getRandomArbitrary(5, dotMaxWidth)
const initialY = getRandomArbitrary(dotMinY, dotMaxHeight)
const initialColor = generateRandomColor()

const styles = {
  dotContainer: {
    padding: 10,
    position: 'absolute',
  },
}

export default class DiscoDot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: initialX,
      y: initialY,
      color: initialColor
    };
  }

  componentDidMount = () => {
    setInterval(() => {
      this.generateNewCoordinates()
    }, getRandomArbitrary(500, 3000));
  }

  generateNewCoordinates = () => {
    const x = getRandomArbitrary(5, dotMaxWidth)
    const y = getRandomArbitrary(dotMinY, dotMaxHeight)
    const color = generateRandomColor()
    this.setState({x, y, color})
  }

  handlePress = () => {
    this.generateNewCoordinates()
    this.props.onPress()
  }

  render() {
    const { x, y, color } = this.state;
    const { animatedStyles } = this.props
    return (
      <TouchableOpacity style={[styles.dotContainer, {top: y, left: x}]} onPress={this.handlePress}>
      <Animated.View style={[{ backgroundColor: color, height: 3, width: 3}, animatedStyles]} />
    </TouchableOpacity>
    );
  }
}
