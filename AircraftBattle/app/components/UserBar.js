/**
 * Created by sujialong on 2017/5/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import {observer} from "mobx-react/native";
import Constant from '../common/Constant';
import StopGameRemind from '../components/StopGameRemind';

const {width} = Constant.window;

@observer
export default class UserBar extends Component {

    state = {
        isStartGame: true,
    }

    playGame = () => {
        const {stopGame,startGame} = this.props;
        const isStartGame = this.state.isStartGame;
        if(isStartGame){
            stopGame();
            StopGameRemind.show(this.playGame);
        }else{
            startGame();
            StopGameRemind.hide();
        }
        this.setState({
            isStartGame:!isStartGame
        });
    }

    render() {
        const {store} = this.props;
        const playImg = this.state.isStartGame?Constant.aircraft.stop:Constant.aircraft.paly;

        return (
            <View style={styles.userBarCon}>
                <View style={styles.userInfo}>
                    <Text style={styles.scoreText}>血量: {store.currentBlood}%</Text>
                    <Text style={styles.scoreText}>得分: {store.score}</Text>
                </View>
                <TouchableOpacity
                    onPress={this.playGame}>
                    <Image
                        style={styles.stateimg}
                        source={playImg}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userBarCon:{
        flexDirection: 'row',
        height:50,
        width:width,
        position:'absolute',
        top:0,
        zIndex:1,
        alignItems: 'center',
    },
    userInfo:{
        flex:1,
        justifyContent: 'center',
    },
    bloodBarCon:{
        flexDirection: 'row',
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