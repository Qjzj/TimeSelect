/**
 * 选择器组件
 * @param element
 * @param template
 * @constructor
 */
$.Module_SelectLayer = function(element,template) {
    // 激活元素
    var ActiveButton = element;


    // 组件
    var OBJ = null;
    // 模板
    var Template = template;
    // 选择的数据
    var SelectedData = [];
    var OPTION = {
        Mode: "mobile",  // 模式  待开发
        Multiple: false,  // 多选
        Layout: 'fixed',  // 布局 'fixed'||'flex',
        Postion: "bottom",   // 位置 固定布局时有效 'top'|| 'bottom'
        TopBar: true,    // 是否有Topbar
        DATA: [],
        Title: "请选择",
        Title_ButtonSave: "完成",
        timer: 600,
        Fun_ButtonSave: function() {

        },
        Fun_ItemClick: function() {

        }
    };
    var BODY = $('body');
    var timer = new Date().getTime();

    var ClassObject = {
        OBJ_ButtonSave: null,
        OBJ_Content: null,
        OBJ_Container: null,
        OBJ_Title: null,
        OBJ_TopBar: null,
        Template_Item: null
    };

    this.constructor = function(OP) {
        Object.assign(OPTION,OP);
        CreateElemet();
        Init();
    };

    function Init() {
        ClassObject.OBJ_Container = OBJ.find('#Container');
        ClassObject.OBJ_TopBar = OBJ.find("#TopBar");
        ClassObject.OBJ_Title = OBJ.find("#Title");
        ClassObject.OBJ_Content = OBJ.find('#Content');
        ClassObject.OBJ_ButtonSave = OBJ.find('#ButtonSave');
        ClassObject.Template_Item = ClassObject.OBJ_Content.html();
        ClassObject.OBJ_Content.empty();

        // 设置标题和按钮内容
        ClassObject.OBJ_Title.html(OPTION.Title);
        ClassObject.OBJ_ButtonSave.html(OPTION.Title_ButtonSave);

        // 渲染数据
        DrawData(OPTION.DATA);

        Bind();
    }

    /**
     * 创建元素
     */
    function CreateElemet() {
        OBJ = $('<div ></div>');
        OBJ.append(Template);
        OBJ.attr({
            id: "Module_"+timer,
            "data-off": true
        });
        OBJ.css({
            position: "relative",
            "z-index": '999'
        });
        BODY.append(OBJ);
    }

    /**
     * 修改布局
     */
    function ModifyLayout() {
        // 是否删除TopBar
        if(!OPTION.TopBar) ClassObject.OBJ_TopBar.remove();
        if(OPTION.Layout === 'fixed') {
            // 默认固定在底部
            if(OPTION.Postion === 'bottom') return ;
            // 固定在头部
            ClassObject.OBJ_Container.css({
                top: 0
            }).removeClass("Bottom");
        }else {
            // 获取激活元素距离距离顶部高度
            var offsetTop = ActiveButton.offset().top;
            // 获取激活元素的高度
            var height = ActiveButton.height();
            // 获取卷层高度
            var ScrollHeight = $(document).scrollTop();
            // 组件的高度
            var PluginHeight = ClassObject.OBJ_Container.height();
            // 获取窗口高度
            var ClientHeight = $(window).height();
            // 激活元素底部位置
            var ActiveButtonBottom = offsetTop - ScrollHeight + height;
            ClassObject.OBJ_Container.css({
                top: ActiveButtonBottom+"px",
                overflow: 'auto'
            }).removeClass('Bottom');
            OBJ.css("background","transparent");

        }
    }

    /**
     * 监听
     */
    function Bind() {
        /**
         * 激活组件
         */
        ActiveButton.on('click',function() {
            if(OBJ.attr("data-off") === 'true') {
                OBJ.css('opacity',0).attr('data-off','false').animate({opacity:1},OPTION.timer);
                $(".Publish").css({
                    "overflow":"hidden",
                    "height": "100%"
                });
            }else {
                OBJ.animate({opacity:0},OPTION.timer, function() {
                    OBJ.attr('data-off','true');
                    $(".Publish").css({
                        "overflow":"auto",
                        "height": "100%"
                    });
                });

            }
            // 修改布局
            ModifyLayout();
        });
        /**
         * 点击组件内容之外，隐藏组件
         */
        OBJ.on('click',function(e) {
            e.stopPropagation();
            $(this).animate({opacity:0},OPTION.timer, function() {
                OBJ.attr('data-off','true');
                $(".Publish").css({
                    "overflow":"auto",
                    "height": "100%"
                });
            });
        });
        /**
         * 点击内容区域阻止冒泡
         */
        ClassObject.OBJ_Container.click(function(e) {
            e.stopPropagation();
        });
        /**
         * 点击完成按钮
         */
        ClassObject.OBJ_ButtonSave.click(function() {
            OBJ.animate({opacity:0},OPTION.timer, function() {
                OBJ.attr('data-off','true');
                $(".Publish").css({
                    "overflow":"auto",
                    "height": "100%"
                });
            });
            var selectedData = GetData();
            OPTION.Fun_ButtonSave(selectedData);
        })

    }

    /**
     * 渲染数据
     */
    function DrawData(Data) {
        ClassObject.OBJ_Content.empty();
        for(var i=0; i<Data.length; i++) {
            ClassObject.OBJ_Content.append(ClassObject.Template_Item);
            var ITEM = ClassObject.OBJ_Content.children().last();
            var DATA = Data[i];
            ITEM.attr('data-id',DATA.ID);
            ITEM.html(DATA.title);

            (function(ITEM,DATA) {
                ITEM.click(function() {
                    ITEMClick(ITEM,DATA)
                })
            })(ITEM,DATA);

        }

    }

    /**
     * 项目点击
     */
    function ITEMClick(ITEM,DATA) {
        if(OPTION.Multiple) {
            if(DATA.hasOwnProperty('children') && DATA.children.length>0) return;
            // 多选
            if(ITEM.hasClass('Selected')) {
                // 取消选择
                ITEM.removeClass('Selected');
                SelectedData.remove(DATA);
            }else {
                // 选择
                ITEM.addClass('Selected');
                SelectedData.push(DATA);
            }
        }else {
            // 单选
            ITEM.addClass('Selected').siblings('.Item').removeClass('Selected');
            // 加入数据
            SelectedData.push(DATA);

            // 判断是否有下一级
            if(DATA.hasOwnProperty('children') && DATA.children.length>0 ) {

                DrawData(DATA.children);
                // 添加标签
                AddTag(DATA);
            }else {
                OBJ.animate({opacity: 0},OPTION.timer, function() {
                    OBJ.attr('data-off','true');
                    $(".Publish").css({
                        "overflow":"auto",
                        "height": "100%"
                    });
                });
                // 调用项目点击事件
                OPTION.Fun_ItemClick({
                    ITEM: ITEM,
                    // Data: JSON.parse(JSON.stringify(SelectedData[SelectedData.length-1]))
                });
                SelectedData = [];
            }
        }
    }

    /**
     * 添加选中的标题标签
     * @param DATA
     */
    function AddTag(DATA) {
        var ITEM = $('<span>'+ DATA.title +'</span>');
        var TagLength = ClassObject.OBJ_Title.children('span').length;
        // 判断Title 中是否有已经有标签 如果没有则清空
        if(TagLength <= 0) ClassObject.OBJ_Title.empty();
        ClassObject.OBJ_Title.append(ITEM);
        ITEM.click(function() {
            var index = $(this).index();
            // 如果点击第一个
            if(index === 0) {
                DrawData(OPTION.DATA);
                ClassObject.OBJ_Title.html(OPTION.Title);
            }else {
                // 如果点击不是第一个
                DrawData(SelectedData[index-1].children);

                // 删除此标签以及之后的标签
                while(ClassObject.OBJ_Title.children('span').length >= index +1 ) {
                    ClassObject.OBJ_Title.children('span').last().remove();
                }
            }
            SelectedData.splice(index)
        })
    }



    /**
     * 获取选中的数据
     * @returns {{SelectedData}}
     */
    this.getData = function() {
        return GetData();
    };

    /**
     * 获取选中的数据
     * @returns {{SelectedData: *}}
     * @constructor
     */
    function GetData() {
        return {
            Data: JSON.parse(JSON.stringify(SelectedData))
        }
    }
    this.destroy = function() {
        Destroy();
    };

    function Destroy() {
        OBJ.remove();
    }

    /**
     * 扩展数组方法
     * 查找数组中某个元素的索引值
     * @param val
     * @returns {number}
     */
    Array.prototype.indexOf = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] === val) {
                return i;
            }
        }
        return -1;
    };
    /**
     * 扩展数组方法
     * 删除数组中的某个值
     * 此方法依赖于扩展到查找元素索引值的方法
     * @param val
     * @returns {boolean}
     */
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if(index > -1) {
            this.splice(index,1);
            return true;
        }
        return false;
    }
};