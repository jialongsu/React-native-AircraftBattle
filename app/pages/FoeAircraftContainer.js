/**
 * Created by sujialong on 2017/5/5.
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
import Constant from '../common/Constant';
import BossAircraft from '../components/BossAircraft';
import FoeAircraft from '../components/FoeAircraft';

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

export default class FoeAircraftContainer extends  PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            foeAircraftAry: []
        };
        this.foeAircraftObjAry = [];
        this.shouldUpdate = false;
        this.key = -1;
    }

    componentDidMount() {
        this.createFoeAircraft();
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
        this.setBossView("reset");
        this.foeAircraftObjAry = [];
        this.key = -1;
        this.shouldUpdate = true;
        this.setState({
            foeAircraftAry:[]
        });
    }

    stopCreateFoeAircraft = () => {
        clearInterval(this.createFoeAircraftIntv);
        this.setBossView("stop");
    }

    setBossView = (type) => {
        const ary = this.foeAircraftObjAry;
        let length = ary.length;
        let item;
        for(let i = 0;i < length;i++){
            if(ary[i] == "foeAircraft_ref_boos"){
                item = this.refs[ary[i]];
                break;
            }
        }

        if(item){
            switch (type){
                case 'stop':
                    item.stopAnimated();
                    break;
                case 'reset':
                    item.resetState();
                    break;
            }
        }

    }

    /**
     * 生成敌机
     */
    createFoeAircraft() {
        let key = this.key;
        const value = width/2+foeAircraftSize;
        let oldAry,//敌机对象集合
            positionX,//敌机生成的X轴坐标
            refsKey,
            isCreate_boss = false,
            isLive_boss;
        this.createFoeAircraftIntv = setInterval(() => {
            key ++;
            this.key = key;
            isLive_boss = false;
            oldAry = this.state.foeAircraftAry;
            positionX = Math.random()*-width+value;
            //创建敌机在可视范围内
            // if(positionX > value){
            //     positionX = value-foeAircraftSize;
            // }else if(positionX < -value){
            //     positionX = -value+foeAircraftSize;
            // }
            //敌机超出屏幕后销毁
            this.foeAircraftObjAry.map((item,i) => {
                const viewItem = this.refs[item];
                const {foeAircraft_positionY} = viewItem.getPosition();
                const isDestroy = viewItem.isDestroy;//true:已被击毁
                if(foeAircraft_positionY > foeAircraftSize || isDestroy){
                    oldAry.splice(i,1);
                    this.foeAircraftObjAry.splice(i,1);
                }
                //判断boss是否存活,存活:不创建新的boss
                if(item == "foeAircraft_ref_boos"){
                    isLive_boss = true;
                }

            });
            /**
             * 生成20个小兵后出现Boos
             */
            if(key % 20 == 0   && key !=0 && !isCreate_boss && !isLive_boss){
                refsKey = 'foeAircraft_ref_boos';
                isCreate_boss = true;
            }else{
                refsKey = `foeAircraft_ref_${key}`;
                isCreate_boss = false;
            }
            oldAry.push({
                "key":key,
                "positionX":positionX,
                "isCreate_boss":isCreate_boss
            });
            this.foeAircraftObjAry.push(refsKey);
            this.shouldUpdate = true;
            this.setState({
                foeAircraftAry:oldAry
            });
        },createFoeAircraftTime);
    }

    render() {
        const {bossStore} = this.props;
        let foeAircraftAry = [];
        let view;
        this.state.foeAircraftAry.map((item,i) => {
            if(item.isCreate_boss){
                view =
                    <BossAircraft
                        bossStore={bossStore}
                        ref={"foeAircraft_ref_boos"}
                        key={"foeAircraft_ref_boos"}/>
            }else{
                view =
                    <FoeAircraft
                        ref={`foeAircraft_ref_${item.key}`}
                        key={`foeAircraft_${item.key}`}
                        positionY={-height}
                        positionX={item.positionX}
                    />;
            }

            foeAircraftAry.push(view);
        });
        return (
            <View style={styles.container}>
                {foeAircraftAry}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:0,
        flex:1,
        alignItems: 'center',
    }
});