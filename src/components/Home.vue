<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <elButton type="info" @click="logout">退出</elButton>
        </el-header>
        <!-- 页主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu background-color="#333744" text-color="#fff" 
                active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse"
                :collapse-transition="false" :router="true" :default-active="$route.path">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+' '" v-for="item in menulist" :key='item.id'>
                        <!-- 一级菜单的魔板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key='subItem.id'>
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 左侧菜单栏数据
                menulist: [],
                iconsObj: {
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                    },
                    //是否折叠
                    isCollapse:false
            }
        },
        created() {
            this.getMenuList()
            // this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                //清空token
                window.sessionStorage.clear();
                // 跳转到登录页面
                this.$router.push('/login');
            },
            // 获取所有的菜单
            getMenuList() {
                // const {data:res} = await this.$http.get('menus')
                // console.log(res)
                //发送get请求访问/menusURL然后获得回调函数
                this.$axios.get('menus').then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error(res.data.meta.msg)
                    } else {
                        this.menulist = res.data.data
                    }
                    //console.log(res.data)
                })
            },
            toggleCollapse(){
                this.isCollapse = !this.isCollapse;
            },
            //保存链接的激活状态
            // saveNavState(activePath){
            //     window.sessionStorage.setItem('activePath',activePath)
            //     this.activePath = activePath
            // }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;

        >div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
        .el-menu{
            border-right:none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }
    .iconfont{
        margin-right:10px;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing:0.2em;
        cursor:pointer;
    }
</style>