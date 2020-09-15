$(function () {
    // 定义美化时间的过滤
    template.defaults.imports.dadeFormat = function (dtStr) {
        // 年月日补零调用
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())
        return y + '/' + m + '/' + d + ' ' + h + ':' + mm + ':' + s
    }
    // 定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // pagenum -- 页码值  pagesize-- 每页显示几条
    // 定义一个查询参数的对象,将来请求数据的时候 
    // 需要将请求的参数对象提交给服务器
    var q = {
        pagenum: 1,   // 页码值 
        pagesize: 2,  // 每页显示2条
        cate_id: '',  // 文章分类的Id
        state: ''     // 文章的发布状态
    }
    // 获取文章列表数据
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取模版失败')

                }
                // console.log(res);
                // layer.msg('获取模版成功')
                // 使用模版引擎渲染文章列表
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染分页的调用 
                renderPage(res.total)
            }
        })
    }


    // 文章下拉分类列表动态获取
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // layer.msg('获取文章分类列表成功！')

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 点击筛选点击按钮 进行筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var cate_state = $('[name=state]').val()
        q.cate_id = cate_id // 文章分类的Id
        q.state = cate_state     // 文章的发布状态
        // 获取文章列表数据重新渲染
        initTable()
    })

    // #pageBox 分页框
    // 定义渲染分页的方法 
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',   //注意，这里的内容是 ID，不用加 # 号
            count: total,      //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum,   // 当前页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 下拉菜单选项---limit的下拉
            limits: [2, 3, 4, 5],
            // 分页发生切换的时候,触发jump函数回调
            // 触发jump回调的方式有两种方式:
            // 1. 点击页码的时候
            // 2. 只要调用了laypage.render()方法 就会触发
            jump: function (obj, first) {
                console.log(obj.curr);  // 最新页码值
                console.log(first);  // true / false
                q.pagenum = obj.curr
                // 点击条目切换每页显示条数时 获取到数据 obj.limit
                // 把最新的条目数 赋值到q对应的数据列表
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除按钮 .btn-delete 删除此条文章--- 动态元素的点击 需要事件委托 
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        var delId = $(this).attr('data-id')
        // 点击删除按钮 弹出询问提示框框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // do something 
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + delId,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                    // 根据索引 关闭当前添加分类
                    // layer.close(index)
                    // 判断此页文章条目为0时  页码值要 -1
                    if (len === 1) {
                        // 页码值最小为1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    // 重新初始化页面
                    initTable()
                }
            })
        })
    })
})