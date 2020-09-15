$(function () {
    var form = layui.form
    var layer = layui.layer
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                layer.msg('获取文章分类列表成功')
                //  调用模版引擎--template('模版',数据) 
                var htmlStr = template('tpl-table', res)
                // 渲染界面
                $('tbody').html(htmlStr)
            }
        })
    }
    // 调用获取文章分类列表函数
    initArtCateList()

    // 添加按钮       新增文章分类
    // 点击添加类别按钮 #btnAddCate 绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        // 返回indexAd是关闭提示框框的重要凭据
        indexAdd = layer.open({
            //1（页面层）
            type: 1,
            // 弹出层的宽和高
            area: ['500px', '250px'],
            // 标题
            title: '添加文章类别',
            // 点击添加类别按钮 弹出的框框 ---内容 : DOM 文本 html 都可以 
            content: $('#dialog-add').html()

        })
    })

    // 通过代理的形式,为form表单#form-add 绑定submit事件 --添加按钮的表单添加
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // .serialize() 获取的是form表单带有name属性的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败!')
                }

                layer.msg('新增文章分类成功!')
                // 重新渲染页面 --调用获取文章列表的函数
                initArtCateList()
                // 根据索引 关闭当前添加分类的提示框框
                layer.close(indexAdd)

            }
        })
    })

    // 编辑按钮
    var indexEdit = null;
    // 为编辑按钮绑定点击事件 --- 动态元素事件委托的绑定
    $('tbody').on('click', '.btn-edit', function () {
        // 点击编辑按钮 弹出编辑框框
        indexEdit = layer.open({
            type: 1,
            // 弹出层的宽和高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()

        })
        // 获取当前点击的id--- 自定义获取
        var editId = $(this).attr('data-id')
        // console.log(editId);
        // 发起请求获取对应分类的数据 ---显示到编辑框框里
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + editId,
            success: function (res) {
                // 调用form.val()快速赋值  ()里只有1个参数时时获取值
                //'form-edit'是form表单 lay-filter="xxx" 的值
                form.val('form-edit', res.data)
            }
        })


        // 通过代理的形式, 为#form - edit 表单绑定submit事件---编辑按钮的表单提交
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {

                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败!')
                    }

                    layer.msg('更新分类数据成功!')
                    // 根据索引 关闭当前添加分类
                    layer.close(indexEdit)
                    // 重新初始化页面
                    initArtCateList()



                }
            })
        })


        // 删除按钮 .btn-delete 确定是否删除 发起ajax请求--动态元素 时间委托
        $('tbody').on('click', '.btn-delete', function () {
            // 获取当前点击删除按钮的id
            var delId = $(this).attr('data-id')
            // console.log(delId);
            // 弹出询问提示框
            layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + delId,
                    // data: $(this).serialize(),
                    success: function (res) {

                        if (res.status !== 0) {
                            return layer.msg('删除分类数据失败!')
                        }

                        layer.msg('删除分类数据成功!')
                        // 根据索引 关闭当前添加分类
                        layer.close(index)
                        // 重新初始化页面
                        initArtCateList()
                    }
                })


            })

        })




    })












})