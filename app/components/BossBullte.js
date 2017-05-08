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
import BullteView from './BullteView';

const {width,height} = Constant.window;
const {
    myBullte,
    myAircraftSize,
    bossSize,
    boss_shotTime,
    boss_shotDuration,
    bossBullteImg
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

    }

    shouldComponentUpdate(nextProps,nextState) {
        return this.shouldUpdate;
    }

    componentDidUpdate(){
        this.shouldUpdate = false;
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

    stopCreateBullte = () => {
        clearInterval(this.createBullteIntv);
        this.setBossBullteView("stop");
    }

    startCreateBullte = () => {
        this.setBossBullteView("start");
        this.createBullte();
    }

    setBossBullteView = (type) => {
        this.bulletObjAry.map((item,i) => {
            const viewItem = this.refs[item];
            switch (type){
                case 'start':
                    viewItem.startAnimated();
                    break;
                case 'stop':
                    viewItem.stopAnimated();
                    break;
            }
        });
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
                if(positionY >= height || isDestroy){
                    oldAry.splice(i,1);
                    this.bulletObjAry.splice(i,1);
                }
            });
            oldAry.push({
                "key":key,
                "positionY":parentContext.positionY._value,
                "positionX":parentContext.positionX._value,
            });
            this.bulletObjAry.push(`bossBullte_ref_${key}`);
            this.shouldUpdate = true;
            this.setState({
                bulletAry:oldAry
            });
        },boss_shotTime);
    }

    render() {
        let bulletAry = [];
        this.state.bulletAry.map((item,i) => {
            const view =
                <BullteView
                    ref={`bossBullte_ref_${item.key}`}
                    key={`bossBullte_ref_${item.key}`}
                    positionY={item.positionY}
                    positionX={item.positionX}
                    animated_toValue={height}
                    bullteImg={bossBullteImg}
                    style={styles.bullte}
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

const styles = StyleSheet.create({
    bullteCon:{
        position:'absolute',
        bottom:0,
        flex:1,
        alignItems: 'center',
    },
    bullte:{
        width:15,
        height:15,
        // borderRadius:5,
        // backgroundColor:'red',
    }
});