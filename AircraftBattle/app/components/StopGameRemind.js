/**
 * Created by sujialong on 2017/5/6.
 */
import React, {Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import Constant from '../common/Constant';

const {width,height} = Constant.window;

class StopGameRemind extends Component {

    static show = (fun) => {
        return this.view = new RootSiblings(
            <RemindView fun={fun}/>
        );
    };

    static hide = () => {
        // this.rootView && this.rootView._onChangPosition(false);
        // this.timer = setTimeout(()=>{
            if (this.view instanceof RootSiblings) {
                this.view.destroy();
            } else {
                console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof StopGameRemind}\` instead.`);
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
    render() {
        const {fun} = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={fun}>
                    <Image
                        source={Constant.aircraft.paly}
                        style={styles.img}/>
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
    img:{
        width:80,
        height:80
    }
});

export {
    RootSiblings as Manager
};
export default StopGameRemind;
