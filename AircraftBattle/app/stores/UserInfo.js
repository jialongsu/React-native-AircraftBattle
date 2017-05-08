/**
 * Created by sujialong on 2017/5/6.
 */
import {observable ,computed ,action} from 'mobx';

class userInfo {
    allBlood = 3;//总血量
    atk = 1;//攻击力
    @observable
    score = 0;//得分
    @observable
    blood = this.allBlood;//当前血量

    @action
    changScore = () => {
        this.score += 1;
    }

    @action
    changBlood = () => {
        this.blood -= 1;
    }

    @action
    setBlood = () => {
        this.blood = this.allBlood;
    }

    @action
    resetState = () => {
        this.blood = this.allBlood;
        this.score = 0;//得分
    }

    @computed
    get currentBlood() {
        const blood = Math.floor(this.blood/this.allBlood*100);
        return blood < 0?0:blood;
    }

}

export default userInfo;