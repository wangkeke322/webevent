$(function () {
    //  点击 a链接 去注册账号 页面跳转
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })
    // 点击a链接 去登录 转至登录页面
    $('#link_login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })



    // 表单验证
    // 从layui获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 判断两次密码输入是否一致 ----传参value: 再次确认密码框的value
        repwd: function (value) {
            // [name=password] 属性选择器   --- pwd是请输入密码的value
            var pwd = $('.reg_box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认 提交行为
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录')
                // 注册成功后自动到登录页面---模拟手动点击去登录
                $('#link_login').click()
            }
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取表单数据 serialize
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log('haha ');
                // res.token 令牌
                localStorage.setItem('token', res.token)
                location.href = '/index.html'



            }


        })

    })










})