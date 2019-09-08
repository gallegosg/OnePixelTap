import { Dimensions } from 'react-native'
import { isIphoneX, } from 'react-native-iphone-x-helper'

const {height, width} = Dimensions.get('window')
const dotMaxHeight = isIphoneX() ? (height - 60) : height - 40;
const dotMaxWidth = width - 40;
const dotMinY = isIphoneX() ? 60 : 40
export {height, width, dotMaxHeight, dotMaxWidth, dotMinY}