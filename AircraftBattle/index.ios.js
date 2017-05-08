import React from 'react';
import { AppRegistry } from 'react-native';
import Root from './app/Root';

/**
 * 关闭警告提示
 * @type {boolean}
 */
console.disableYellowBox = true;

if(!__DEV__){
  console.log = function(){};
  console.warn = function(){};
  console.debug = function(){};
}

// console.warn('警告部分不再提示');

AppRegistry.registerComponent('AircraftBattle', () => Root);