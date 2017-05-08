/**
 * Created by sujialong on 2017/5/4.
 */
/**
 * Created by sujialong on 2017/5/4.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    PanResponder,
    Animated,
    Easing,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import {observer} from "mobx-react/native";
import Constant from '../common/Constant';
import BullteContainer from './BullteContainer';
import FoeAircraftContainer from './FoeAircraftContainer';
import UserInfroStore from '../stores/UserInfo';
import BossStore from '../stores/BossStore';
import StopGameRemind from '../components/StopGameRemind';
import ResetGame from '../components/ResetGame';
import UserBar from '../components/UserBar';
import MyAircraft from '../components/MyAircraft';

const {bgMap,height,width} = Constant.window;
const {myAircraft,myAircraftSize,foeAircraftSize} = Constant.aircraft;

export default class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bulletAry:[],
            foeAircraftAry:[]
        };
        this.store = new UserInfroStore();
        this.bossStore = new BossStore();
        this.bullteObjAry = [];//子弹集合

        //初始化主机位置
        this.myAircraft_positionY = new Animated.Value(0);
        this.myAircraft_positionX = new Animated.Value(0);
        this.positionValueY = 0;
        this.positionValueX = 0;
        this.myAircraft_positionY.addListener((e) => {
            this.positionValueY = e.value;
        });
        this.myAircraft_positionX.addListener((e) => {
            this.positionValueX = e.value;
        });

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            //是否允许其他组件成为响应者
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
            onPanResponderGrant: (evt,gestureState) =>{
                //开始手势操作,给用户一些视觉反馈,让他们知道发生了什么
                this.myAircraft_positionY.setOffset(this.positionValueY);
                this.myAircraft_positionX.setOffset(this.positionValueX);
                this.myAircraft_positionY.setValue(0);
                this.myAircraft_positionX.setValue(0);
            },
            onPanResponderMove: (evt,{dx,dy,vy}) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
                // let maxPositionY = -height+myAircraftSize;
                // let minPositionY = 0;
                // if(dy < 0){
                //     //向上滑动
                //     dy = this.positionValueY <= maxPositionY ? maxPositionY:dy;
                // }else{
                //     //向下滑动
                //     dy = this.positionValueY >= minPositionY ? minPositionY:dy;
                // }
                this.myAircraft_positionY.setValue(dy);
                this.myAircraft_positionX.setValue(dx);

            },
            onPanResponderRelease: (evt, {vx}) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                this.myAircraft_positionY.flattenOffset();
                this.myAircraft_positionX.flattenOffset();
            }
        });
    }

    componentDidMount() {
        this.startCheckBoom();
    }

    stopGame = () => {
        const bullteContext = this.refs["bullteContainer"];
        var foeAircraftContext = this.refs["foeAircraftContainer"];
        const bulletObjAry = bullteContext.bulletObjAry;
        const foeAircraftObjAry = foeAircraftContext.foeAircraftObjAry;
        //暂停检查元素相撞检查器
        clearInterval(this.checkBoomInt);
        //暂停创建子弹
        bullteContext.stopCreateBullte();
        //暂停创建敌机
        foeAircraftContext.stopCreateFoeAircraft();
        //子弹对象
        bulletObjAry.map((item,i) => {
            const bullteView = bullteContext.refs[item];
            bullteView.stopAnimated();
        });
        //敌机对象
        foeAircraftObjAry.map((foeItem,k) => {
            const foeAircraftView = foeAircraftContext.refs[foeItem];
            foeAircraftView.stopAnimated();
        });
    }

    startGame = () => {
        const bullteContext = this.refs["bullteContainer"];
        var foeAircraftContext = this.refs["foeAircraftContainer"];
        const bulletObjAry = bullteContext.bulletObjAry;
        const foeAircraftObjAry = foeAircraftContext.foeAircraftObjAry;
        //开始检查元素相撞定检查器
        this.startCheckBoom();
        //创建子弹
        bullteContext.createBullte();
        //创建敌机
        foeAircraftContext.createFoeAircraft();
        //子弹对象
        bulletObjAry.map((item,i) => {
            const bullteView = bullteContext.refs[item];
            bullteView.startAnimated();
        });
        //敌机对象
        foeAircraftObjAry.map((foeItem,k) => {
            const foeAircraftView = foeAircraftContext.refs[foeItem];
            foeAircraftView.startAnimated();
        });
    }

    startCheckBoom() {
        this.checkBoomInt = setInterval(() => {
            this.isBoom();
        },100);
    }

    isBoom = () => {
        const bullteContext = this.refs["bullteContainer"];
        var foeAircraftContext = this.refs["foeAircraftContainer"];
        const bulletObjAry = bullteContext.bulletObjAry;
        const foeAircraftObjAry = foeAircraftContext.foeAircraftObjAry;
        let bossContext;
        //主机坐标
        const myAircraftWidth = myAircraftSize/2;
        const myAircraft_maxValueY = this.positionValueY+myAircraftWidth;
        const myAircraft_minValueY = this.positionValueY-myAircraftWidth;
        const myAircraft_maxValueX = this.positionValueX+myAircraftWidth;
        const myAircraft_minValueX = this.positionValueX-myAircraftWidth;
        //子弹对象
        bulletObjAry.map((item,i) => {
            const bullteView = bullteContext.refs[item];
            const bulletPosition = bullteView.getPosition();
            const bullte_isDestroy = bullteView.isDestroy;//子弹存活状态
            if(bulletPosition){
                const {positionY,positionX} = bulletPosition;
                //敌机对象
                foeAircraftObjAry.map((foeItem,k) => {
                    const foeAircraftView = foeAircraftContext.refs[foeItem];
                    const foeAircraftPosition = foeAircraftView.getPosition();
                    const foeAircraft_isDestroy = foeAircraftView.isDestroy;//敌机存活状态
                    if(foeAircraftPosition){
                        const {
                            foeAircraft_positionY,
                            foeAircraft_positionX,
                            foeAircraftWidth
                        } = foeAircraftPosition;
                        // const foeAircraftWidth = foeAircraftSize/2;
                        const maxValueX = foeAircraft_positionX+foeAircraftWidth;
                        const minValueX = foeAircraft_positionX-foeAircraftWidth;
                        const maxValueY = foeAircraft_positionY+foeAircraftWidth;
                        const minValueY = foeAircraft_positionY-foeAircraftWidth;

                        //获取boss对象
                        if(foeItem == "foeAircraft_ref_boos")bossContext = foeAircraftView;
                        //主机子弹与敌机相撞
                        if(positionX <= maxValueX && positionX >= minValueX
                            && positionY <= maxValueY && positionY >= minValueY
                            && !foeAircraft_isDestroy && !bullte_isDestroy){

                            //主机子弹与boss相撞,计算boss血量
                            if(foeItem == "foeAircraft_ref_boos"){
                                const bossBlood = this.bossStore.changBlood();
                                bossBlood <= 0 && foeAircraftView.hideView();
                            }else{
                                //与小兵相撞
                                foeAircraftView.hideView();
                            }
                            this.store.changScore();//计算得分
                            bullteView.hideView();
                        }

                        //主机与敌机相撞
                        const diffMaxValueX = Math.abs(maxValueX-myAircraft_maxValueX);
                        const diffMinValueX = Math.abs(minValueX-myAircraft_minValueX);
                        const diffMaxValueY = Math.abs(maxValueY-myAircraft_maxValueY);
                        const diffMinValueY = Math.abs(minValueY-myAircraft_minValueY);

                        if( (diffMinValueY <= (myAircraftSize-25) || diffMinValueY <= (foeAircraftSize-25))
                         && (diffMaxValueY <= (myAircraftSize-25) || diffMaxValueY <= (foeAircraftSize-25))
                         && (diffMaxValueX <= myAircraftSize || diffMaxValueX <= foeAircraftSize )
                         && (diffMinValueX <= myAircraftSize || diffMinValueX <= foeAircraftSize)
                         && !foeAircraft_isDestroy){
                            this.store.changBlood();//计算血量
                            this.store.changScore();//计算得分
                            foeAircraftView.hideView();
                            this.chooseGame();
                        }

                    }
                });
            }
        });

        //boss子弹与主机相撞
        if(bossContext){
            const bossBullteContext = bossContext.getBossBullteObj();
            const bossBulletObjAry = bossBullteContext.bulletObjAry;

            bossBulletObjAry.map((item,i) => {
                const bullteView = bossBullteContext.refs[item];
                const position = bullteView.getPosition();

                if(position){
                   const {positionY,positionX} = position;
                   const bullte_isDestroy = bullteView.isDestroy;//子弹存活状态

                    //boss子弹与主机相撞
                    if(positionX <= myAircraft_maxValueX && positionX >= myAircraft_minValueX
                        && positionY <= myAircraft_maxValueY && positionY >= myAircraft_minValueY
                        && !bullte_isDestroy){
                        this.store.changBlood();//计算血量
                        bullteView.hideView();
                        this.chooseGame();
                    }
                }

            });
        }

    }

    /**
     * 判断主机血量是否为0,选择游戏选项
     */
    chooseGame() {
        const currentBlood = this.store.currentBlood;
        if(currentBlood == 0){
            const myAircraft = this.refs["myAircraft"];
            myAircraft.showBoom();
            this.stopGame();
            ResetGame.show({
                "resetGame":this.resetGame,
                "keepOn":this.keepOnGame
            });
        }

    }

    /**
     * 死亡后继续游戏(复活)
     */
    keepOnGame = () => {
        this.store.setBlood();//恢复血量
        this.startGame();
        this.refs["myAircraft"].createMyAircraft();
    }

    /**
     * 重置游戏
     * @returns {XML}
     */
    resetGame = () => {
        //主机状态重置
        this.myAircraft_positionY.setValue(0);
        this.myAircraft_positionX.setValue(0);
        this.myAircraft_positionY.flattenOffset();
        this.myAircraft_positionX.flattenOffset();
        this.store.resetState();
        this.refs["myAircraft"].createMyAircraft();
        // 清除屏幕
        const bullteContext = this.refs["bullteContainer"];
        var foeAircraftContext = this.refs["foeAircraftContainer"];
        bullteContext.resetState();
        foeAircraftContext.resetState();
        //开启游戏主线程
        this.startGame();
    }

    render() {
        return (
            <View
                {...this._panResponder.panHandlers}
                style={styles.container}>

                <StatusBar
                    hidden={true}
                    barStyle="light-content"
                />
                <UserBar
                    startGame={this.startGame}
                    stopGame={this.stopGame}
                    store={this.store}/>
                <BgMap/>
                <BullteContainer
                    ref={"bullteContainer"}
                    parentContext={this}
                    isBoom={this.isBoom}/>
                <FoeAircraftContainer
                    bossStore={this.bossStore}
                    ref={"foeAircraftContainer"}/>
                <MyAircraft
                    ref="myAircraft"
                    positionY={this.myAircraft_positionY}
                    positionX={this.myAircraft_positionX}/>
            </View>
        );
    }
}

class BgMap extends Component {

    constructor(props) {
        super(props);
        this.moveMap = new Animated.Value(0);
        this.moveMap.addListener((e) => {

        });
    }

    componentDidMount() {
        // this.startMoveBgMap();
    }

    startMoveBgMap() {
        Animated.timing(this.moveMap,{
            toValue:height,
            duration:180000
        }).start();
    }

    render() {
        return (
            <Animated.View
                style={[styles.map,{
                    transform:[
                        {translateY: this.moveMap}
                    ]}]
                }>
                <Image
                    source={bgMap}
                    style={styles.mapImg}/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    map:{
        flex:1
    },
    mapImg:{
        flex:1,
        width:width
    },
    userBarCon:{
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        height:50,
        width:width,
        position:'absolute',
        top:0,
        zIndex:1,
    },
    userInfo:{
        flex:1,
    },
    bloodBarCon:{
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        height:20
    },
    bloodBar:{
        backgroundColor:'#CE0914',
        height:12,
    },
    scoreText:{
        backgroundColor:'transparent',
        color:'#fff',
        fontSize:14,
        fontWeight:'bold',
        marginLeft:15,
        marginTop:5
    },
    stateimg:{
        width:40,
        height:40,
        marginHorizontal:15,
        marginVertical:5
    }
});