/**
 * Created by sujialong on 2017/5/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Animated,
    Easing,
} from 'react-native';
import Constant from '../common/Constant';

const {width,height} = Constant.window;
const {
    foeAircraftSize,
    foeAircraft,
    boomImg,
    createFoeAircraftTime,
    foeAircraftDuration,
    boomDuration,
    bossSize,
    bossDuration
} = Constant.aircraft;

export default class FoeAircraft extends Component {
    constructor(props) {
        super(props);
        const {positionY,positionX} = this.props;
        this.isDestroy = false;
        this.positionY = positionY;
        const foeAircraftWidth = foeAircraftSize/2;
        this.state = {
            positionY:new Animated.Value(this.positionY),
            boomValue:new Animated.Value(1),
        };
        this.state.positionY.addListener((e) => {
            this.positon = {
                foeAircraft_positionY: e.value,
                foeAircraft_positionX: positionX,
                foeAircraftWidth: foeAircraftWidth
            }
        });
    }

    componentDidMount() {
        this.animated = Animated.timing(this.state.positionY,{
            toValue: height,
            easing: Easing.linear,
            duration: foeAircraftDuration,
        });
        this.startAnimated();
    }

    componentWillUnmount() {
        this.state.positionY.removeAllListeners();
    }

    startAnimated = () => {
        this.animated.start();
    }

    stopAnimated = () => {
        this.animated.stop();
    }

    shouldComponentUpdate(nextProps,nextState) {
        return false;
    }

    /**
     * 相撞,制造销毁假象,在飞机离开可视范围后真正销毁
     * @returns {XML}
     */
    hideView = () => {
        this.stopAnimated();
        this.isDestroy = true;
        this.showBoom();
    }

    showBoom() {
        this.refs["boomView"].setNativeProps({
            style:{opacity:1}
        });
        Animated.timing(this.state.boomValue,{
            toValue: 0,
            duration: boomDuration,
        }).start(({finished}) => {
            finished && this.startAnimated();
        });

    }

    getPosition() {
        return this.positon;
    }

    render() {
        const {positionX,positionY} = this.props;
        return (
            <Animated.Image
                ref="foeAircraftView"
                source={foeAircraft}
                style={[styles.foeAircraft,{
                transform:[
                    {translateX:positionX},
                    {translateY:this.state.positionY},
                ],
                opacity:this.state.boomValue
            }]}>
                <Image
                    ref="boomView"
                    source={boomImg}
                    style={styles.boomImg}/>
            </Animated.Image>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:0,
        flex:1,
        alignItems: 'center',
    },
    foeAircraft:{
        width:foeAircraftSize,
        height:foeAircraftSize,
        position:'absolute',
        bottom:0
    },
    boomImg:{
        width:foeAircraftSize,
        height:foeAircraftSize,
        position:'absolute',
        bottom:0,
        opacity:0
    },
    boosImg:{
        width:bossSize,
        height:bossSize,
        position:'absolute',
        bottom:0
    }
});