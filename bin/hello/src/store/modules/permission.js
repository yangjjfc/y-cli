import { constantRouterMap } from '@/router/router';
import BASE from '@/utils/constant/index.js';
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routers
 * @param leval 递归层级
 */
const filterAsyncRouter = (routers, leval = 1) => {
    let asyncRouterMap = routers.map(item => {
        let funcUrl = (item.funcUrl || '').split('?');
        item.path = (item.path && item.path.split('?')[0]) || 'app/404';
        item.name = BASE.pageNames[funcUrl[0]] || (funcUrl[0] + item.no);
        item.meta = {
            name: item.label,
            componentUrl: funcUrl[0],
            no: item.no,
            pageTips: item.pageTips || '',
            query: funcUrl[1],
            leval: leval,
            cache: BASE.cacheUrls.includes(item.funcUrl)
        };
        BASE.pageNames[funcUrl[0]] = false;
        (item.children && item.children.length) && (item.children = filterAsyncRouter(item.children, leval + 1));
        return item;
    });
    return asyncRouterMap;
};

const permission = {
    state: {
        roles: null, // 用户权限
        routers: null // 路由
    },
    mutations: {
        // 设置路由
        SET_ROUTERS (state, routers) {
            state.routers = constantRouterMap.concat(routers); // 保存全部路由
            // console.log(JSON.stringify(state.routers, 2));
            sessionStorage.setItem('route', JSON.stringify(state.routers));
        }
    },
    actions: {
        // 生成路由生成路由
        async generateRouters ({ commit, state }, menus) {
            return new Promise(resolve => {
                let accessedRouters = filterAsyncRouter(menus);
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            });
        }
    }
};

export default permission;
