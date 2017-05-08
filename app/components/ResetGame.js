/**
 * Created by sujialong on 2017/5/6.
 */
import React, {Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import Constant from '../common/Constant';

const {width,height} = Constant.window;

class ResetGame extends Component {

    static show = (obj) => {
        return this.view = new RootSiblings(
            <RemindView
                parentContext={this}
                obj={obj}/>
        );
    };

    static hide = () => {
        // this.rootView && this.rootView._onChangPosition(false);
        // this.timer = setTimeout(()=>{
        if (this.view instanceof RootSiblings) {
            this.view.destroy();
        } else {
            console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof ResetGame}\` instead.`);
        }
        // },260);

    };

    componentWillMount = () => {
        this.view = new RootSiblings(<RemindView/>);
    }

    componentWillUnmount = () => {
        this.view.destroy();
    }

    render() {
        return null;
    }
}

class RemindView extends Component {

    keepOn = () => {
        const {obj,parentContext} = this.props;
        obj.keepOn();
        parentContext.view.destroy();
    }

    resetGame = () => {
        const {obj,parentContext} = this.props;
        obj.resetGame();
        parentContext.view.destroy();
    }

    render() {
        const {obj} = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.keepOn}>
                    <Text>复活</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.resetGame}>
                    <Text>重新开始</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:0,
        width:width,
        height:height,
        backgroundColor:"rgba(0,0,0,0.5)"
    },
    btn:{
        backgroundColor:'#fff',
        borderRadius:6,
        height:30,
        width:100,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        borderWidth:1,
        borderColor:'#333'
    }
});

export {
    RootSiblings as Manager
};
export default ResetGame;
