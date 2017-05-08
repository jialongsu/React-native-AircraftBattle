/**
 * Created by sujialong on 2017/5/8.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Animated,
    Easing,
} from 'react-native';
import Constant from '../common/Constant';

const {width,height} = Constant.window;
const {
    myBullte,
    myAircraftSize,
    bossSize,
    boss_shotTime,
    boss_shotDuration,
} = Constant.aircraft;

export default class BullteView extends PureComponent {

    constructor(props) {
        super(props);
        const {positionY,positionX} = this.props;
        this.isDestroy = false;
        this.positionY = positionY-myAircraftSize;
        this.state = {
            positionY:new Animated.Value(this.positionY)
        };
        this.state.positionY.addListener((e) => {
            this.positon = {
                positionY: e.value,
                positionX: positionX
            }
        });
    }

    componentDidMount() {
        const {animated_toValue} = this.props;
        this.animated = Animated.timing(this.state.positionY,{
            toValue: animated_toValue,
            easing: Easing.linear,
            duration: boss_shotDuration,
        });
        this.startAnimated();
    }

    componentWillUnmount() {
        this.state.positionY.removeAllListeners();
    }

    startAnimated = () => {
        this.animated.start()
    }

    stopAnimated = () => {
        this.animated.stop();
    }

    shouldComponentUpdate(nextProps,nextState) {
        return false;
    }

    /**
     * 相撞,制造销毁假象
     * @returns {XML}
     */
    hideView = () => {
        this.isDestroy = true;
        this.refs["bullteView"].setNativeProps({
            style:{
                opacity:0
            }
        });
    }

    getPosition() {
        return this.positon;
    }

    render() {
        const {positionX,bullteImg,style} = this.props;
        return (
            <Animated.Image
                ref={"bullteView"}
                source={bullteImg}
                style={[styles.bullte,style,{
                transform:[
                    {translateX:positionX},
                    {translateY:this.state.positionY}
                ]}]}/>
        );
    }
}

const styles = StyleSheet.create({
    bullteCon:{
        position:'absolute',
        bottom:0,
        flex:1,
        alignItems: 'center',
    },
    bullte:{
        position:'absolute',
        bottom:0
    }
});