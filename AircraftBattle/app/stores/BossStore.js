/**
 * Created by sujialong on 2017/5/7.
 */
import {observable ,computed ,action} from 'mobx';

class BossStore {
    allBlood = 100;//总血量
    atk = 2;//攻击力
    @observable
    blood = this.allBlood;//当前血量

    @action
    changBlood = () => {
        this.blood -= 1;
        return this.blood;
    }

    @action
    resetState = () => {
        this.blood = 100;
    }

    @computed
    get currentBlood() {
        const blood = Math.floor(this.blood/this.allBlood*100);
        return blood < 0?0:blood;
    }

}

export default BossStore;