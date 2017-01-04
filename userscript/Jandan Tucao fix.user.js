// ==UserScript==
// @name         Jandan Tucao fix
// @namespace    http://jandan.net/
// @version      0.4
// @description  拯救被“评论框出错啦(990015): 服务异常,请联系客服人员”折磨的你~
// @author       Slowargo
// @include        http://jandan.net/*
// @grant        none
// ==/UserScript==

function injectTucaoFix() {
    var myElement = document.querySelectorAll("span.time");

    for ( var i = 0 ; i < myElement.length; i++) {
        //console.log("i:" + i + " ? " + myElement[i]);
        myElement[i].addEventListener("click", function() {
            function wait_util(fn, condition, interval) {
                interval = interval || 100;
                return function () {
                    var timer = setInterval(
                        function () {
                            var check;
                            try {
                                check = !!(condition());
                            } catch (e) {
                                check = false;
                            }

                            if (check) {
                                clearInterval(timer);
                                //delete timer;
                                fn();
                            }
                        },
                        interval
                    );
                };
            }

            var link = $(this).find('a');
            if (link.length > 0) {
                var comment_id = $(link).find('span.ds-thread-count').attr('data-thread-key');
                var comment_container = $('#comment-box-' + comment_id);
                var sub_div = comment_container.find('div');
                var retry = 3;

                if (sub_div.length === 0) {
                    console.log("div not found");
                    return;
                }

                var res = $(sub_div[0]).html();

                if (res.length > 0 && res.length < 30 ) {
                    //if ($(sub_div[0]).html() == '评论框出错啦(990015): 服务异常,请联系客服人员' || $(sub_div[0]).html() =='<div id="ds-waiting"></div>' ) {
                    //重置状态，强制多说脚本重新向服务器请求
                    console.log(res + " reset...");
                    $(sub_div[0]).html('');
                    $(sub_div[0]).data("initialized", 0);												
                }

                wait_util(function() {
                }, function() {
                    var res = $(sub_div[0]).html();
                    if (res == '<div id="ds-waiting"></div>') {
                        //如果这里放过了，很可能加载完成后多说返回990015，评论区就直接显示990015了
                        return false;
                    }
                    if (retry-- > 0 && res.length > 0 && res.length < 30) {
                        console.log(res + " retry: " + retry);
                        //重新加载评论框
                        $(sub_div[0]).html('');
                        $(sub_div[0]).data("initialized", 0);
                        DUOSHUO.EmbedThread(sub_div[0]);
                        return false;
                    }
                    return true;
                }, 200) ();
            }    
        }, true);
    }

}

(function() {
    'use strict';

    // Your code here...
    var allscripts = document.querySelectorAll("script");
    for (var itScript = 0; itScript < allscripts.length; itScript++) {
        if (allscripts[itScript].src == 'http://cdn.jandan.net/static/js/tucao.js?v=20161230') {
            console.log(allscripts[itScript].src);
            injectTucaoFix();
            return;
        }
    }
})();
