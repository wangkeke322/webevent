$(function () {
    // 验证表单
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value > 6) {
                return '昵称长度必须在1-6之间'
            }
        }
    })

    initUserInfo()
    // 基本信息填充到页面当中
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')

                }
                console.log(res.data);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        // 重新将用户信息填充到页面中
        initUserInfo()

    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 发起ajaxq请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                window.parent.getUserInfo()

            }
        })

    })

})
