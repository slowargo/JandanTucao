var allscripts = document.querySelectorAll('script');
for (var i = 0; i < allscripts.length; i++) {
	if (allscripts[i].src == 'http://cdn.jandan.net/static/js/tucao.js?v=20161230') {
		console.log(allscripts[i].src);
		var s = document.createElement('script');
		// TODO: add "mytucao.js" to web_accessible_resources in manifest.json
		s.src = chrome.extension.getURL('mytucao_inject.js');
		s.onload = function() {
		    this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(s);
		
		break;
	}
}
