/**
 * Created by sujialong on 2017/5/6.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Image,
    Animated,
} from 'react-native';
import Constant from '../common/Constant';

const {
    myAircraft,
    myAircraftSize,
    boomImg,
    boomDuration,
} = Constant.aircraft;

export default class MyAircraft extends PureComponent {

    boomValue = new Animated.Value(1);

    showBoom() {
        this.refs["boomView"].setNativeProps({
            style:{opacity:1}
        });
        Animated.timing(this.boomValue,{
            toValue: 0,
            duration: boomDuration,
        }).start();

    }

    createMyAircraft() {
        this.refs["boomView"].setNativeProps({
            style:{opacity:0}
        });
        this.boomValue.setValue(1);
    }

    render() {
        const {positionX,positionY} = this.props;

        return (
            <Animated.Image
                ref={"myAircraft"}
                source={myAircraft}
                style={[styles.myAircraft,{
                    transform:[
                        {translateX:positionX},
                        {translateY:positionY}
                    ],
                    opacity:this.boomValue
                }]}
            >
                <Image
                    ref="boomView"
                    source={boomImg}
                    style={styles.boomImg}/>
            </Animated.Image>
        );
    }
}

const styles = StyleSheet.create({
    myAircraft:{
        width:myAircraftSize,
        height:myAircraftSize,
        position:'absolute',
        bottom:0
    },
    boomImg:{
        width:myAircraftSize,
        height:myAircraftSize,
        opacity:0
    }
});