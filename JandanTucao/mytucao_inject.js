/*
var override_loaded = false;

function override_tucao_js() {
	console.log("overload? "+ override_loaded);
	if (override_loaded)
		return;
	override_loaded = true;
	chrome.webRequest.onBeforeRequest.addListener(
	    function(details) {
	        if( details.url == "http://cdn.jandan.net/static/js/tucao.js?v=20161230" ) {
	        		console.log(details);
	            return {redirectUrl: chrome.extension.getURL('mytucao.js') };
	        }
	    },
	    {urls: ["*://cdn.jandan.net/*.js"]},
	    ["blocking"]);
}
*/

var myElement = document.querySelectorAll("span.time");
//console.log(myElement);

for ( var i = 0 ; i < myElement.length; i++) {
	//console.log("i:" + i + " ? " + myElement[i]);
	myElement[i].addEventListener("mouseover", function() {
		var global_black_list = '换电池哥|換電池哥|batteryman|尼打野|虎虎虎|1283|彭丽媛|宋祖英|习近平|李克强|温家宝|胡锦涛|金正恩|Sherlock|www|pao33|.tk';
		 
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
                        delete timer;
                        fn();
                    }
                },
                interval
            );
        };
    }
    
		$(this).find('a').off();
		$(this).find('a').click(function(){
            // 重设当前URL            
            var comment_id = $(this).find('span.ds-thread-count').attr('data-thread-key');
            var comment_container = $('#comment-box-' + comment_id);
            var this_li = $('li#' + comment_id);
            var comment_url = this_li.find('.righttext a').attr('href');            
            var img_url = this_li.find('img').attr('src');
            //console.log(comment_container);
            
            var sub_div = comment_container.find('div');
            
            var retry = 3;
            /*
            if (sub_div.length == 0) {
				        sub_div = $('<div></div>');
				        sub_div.attr('data-thread-key', comment_id);
				        sub_div.attr("data-url", comment_url);
				        if (img_url) {
				            sub_div.attr('data-image', img_url);
				        }
				        comment_container.append(sub_div[0]);            	
				        sub_div = comment_container.find('div');
            }
            */
            
            //sub_div.attr('data-thread-key-xx', comment_id);
            //sub_div.attr("data-url", comment_url);
		                               
						//console.log(comment_container.find('div')[0]);
						//console.log(i.data("initialized"));
						
						var res = $(sub_div[0]).html();
            if (res.length > 0 && res.length < 30 && res != '<div id="ds-waiting"></div>') {
						//if ($(sub_div[0]).html() == '评论框出错啦(990015): 服务异常,请联系客服人员' || $(sub_div[0]).html() =='<div id="ds-waiting"></div>' ) {
							console.log(res);
							$(sub_div[0]).html('');
							$(sub_div[0]).data("initialized", 0);
						}						
						
            DUOSHUO.EmbedThread(sub_div[0]);            
            $('#comment-box-' + comment_id).slideToggle(function () {
                if ($(this).is(':visible')) {
                    wait_util(
                        function () {
                            var comment_container = $('#comment-box-' + comment_id);
                            var duoshuo_container = comment_container.find('#ds-thread');
                            var block_nicknames = getCookie('block_nicknames');
                            var block_ids = getCookie('block_ids');

                            if (!block_nicknames) {
                                block_nicknames = '';
                            }
                            if (!block_ids) {
                                block_ids = '';
                            }
                            
                            if (duoshuo_container.length > 0) {
                                duoshuo_container.find('.ds-post').each(function () {
                                    var $this = $(this);
                                    var user_id = $this.find('.ds-avatar').attr('data-user-id');
                                    var nickname = $this.find('.ds-user-name').text();
                                    // 跳过空行
                                    if (!nickname) {
                                        return;
                                    }
			                            	
                                    $this.css('position', 'relative');
                                    var in_global_black = global_black_list.indexOf(nickname + '|') > -1;
                                    var in_cookie_id_black = (user_id !== undefined && block_ids.indexOf(user_id + '|') > -1);
                                    var in_cookie_nickname_black = block_nicknames.indexOf(nickname + '###') > -1;
                                    if ( in_global_black || in_cookie_id_black || in_cookie_nickname_black) {
                                        var text = '';
                                        if (in_global_black) {
                                            text = '<span>官方屏蔽</span>';
                                        } else {
                                            text = '<span style="display:none">已屏蔽 <strong>'+nickname+'</strong> 的吐槽. <a href="javascript:;" style="color: #ccc;"  class="show-comment-once">[手贱一下]</a><a href="javascript:;" class="unblock-user" style="color: #ccc;">[解除屏蔽]</a></span>';
                                        }
                                        $this.append('<div style="background-color: #fff; position: absolute; left: 0; right: 0; top: 0; bottom: 0; text-align: center; color: #ccc" class="block-mask-div"><div style="position: absolute;width: 500px; height: 25px; left: 50%; top: 50%; margin-left: -250px; margin-top: -5px; font-size: 11px;"> &osol; '+ text +'</div></div>');
                                        $this.height(20);
                                        if (!in_global_black) {
                                            $this.on('mouseenter click', '.block-mask-div', function () {
                                                $(this).find('span').fadeIn();
                                            }).on('mouseleave click', '.block-mask-div', function () {
                                                $(this).find('span').fadeOut();
                                            });
                                        }

                                        $this.find('.show-comment-once').click(function() {
                                            $this.css('height', 'auto');
                                            $(this).closest('.block-mask-div').remove();
                                        });
                                        $this.find('.unblock-user').click(function() {
                                            if (!confirm('确定解除对'+nickname+'的屏蔽吗?')) {
                                                return;
                                            }
                                            var block_nicknames = getCookie('block_nicknames');
                                            var block_ids = getCookie('block_ids');
                                            if (user_id !== undefined) {
                                                block_ids = block_ids.replace(user_id+'|', '');
                                            }
                                            block_nicknames = block_nicknames.replace(nickname+'###', '');
                                            setCookie('block_ids', block_ids, 365);
                                            setCookie('block_nicknames', block_nicknames, 365);
                                            window.location.reload();
                                        });
                                        $this.addClass('jandan-blocked');
                                    }
                                    if ($this.hasClass('jandan-blocked')) {
                                        return;
                                    }
                                    var panel = $this.find('.block-panel');
                                    if (panel.length == 0) {
                                        var block_user = '';
                                        if ($this.find('.ds-avatar').attr('data-user-id')) {
                                            block_user = '<span class="block-user">[ 屏蔽此人 ]</span>';
                                        }
                                        panel = $('<div class="block-panel"><span title="屏蔽">&ominus;</span>' + block_user + '<span class="block-nickname">[ 屏蔽昵称 ]</span></div>');
                                        panel.find('span').each(function (index) {
                                            var display = 'none';
                                            var font_size = '11px';
                                            if (index == 0) {
                                                $(this).click(function() {
                                                    var $this = $(this);
                                                    var parent = $this.parent();
                                                    $this.remove();
                                                    parent.find('span').fadeIn();
                                                });
                                                display = 'inline';
                                                font_size = '16px';
                                            }
                                            $(this).css({
                                                'font-size': font_size,
                                                'color': '#999',
                                                'padding': '5px',
                                                'display' : display
                                            });
                                        });
                                        panel.find('.block-user').click(function () {
                                            if (!confirm('确定要屏蔽此人吗')) {
                                                return;
                                            }
                                            var block_ids = getCookie('block_ids');
                                            if (!block_ids || block_ids === undefined) {
                                                block_ids = '';
                                            }
                                            if (block_ids.indexOf(user_id) == -1) {
                                                block_ids += user_id + '|';
                                            }
                                            setCookie('block_ids', block_ids, 365);
                                            window.location.reload();
                                        });
                                        panel.find('.block-nickname').click(function () {
                                            if (!confirm('确定要屏蔽此昵称吗')) {
                                                return;
                                            }
                                            var block_nicknames = getCookie('block_nicknames');
                                            if (!block_nicknames || block_nicknames === undefined) {
                                                block_nicknames = '';
                                            }
                                            if (block_nicknames.indexOf(nickname) == -1) {
                                                block_nicknames += nickname + '###';
                                            }
                                            setCookie('block_nicknames', block_nicknames, 365);
                                            window.location.reload();
                                        });

                                        panel.css('line-height', '22px');
                                        $this.append(panel);
                                    }
                                });
                            }
                        },
                        function () {
                            // the code that tests here... (return true if test passes; false otherwise)
                            var r = $('#comment-box-' + comment_id).find('#ds-thread').length > 0;
                            //煎蛋多说评论框拯救计划v.02
                            //如果多说返回服务异常，立刻重试（希望不会刷挂多说的服务器）
                            //if (r && $(sub_div[0]).html() == '评论框出错啦(990015): 服务异常,请联系客服人员') {
                            var res = $(sub_div[0]).html();
                            if (r) {
                            	if (retry-- > 0 && res.length < 30 && res != '<div id="ds-waiting"></div>') {
	                            	console.log(res + " retry: " + retry);
																$(sub_div[0]).html('');
																$(sub_div[0]).data("initialized", 0);
																DUOSHUO.EmbedThread(sub_div[0]);
																return false;
															}
                            }
                            return r;
                        },
                        10 // amout to wait between checks
                    )();

                    var tu_cao_gg = $('#tucao-gg');
                    tu_cao_gg.css({'left': 0, 'top': 20, 'right': 0});
                    // 把广告元素移动过来
                    if (this_li.find('#tucao-gg').length == 0) {
                        this_li.find('.tucao-close-btn').append(tu_cao_gg);
                    }
                }
                $('#comment-box-' + comment_id + '-close').toggle();
            });
            
		});
	});

/*	
	myElement[i].addEventListener("click", function() {
		console.log("!!");
		//$(this).children().off();
		//$(this).find('a').off();
		//override_tucao_js();
	});
*/

}

//console.log(myElement);
