$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义加载分类可选项的方法 
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                layer.msg('获取文章分类列表成功！')

                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 图片上传
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        // 模拟上传文件的点击事件
        $('#coverFile').click()
    })
    // $('#coverFile') 绑定change 事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 发布
    var art_state = '已发布'
    // 点击存为草稿 将发布的状态改为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // form表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // 将封面裁剪过后的图片 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(fd);
                // 调用发表文章函数
                publishArticle(fd)
            })
    })
    // 定义一个发表文章的方法
    function publishArticle(fd) {

        // 发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章发表失败')
                }
                layer.msg('文章发表成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})