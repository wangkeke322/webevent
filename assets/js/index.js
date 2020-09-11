$(function () {
    // 获取用户信息并渲染头像和用户信息---调用
    getUserInfo()
    var layer = layui.layer
    // 点击退出按钮的a链接 询问是否退出 然后退出
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储
            localStorage.removeItem('token')
            // 页面跳转到登录页面
            location.href = '/login.html'
            // 关闭提示框
            layer.close(index);
        });
    })
})

// 获取用户信息并渲染头像和用户信息
function getUserInfo() {
    $.ajax({
        // 默认为GET  可以省略不写
        type: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res);
            // 渲染用户头像函数调用
            renderAvater(res.data)
        }
        // ajax请求 不论成功与失败 都会执行complete 这个函数
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 token 
        //         localStorage.removeItem('token')
        //         // 强制跳转至 登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 渲染用户头像及信息
function renderAvater(user) {

    // 1.设置欢迎用户文本
    var name = user.nickname || user.username
    // 欢迎文本信息
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2. 渲染用户头像 uesr.uesr.pic 判断是否为空 为空渲染文本头像toUpperCase() ---大写 有则渲染图片头像 
    if (user.user_pic !== null) {
        //有则渲染图片头像 
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    }
    else {
        $('.layui-nav-img').hide()
        // 为空渲染文本头像
        var first = name[0].toUpperCase()    // name 首字母转大写 .toUpperCase()
        $('.text-avatar').html(first).show()

    }
}
