/**
 * Created by sujialong on 2017/5/5.
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
import BullteView from '../components/BullteView';

export default class BullteContainer extends  Component {

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
            this.bulletObjAry.push(`bullteView_ref_${key}`);
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
                    ref={`bullteView_ref_${item.key}`}
                    key={`bullteView_${item.key}`}
                    positionY={item.positionY}
                    positionX={item.positionX}
                    animated_toValue={-height}
                    bullteImg={myBullte}
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
        width:20,
        height:30,
        // borderRadius:5,
        // backgroundColor:'red',
    }
});