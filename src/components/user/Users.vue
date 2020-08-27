<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 通过slot-scope接收当前作用域的数据 -->
                    <template slot-scope="scope">
                        <!-- 绑定具体的属性值 -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                        <!--对应行的数据  -->
                        <!-- {{scope.row}} -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="small"
                                @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="small"
                                @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="small" @click="setRole(scope.row)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 表单内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框区域 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 表单内容主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            //验证邮箱的规则
            let checkEmail = (rule, value, callback) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    //合法的邮箱
                    return callback()
                } else {
                    callback(new Error('请输入合法的邮箱'))
                }
            }
            // 验证手机号的规则
            var checkMobile = (rule, value, callback) => {
                // 验证和手机号的正则表达式
                let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (reg.test(value)) {
                    return callback()
                } else {
                    callback(new Error('手机号码格式不正确'))
                }

            }
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    // 当前的页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 5
                },
                userlist: [],
                total: 0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                // 添加用户的表单数据对象
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    username: [{
                            required: true,
                            message: '请输入用户名',
                            tigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '用户名的长度在3~10个字符之间',
                            tigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入邮箱',
                            tigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6~15个字符之间',
                            tigger: 'blur'
                        }
                    ],
                    email: [{
                            required: true,
                            message: '请输入密码',
                            tigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6~15个字符之间',
                            tigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            tigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: '请输入手机号',
                            tigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6~15个字符之间',
                            tigger: 'blur'
                        },
                        {
                            validator: checkMobile,
                            tigger: 'blur'
                        }
                    ]
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                // 编辑用户的表单数据对象
                editForm: {
                    username: '',
                    email: '',
                    mobile: ''
                },
                // 编辑表单的验证规则对象
                editFormRules: {
                    email: [{
                            required: true,
                            message: '请输入密码',
                            tigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6~15个字符之间',
                            tigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            tigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: '请输入手机号',
                            tigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6~15个字符之间',
                            tigger: 'blur'
                        },
                        {
                            validator: checkMobile,
                            tigger: 'blur'
                        }
                    ]
                },
                // 控制分配角色对话框的显示与隐藏
                setRoleDialogVisible: false,
                // 需要被分配角色的用户信息
                userInfo: {},
                // 所有角色的数据列表
                rolesList: [],
                // 已选中的角色id值
                selectedRoleId: ''
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            // 获取用户列表
            getUserList() {
                //   let params = JSON.stringify({params : this.queryInfo}) 
                this.$axios.get('users', {
                    params: this.queryInfo
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取用户列表失败！')
                    } else {
                        this.userlist = res.data.data.users
                        this.total = res.data.data.total
                        //console.log(res.data)
                    }
                })
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newSize) {
                //console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            //监听 switch 开关状态改变
            userStateChanged(userinfo) {
                //console.log(userinfo)
                this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
                    if (res.data.meta.status !== 200) {
                        userinfo.mg_state = !userinfo.mg_state
                        return this.$message.error('更新用户状态失败！')
                    } else {
                        this.$message.success('更新用户状态成功！')
                    }
                })
            },
            //监听添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加新用户
            addUser() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        //可以发起添加用户的网络请求
                        this.$axios.post('users', this.addForm).then(res => {
                            if (res.data.meta.status !== 201) {
                                this.$message.error('添加用户失败！')
                            } else {
                                this.$message.success('添加用户成功！')
                                //隐藏添加用户的对话框
                                this.addDialogVisible = false
                                //冲刺能获取用户列表数据
                                this.getUserList()
                            }
                        })
                    }
                })
            },
            // 展示编辑用户的对话框
            showEditDialog(id) {
                // console.log(id)

                this.$axios.get('users/' + id).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('查询用户信息失败！')
                    }

                    this.editForm = res.data.data
                    this.editDialogVisible = true;
                })
            },
            //监听修改用户对话框关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editUserInfo() {
                this.$refs.editFormRef.validate(valid => {
                    // console.log(valid)
                    if (!valid) {
                        return
                    } else {
                        //发起修改用户信息的数据请求
                        this.$axios.put('users/' + this.editForm.id, {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }).then(res => {
                            if (res.data.meta.status !== 200) {
                                return this.$message.error('更新用户信息失败！')
                            } else {
                                //关闭对话框w
                                this.editDialogVisible = false
                                // 刷新数据列表
                                this.getUserList()
                                // 提示修改成功
                                this.$message.success('更新用户信息成功！')
                            }
                        })
                    }


                })
            },
            // 根据用户id删除对应的用户信息
            removeUserById(id) {
                // console.log(id)
                // 弹框询问是否删除
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('users/' + id).then(res => {
                        if (res.data.meta.status !== 200) {
                            this.$message.error('删除用户失败！')
                        } else {
                            this.getUserList()
                            this.$message.success('删除用户成功！')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 展示分配角色对话框 获取所有角色的列表
            setRole(userInfo) {
                this.userInfo = userInfo
                // 在展示对话框之前，获取所有角色的列表
                this.$axios.get('roles').then(res => {
                    if (res.data.meta.status !== 200) {
                        this.$message.error('获取角色列表失败！')
                    } else {
                        this.rolesList = res.data.data
                        // console.log(this.rolesList)
                    }
                })
                this.setRoleDialogVisible = true
            },
            // 点击按钮分配角色
            saveRoleInfo() {
                if (!this.selectedRoleId) {
                    this.$message.error('请选择要分配的角色！')
                } else {
                    this.$axios.put(`users/${this.userInfo.id}/role`, {
                        rid: this.selectedRoleId
                    }).then(res => {
                        if (res.data.meta.status !== 200) {
                            this.$message.error('更新角色失败!')
                        } else {
                            this.$message.success('更新角色成功！')
                            this.getUserList()
                            this.setRoleDialogVisible = false
                        }
                    })
                }
            },
            // 监听分配角色对话框的关闭事件
            setRoleDialogClosed() {
                this.selectedRoleId = ''
                this.userInfo = {}
            }
        }
    }
</script>

<style lang="less" scoped>

</style>