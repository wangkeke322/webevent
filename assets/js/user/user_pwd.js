
$(function () {
    var form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            // 不能和原密码一致
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不可以和原密码一致'
            }

        },
        rePwd: function (value) {
            // 必须和新密码一致
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码需一致'

            }


        }
    })
    // 更改密码 form 提交修改事件
    $('.layui-form').on('submit', function (e) {

        e.preventDefault()
        // 重置密码发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),

            success: function (res) {
                // console.log('hahah');
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败')

                }
                layui.layer.msg('密码更新成功')
                // 重置表单
                $('.layui-form')[0].reset()

            }
        })
    })












})