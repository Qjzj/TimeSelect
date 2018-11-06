$.Module_TimeSelect = function(element,template) {
    var ButtonActive = element;
    var Template = template;
    var OBJ;
    var timer = new Date().getTime();

    var ClassObject = {
        Button_Save: null,
        Button_Cancel: null,
        OBJ_TouchLeft: null,
        OBJ_TouchRight: null,
        OBJ_Hours: null,
        OBJ_Minute: null,
        Template_Item: null
    };
    var flag = true;   // 是否上划
    var HoursPosition = 40;
    var MinutePosition = 40;
    var ClientYStart;
    var ClientYEnd;
    var MoveDistance;
    this.constructor = function() {
        CreateElement();
        OBJ.html(Template);
        ClassObject.OBJ_TouchLeft = OBJ.find('#TouchLeft').get(0);
        ClassObject.OBJ_TouchRight = OBJ.find("#TouchRight").get(0);
        ClassObject.OBJ_Hours = OBJ.find('#Hours').get(0);
        ClassObject.OBJ_Minute = OBJ.find("#Minute").get(0);
        ClassObject.Button_Save = OBJ.find("#Save");
        ClassObject.Button_Cancel = OBJ.find("#Cancel");
        ClassObject.Template_Item = $(ClassObject.OBJ_Hours).html();

        Init();
        Bind();
    };

    /**
     * 创建元素
     */
    function CreateElement() {
        $('body').append('<div id="Module_'+timer+'" style="display:none"></div>');
        OBJ = $('#Module_'+timer);
        OBJ.css({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0
        })
    }

    function Bind() {
        ButtonActive.click(function() {
            OBJ.toggle();
        });

        ClassObject.Button_Save.click(function() {
            var Hours = Math.abs((HoursPosition-30)/30);
            var Minutes = Math.abs((MinutePosition-30)/30);
            var DATE = new Date();
            DATE.setHours(Hours);
            DATE.setMinutes(Minutes);
            ButtonActive.attr('data-id',DATE.getTime());
            ButtonActive.html(DATE.Format("hh:mm"));
            OBJ.hide();


        });

        ClassObject.OBJ_TouchLeft.addEventListener("touchstart",function(e) {
            var e = e || window.e;
            // 小时的位置
            HoursPosition = getTranslateY(getStyle(ClassObject.OBJ_Hours,"transform"));
            ClientYStart = e.touches[0].clientY;  // 手指的位置
        });
        /**
         * 手指移动过程中让小时的位置跟着手指移动设置上下限
         */
        ClassObject.OBJ_TouchLeft.addEventListener("touchmove",function(e) {
            var e = e || window.e;
            ClientYEnd = e.touches[0].clientY;
            MoveDistance = ClientYEnd - ClientYStart;
            flag = MoveDistance < 0;  // 移动距离大于0时是下滑放置则是上滑
            var range =parseInt(HoursPosition) + 2*parseInt(MoveDistance);
            // 初始位置为30 当位置为60时，数字00 在最下方
            if(range>= 80) {
                range = 80;
            }else if(range <= -920) {
                // 当位置为-660 数字23在最上方
                range = -880
            }
            // 让小时根据手指的移动距离移动
            ClassObject.OBJ_Hours.style.transform = "translateY(" + range +"px)";
        });
        ClassObject.OBJ_TouchLeft.addEventListener('touchend',function() {
            HoursPosition = getTranslateY(getStyle(ClassObject.OBJ_Hours,"transform"));

            if(HoursPosition >= 80) {
                HoursPosition = 40;
            }else if(HoursPosition <= -920) {
                HoursPosition = -880;
            }else {
                var D_Value;
                if(flag) {
                    /**
                     * 向上滑动的时候，小时的位置是负数
                     * 只要向上滑动一点小时就要移动高度的一个单位
                     * 所以小时为了向上走，就要给他更大的值，因为是负数，所以减1
                     *
                     */
                    D_Value = -1;
                }else {
                    /**
                     * 向下滑动时，小时的位置是负数
                     * 只要向下滑动一点，小时向下移动高度的一个单位
                     * 需要减小时的位置值，因为负数，本身就是实际位置减小的值所以直接取整
                     */
                    D_Value = 0;
                }
                HoursPosition = (parseInt(HoursPosition/40) + D_Value) * 40;
                if(HoursPosition <= -920) {
                    HoursPosition = -880
                }
            }
            ClassObject.OBJ_Hours.style.transform = "translateY(" + HoursPosition +"px)";
        });

        ClassObject.OBJ_TouchRight.addEventListener("touchstart",function(e) {
            var e = e || window.e;
            // 小时的位置
            MinutePosition = getTranslateY(getStyle(ClassObject.OBJ_Minute,"transform"));
            ClientYStart = e.touches[0].clientY;  // 手指的位置
        });
        /**
         * 手指移动过程中让小时的位置跟着手指移动设置上下限
         */
        ClassObject.OBJ_TouchRight.addEventListener("touchmove",function(e) {
            var e = e || window.e;
            ClientYEnd = e.touches[0].clientY;
            MoveDistance = ClientYEnd - ClientYStart;
            flag = MoveDistance < 0;  // 移动距离大于0时是下滑放置则是上滑
            var range =parseInt(MinutePosition) + 2*parseInt(MoveDistance);
            // 初始位置为30 当位置为60时，数字00 在最下方
            if(range>= 80) {
                range = 80;
            }else if(range <= -2360) {
                // 当位置为-660 数字23在最上方
                range = -2320
            }
            // 让小时根据手指的移动距离移动
            ClassObject.OBJ_Minute.style.transform = "translateY(" + range +"px)";
        });
        ClassObject.OBJ_TouchRight.addEventListener('touchend',function() {
            MinutePosition = getTranslateY(getStyle(ClassObject.OBJ_Minute,"transform"));

            if(MinutePosition >= 80) {
                MinutePosition = 40;
            }else if(MinutePosition <= -2360) {
                MinutePosition = -2320;
            }else {
                var D_Value;
                if(flag) {
                    /**
                     * 向上滑动的时候，小时的位置是负数
                     * 只要向上滑动一点小时就要移动高度的一个单位
                     * 所以小时为了向上走，就要给他更大的值，因为是负数，所以减1
                     *
                     */
                    D_Value = -1;
                }else {
                    /**
                     * 向下滑动时，小时的位置是负数
                     * 只要向下滑动一点，小时向下移动高度的一个单位
                     * 需要减小时的位置值，因为负数，本身就是实际位置减小的值所以直接取整
                     */
                    D_Value = 0;
                }
                MinutePosition = (parseInt(MinutePosition/40) + D_Value) * 40;
                if(MinutePosition<=-2360) {
                    MinutePosition = -2320;
                }
            }
            ClassObject.OBJ_Minute.style.transform = "translateY(" + MinutePosition +"px)";
        });
    }

    function Init() {
        DrawItem();
    }

    function DrawItem() {
        var Hours = $(ClassObject.OBJ_Hours);
        var Minute = $(ClassObject.OBJ_Minute);
        Hours.empty();
        Minute.empty();
        for(var i=0; i<24; i++) {
            Hours.append(ClassObject.Template_Item);
            var ITEM = Hours.children().last();
            var val = i<10 ? "0"+i : i;
            ITEM.html(val);
        }

        for(var j=0; j<60; j++) {
            Minute.append(ClassObject.Template_Item);
            var item = Minute.children().last();
            var value = j<10 ? "0"+j : j;
            item.html(value);
        }
    }

    /**
     * 获取样样式
     * @param element
     * @param attr
     * @returns {string}
     */
    function getStyle(element, attr) {
        if (element.currentStyle) {
            return element.currentStyle[attr]; // IE的获取元素的方法
        } else {
            return getComputedStyle(element, null)[attr];
        }
    }

    /**
     * 获取translate的值
     * @param val
     * @returns {*}
     */
    function getTranslateY(val) {
        var reg = /\(([\s\S]*)\)$/;
        if(reg.test(val)) {
            var arr = RegExp.$1.split(',');
            return arr[5];
        }
        return null;
    }
};