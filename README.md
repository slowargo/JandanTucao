# JandanTucao
煎蛋多说评论框拯救计划（Chrome Extension），拯救被“评论框出错啦(990015): 服务异常,请联系客服人员”折磨的你。当多说服务器返回错误的时候，会自动重试。如果重试还不行，重新点一下吐槽按键也会触发重试。再也不用整个页面刷新啦~~~<br>
<br>
##使用方法
JandanTucao_release.zip下载后解压，然后通过Chrome的扩展管理页面的“加载已解压的扩展程序”功能加载。
<br>
##问题分析
多说的脚本embed.js在请求前会进行无脑初始化：
```
                    if (!i.data("initialized")) {
                        i.data("initialized", !0);
```
也就是说，无论多说的服务器返回啥，都会缓存下来不会再次发起请求了。解决方法也很简单：
```
						var res = $(sub_div[0]).html();
            if (res.length > 0 && res.length < 30) {
							$(sub_div[0]).html('');
							$(sub_div[0]).data("initialized", 0);
						}						
						
            DUOSHUO.EmbedThread(sub_div[0]);   
```
在调用多说API前检查一下，如果保存下来的内容是'评论框出错啦(990015): 服务异常,请联系客服人员'（这里把字符串比较改成了比较res.length < 30），就重置一下，这样多说API就会再次向服务器发起请求了。
