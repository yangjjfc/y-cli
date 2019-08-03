import { Http, changeEnvironment } from 'ycloud-ui';

let URL = {
    MENULIST: 'yhlo.brp.user.getUserMenuRights', // 获取员工的功能权限
    COLLECTLIST: 'ddc.uim.employeFavourFunc.getFavorPermissionList',
    unreadMessageCount: 'ddc.message.system.countLogingUserUnReadedMessage' // 计数登录用户的未读消息
};
const user = {
    state: {
        userInfo: {
            avator: '',
            userName: ''
        }, // 用户信息
        menuList: null, // 用户权限菜单
        routers: null, // 路由
        buttons: null, // 按钮权限
        // 员工常用菜单
        collectList: [],
        unreadCount: 0 // 未读消息数
    },
    mutations: {
        // 用户登入
        CHANGEUSER (state, data) {
            state.userInfo = Object.assign({}, state.userInfo, data);
            changeEnvironment({
                TOKEN: data.token
            });
            sessionStorage.setItem('user', JSON.stringify(state.userInfo));
        },
        // 用户刷新,重新赋值
        REFRESH (state, data) {
            let user = JSON.parse(sessionStorage.getItem('user'));
            state.userInfo = user || null;
        },
        // 用户退出,清除数据
        CLEARSTATE (state, data) {
            for (let item in state) {
                delete state[item];
            }
            sessionStorage.clear();
        },
        // 获取权限
        GETROLES (state, data) {
            state.menuList = data;
        },
        // 按钮权限
        SETBUTTONS (state, data) {
            state.buttons = data;
        },
        // 员工收藏
        SETCOLLECT: (state, data) => {
            state.collectList = data;
        },
        SETMESSAGECOUNT (state, count) {
            state.unreadCount = count;
        },
        // 更新未读消息数，默认为1（减1）
        // 每次阅读未读消息，则减1（默认）
        // 如果全部标记已读或者清空消息列表，则传count=0，unreadCount设为0
        UPDATEMESSAGECOUNT (state, count = 1) {
            if (count === 0) {
                state.unreadCount = 0;
            } else if (count > 0) {
                state.unreadCount -= count;
            }
        }
    },
    actions: {
        // 登录
        login (context, data) {
            return new Promise((resolve, reject) => {
                Http('login', data).then(
                    result => {
                        let userinfo = result || {};
                        if (userinfo.data) {
                            context.commit('CHANGEUSER', userinfo.data);
                            resolve(userinfo);
                        } else {
                            reject(userinfo);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        },
        // 退出
        async logout (context, data) {
            return new Promise((resolve, reject) => {
                Http('logout', data).then(
                    result => {
                        let data = result.data || {};
                        if (data) {
                            context.commit('CLEARSTATE');
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        },
        // 当前用户信息
        currentUser ({ commit, state }, refresh = false) {
            return new Promise((resolve, reject) => {
                state.userInfo && state.userInfo.enterpriseNo && !refresh
                    ? resolve(state.userInfo) // 判断是否需要去请求
                    : Http('currentUser', {
                        token: state.userInfo ? state.userInfo.token : ''
                    }).then(
                        result => {
                        // 获取token 获取登录信息
                            let user = result.data || {};
                            commit('CHANGEUSER', user);
                            resolve(user);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        },
        // 获取用户菜单
        getUserMenus ({ commit, state }) {
            return new Promise((resolve, reject) => {
                state.menuList ? resolve(state.menuList) : Http(URL.MENULIST).then(res => {
                    if (res.data) {
                        // 菜单项有子项目则显示
                        let munuList = res.data.menuTree.filter(item => item.children && item.children.length);
                        commit('GETROLES', munuList);
                        // commit('SETCOLLECT', collects);
                        commit('SETBUTTONS', res.data.permissionList);
                        resolve(state.menuList);
                    } else {
                        reject('获取用户菜单失败');
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        // 获取员工常用菜单
        getCollectList ({ commit, state }, releaseNo) {
            return new Promise((resolve, reject) => {
                Http(URL.COLLECTLIST, {
                    releaseNo
                }).then(res => {
                    let rows = res.data;
                    commit('SETCOLLECT', rows);
                    resolve(rows);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        // 计数登录用户的未读消息
        getUnreadMessageCount ({ commit, state }) {
            return new Promise((resolve, reject) => {
                Http(URL.unreadMessageCount).then(res => {
                    const { data } = res;
                    commit('SETMESSAGECOUNT', data);
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        updateUnreadMessageCount ({ commit, state }, count) {
            commit('UPDATEMESSAGECOUNT', count);
        }
    }
};

export default user;
