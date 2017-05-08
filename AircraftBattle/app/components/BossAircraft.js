/**
 * Created by sujialong on 2017/5/7.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Animated,
    Easing,
    Text
} from 'react-native';
import {observer} from "mobx-react/native";
import Constant from '../common/Constant';
import BossBullte from './BossBullte';

const {width,height} = Constant.window;
const {
    foeAircraftSize,
    foeAircraft,
    bossBoomImg,
    bossBoomDuration,
    bossSize,
    bossDuration
} = Constant.aircraft;

export default class BossView extends PureComponent {

    constructor(props) {
        super(props);
        this.isDestroy = false;
        this.positionY = new Animated.Value(-height);
        this.positionX = new Animated.Value(0);
        this.boomValue = new Animated.Value(1);
        this.positionY_toValue = -height + 50+bossSize;
        this.bossWidth = bossSize/2;
        this.positionX_toValueLeft = -width/2 + this.bossWidth;
        this.positionX_toValueRight = width/2 - this.bossWidth;
        this.animatedX =
            Animated.sequence([
                Animated.timing(this.positionX,{
                    toValue: this.positionX_toValueLeft,
                    easing: Easing.linear,
                    duration: bossDuration,
                }),
                Animated.timing(this.positionX,{
                    toValue: this.positionX_toValueRight,
                    easing: Easing.linear,
                    duration: bossDuration,
                })
            ]);
        this.animatedY =
            Animated.sequence([
                Animated.timing(this.positionY,{
                    toValue: this.positionY_toValue,
                    easing: Easing.linear,
                    duration: bossDuration,
                }),
                // Animated.delay(400),
                // this.animatedX
            ]);
    }

    componentDidMount() {
        // this.startAnimated();
        this.animatedY.start(({finished}) => {
            // finished && this.loopAnimatedX();
        });
    }

    loopAnimatedX = () => {
        this.animatedX.start(({finished}) => {
            finished && this.animatedX.start();
        });
    }

    startAnimated = () => {
        // this.animatedY.start(({finished}) => {
        //     // finished && this.loopAnimatedX();
        // });
    }

    stopAnimated = () => {
        // this.animatedY.stop();
    }

    /**
     * 相撞,制造销毁假象,在飞机离开可视范围后真正销毁
     * @returns {XML}
     */
    hideView = () => {
        this.isDestroy = true;
        this.showBoom();
        this.props.bossStore.resetState();
    }

    showBoom() {
        this.refs["boomView"].setNativeProps({
            style:{opacity:1}
        });
        Animated.timing(this.boomValue,{
            toValue: 0,
            duration: bossBoomDuration,
        }).start();
    }

    getPosition() {
        return {
            foeAircraft_positionY: this.positionY._value,
            foeAircraft_positionX: this.positionX._value,
            foeAircraftWidth: this.bossWidth-15
        };
    }

    render() {
        const {bossStore} = this.props;
        return (
            <View style={styles.container}>
                <Animated.Image
                    ref="boosview"
                    source={foeAircraft}
                    style={[styles.boosImg,{
                    transform:[
                        {translateX:this.positionX},
                        {translateY:this.positionY},
                    ],
                    opacity:this.boomValue
                }]}>
                    <Bossbloodbar bossStore={bossStore}/>
                    <Image
                        ref="boomView"
                        source={bossBoomImg}
                        style={styles.boomImg}/>
                </Animated.Image>
                <Image
                    ref="boomView"
                    source={bossBoomImg}
                    style={styles.boomImg}/>
            </View>

        );
    }
}

@observer
class Bossbloodbar extends PureComponent {
    render() {
        const {bossStore} = this.props;
        return (
            <Text style={styles.bloodCon}>
                血量:{bossStore.currentBlood}%
            </Text>
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
    boomImg:{
        width:bossSize,
        height:bossSize,
        position:'absolute',
        bottom:0,
        opacity:1
    },
    boosImg:{
        width:bossSize,
        height:bossSize,
        position:'absolute',
        bottom:0
    },
    bloodCon:{
        position:'absolute',
        top:0,
        height:20,
        width:bossSize,
        textAlign:'center',
        color:'#fff',
        fontSize:12,
        backgroundColor:'transparent'
    }
});