/**
 * Created by sujialong on 2017/5/8.
 */
import React, { Component } from 'react';
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
    shotTime,
    shotDuration,
} = Constant.aircraft;

export default class BossBullte extends  Component {

    constructor(props) {
        super(props);
        this.state = {
            bulletAry: []
        };
        this.bulletObjAry = [];
        this.shouldUpdate = false;
        this.key = -1;
    }

    componentDidMount() {
        this.createBullte();
    }

    shouldComponentUpdate(nextProps,nextState) {
        return this.shouldUpdate;
    }

    componentDidUpdate(){
        this.shouldUpdate = false;
    }

    stopCreateBullte = () => {
        clearInterval(this.createBullteIntv);
    }

    /**
     * 生成子弹
     */
    createBullte() {
        const {parentContext} = this.props;
        let key  = this.key;
        this.createBullteIntv = setInterval(() => {
            key ++;
            this.key = key;
            let oldAry = this.state.bulletAry;
            //子弹超出屏幕后销毁
            this.bulletObjAry.map((item,i) => {
                const viewItem = this.refs[item];
                const {positionY} = viewItem.getPosition();
                const isDestroy = viewItem.isDestroy;//true:已打击到敌机
                if(positionY <= -height || isDestroy){
                    oldAry.splice(i,1);
                    this.bulletObjAry.splice(i,1);
                }
            });
            oldAry.push({
                "key":key,
                "positionY":parentContext.positionValueY,
                "positionX":parentContext.positionValueX,
            });
            this.bulletObjAry.push(`bossBullte_ref_${key}`);
            this.shouldUpdate = true;
            this.setState({
                bulletAry:oldAry
            });
        },shotTime);
    }

    /**
     * 重置
     * @returns {XML}
     */
    resetState = () => {
        this.bulletObjAry = [];
        this.key = -1;
        this.shouldUpdate = true;
        this.setState({
            bulletAry:[]
        });
    }

    render() {
        let bulletAry = [];
        this.state.bulletAry.map((item,i) => {
            const view =
                <BullteView
                    isBoom={this.props.isBoom}
                    ref={`bossBullte_ref_${item.key}`}
                    key={`bossBullte_ref_${item.key}`}
                    positionY={item.positionY}
                    positionX={item.positionX}
                />;
            bulletAry.push(view);
        });
        return (
            <View style={styles.bullteCon}>
                {bulletAry}
            </View>
        );
    }
}

class BullteView extends Component {

    constructor(props) {
        super(props);
        const {positionY,positionX,isBoom} = this.props;
        this.isDestroy = false;
        this.positionY = positionY-myAircraftSize;
        this.state = {
            positionY:new Animated.Value(this.positionY)
        };
        let key = 0;
        this.state.positionY.addListener((e) => {
            // isBoom();
            this.positon = {
                positionY: e.value,
                positionX: positionX
            }
        });
    }

    componentDidMount() {
        this.animated = Animated.timing(this.state.positionY,{
            toValue: height,
            easing: Easing.linear,
            duration: shotDuration,
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
        const {positionX} = this.props;
        return (
            <Animated.Image
                ref={"bullteView"}
                source={myBullte}
                style={[styles.bullte,{
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
        width:20,
        height:30,
        // borderRadius:5,
        // backgroundColor:'red',
        position:'absolute',
        bottom:0
    }
});