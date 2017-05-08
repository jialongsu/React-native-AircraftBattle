/**
 * Created by sujialong on 2017/5/5.
 */
import {Dimensions } from 'react-native';
let window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    bgMap: require('../image/Map_1_1.png'),//默认背景地图
}

let aircraft = {
    paly:require('../image/forme_btn_play.png'),
    stop:require('../image/forme_btn_stop.png'),
    myAircraftSize:40,//主机大小
    foeAircraftSize:40,//默认敌机大小
    bossSize:100,//boos大小
    myAircraft:require('../image/wsparticle_66.png'),//默认主机图片
    foeAircraft:require('../image/enemypl_200.png'),//默认敌机图片
    boomImg:require('../image/wsparticle_baodian001.png'),//默认飞机爆炸图片
    bossBoomImg:require('../image/wsparticle_03.png'),//默认boss飞机爆炸图片
    createFoeAircraftTime: 3000,//创建敌机间隔
    foeAircraftDuration: 30000,//敌机的速度
    bossDuration: 10000,//boss出场的速度
    boomDuration: 600,//敌机爆炸速率
    bossBoomDuration: 1200,//boss爆炸速率
    shotTime:1000,//主机发射子弹间隔
    shotDuration:3000,//主机子弹速度
    boss_shotTime:1000,//boss发射子弹间隔
    boss_shotDuration:3000,//boss子弹速度
    myBullte:require('../image/ani_bullet_tailing0.png'),//主机默认子弹图片
    bossBullteImg:require('../image/boss_bullte.png'),//主机默认子弹图片
}

export default {
    window: window,
    aircraft: aircraft,
}