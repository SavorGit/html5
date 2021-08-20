/**
 * <h1>普通版应用[共用] - JS</h1>
 *
 * @author <a href="http://www.lizhaoweb.cn">李召(John.Lee)</a>
 * @version 1.0.0.0.1
 * @EMAIL 404644381@qq.com
 * @notes Created on 2021年08月04日<br>
 * Revision of last commit:$Revision$<br>
 * Author of last commit:$Author$<br>
 * Date of last commit:$Date$<br>
 */
;"use strict";
(function(win, jQuery){
	var app = win.WXMiniProgramApp;
	if(typeof(app) != 'object'){
		app = {};
	}
	if(typeof(app.miniPush) != 'object'){
		app.miniPush = {};
	}
	app.miniPush.http = {
		ossRootUrl:        'https://oss.littlehotspot.com',
		apiRootUrl:        'https://mobile.littlehotspot.com',
		apiVersionRootUrl: 'https://mobile.littlehotspot.com/Smallapp46',
		imgRootUrl:        'https://image.littlehotspot.com',
		nettyPushRootUrl:  'https://netty-push.littlehotspot.com'
	};
	app.miniPush.queryMap = jQuery.URL.parametersForGet();
	win.WXMiniProgramApp = app;
})(window, jQuery);


/**
 * 对接友盟
 */
(function(w, d, s, q, i) {
	w[q] = w[q] || [];
	var f = d.getElementsByTagName(s)[0],j = d.createElement(s);
	j.async = true;
	j.id = 'beacon-aplus';
	j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
	f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'aplus_queue', '203467608');
(function(win, que){
	var _uma = win[que];
	if(typeof(_uma) != 'object'){
		throw '对接友盟 SDK 失败！！！';
	}
	//集成应用的appKey
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['appKey', '6115d528e623447a331d0325']
	});
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['aplus-waiting', 'MAN']
	});
	//是否开启调试模式 
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['DEBUG', true]
	});
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['openid', WXMiniProgramApp.miniPush.queryMap['openid']]
	});
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['aplus-idtype', 'openid']
	});
	_uma.push({
		action: 'aplus.setMetaInfo',
		arguments: ['globalproperty', WXMiniProgramApp.miniPush.queryMap]
	});
	_uma.trackEvent = function(eventCode, eventType, eventParams){
		try{
			this.push({
				action: 'aplus.record',
				arguments: [eventCode, eventType, eventParams]
			});
		}catch (error){
			console.error(error);
		}
	}
	win.uma = win.uma || _uma;
})(window, 'aplus_queue');
