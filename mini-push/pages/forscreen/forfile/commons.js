/**
 * <h1>文件投屏[共用] - JS</h1>
 *
 * @author <a href="http://www.lizhaoweb.cn">李召(John.Lee)</a>
 * @version 1.0.0.0.1
 * @EMAIL 404644381@qq.com
 * @notes Created on 2018年07月04日<br>
 * Revision of last commit:$Revision$<br>
 * Author of last commit:$Author$<br>
 * Date of last commit:$Date$<br>
 */
;"use strict";
(function(win, jQuery){
	jQuery.FileUtils = {
		getSmpleFileName: function (fullFileName){
			if(typeof(fullFileName) != 'string'){
				art.dialog({
					title: '错误',
					content: '<span>全文件名异常！！！' + fullFileName + '<span>'
				}).lock();
			}
			var fileName = fullFileName;
			while(fileName.indexOf("\\") > 0){
				fileName = fileName.replace("\\", "/");
			}
			var pos = fileName.lastIndexOf('/');
			var smpleFileName = fileName;
			if (pos != -1) {
				smpleFileName = fileName.substring(pos + 1);
			}
			return smpleFileName;
		},
		getSuffix: function (fileName){
			if(typeof(fileName) != 'string'){
				art.dialog({
					title: '错误',
					content: '<span>文件名异常！！！' + fileName + '<span>'
				}).lock();
			}
			var pos = fileName.lastIndexOf('.');
			var suffix = '';
			if (pos != -1) {
				suffix = fileName.substring(pos + 1);
			}
			return suffix;
		}
	};
	jQuery.HttpUtils = {
		Response: {
			getData: function(responseObject){
				if(typeof(responseObject) != 'object'){
					art.dialog({
						title: '错误',
						content: '<span>服务端返回数据不正确！</span>'
					}).lock();
					throw 'Argument \'responseObject\' is not object. \'' + responseObject + '\'';
				}
				if(responseObject.code != 10000){
					art.dialog({
						title: '错误',
						content: '<span>错误码: </span><span>' + responseObject.code + '</span><br/><span>错误信息: </span>' + responseObject.msg + '<span>'
					}).lock();
					throw 'Server exception. Code: ' + responseObject.code + '. Message: ' + responseObject.msg;
				}
				return responseObject.result;
			}
		}
	};
	win.SavorClient = {
		setting: {
			nettyPushURL: WXMiniProgramApp.miniPush.http.apiRootUrl + '/Netty/Index/index' //'https://mobile.littlehotspot.com/Netty/Index/index'
		},
		launchToBox: function(data){
			//var boxMac = "00226D583D92";
			//var sendMessage = '{"action": 7,"resource_type":1, "url": "forscreen/resource/1562297113131_pdf/1.png", "filename":"resource_1562297113131_pdf_1.png","openid":"ofYZG4yZJHaV2h3lJHG5wOB9MzxE","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqVAgUWGzZ1psIMFYQDug7hYicc7kfXlRqO0cezj7OURvRbOWQFsIPyIMmRPFoKzCD5uh9xRkf8aRA/132","nickName":"笨熊?","forscreen_id":"1142709"}'
			jQuery.ajax({
				url: SavorClient.setting.nettyPushURL,
				type: "POST",
				cache: false,
				data: {
					is_js: 1,
					box_mac: data.boxMac,
					msg: data.sendMessage
				},
				dataType: "JSONP",
				jsonpCallback: "h5turbine",
				complete: function (XMLHttpRequest, textStatus) {
					jQuery("html").hideLoading();
				},
				success: function (data, textStatus) {
					console.log(data, textStatus);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest, textStatus, errorThrown);
				}
			});
		}
	};
	var page = win.H5Page;
	if(typeof(page) != 'object'){
		page = {};
	}
	if(typeof(page.URL) != 'object'){
		page.URL = {};
	}
	if(typeof(page.URL.parameters) != 'object'){
		page.URL.parameters= jQuery.URL.parametersForGet();
	}
	win.H5Page = page;
})(window, jQuery);

jQuery(document).ready(function(e){
	if(typeof(H5Page.URL.parameters.box_mac) != 'string'){
		var exceptionMessage = "哟，连上了火星电视！！！ '" + H5Page.URL.parameters.box_mac + "'";
		art.dialog({
			title: '错误',
			content: '<span>' + exceptionMessage + '<span>'
		}).lock();
		throw exceptionMessage;
	}
	if(typeof(H5Page.URL.parameters.mobile_brand) != 'string'){
		var exceptionMessage = "唉？这台设备是外星品牌？ '" + H5Page.URL.parameters.mobile_brand + "'";
		art.dialog({
			title: '错误',
			content: '<span>' + exceptionMessage + '<span>'
		}).lock();
		throw exceptionMessage;
	}
	if(typeof(H5Page.URL.parameters.mobile_model) != 'string'){
		var exceptionMessage = "啊！这台设备是外星型号！ '" + H5Page.URL.parameters.mobile_model + "'";
		art.dialog({
			title: '错误',
			content: '<span>' + exceptionMessage + '<span>'
		}).lock();
		throw exceptionMessage;
	}
	if(typeof(H5Page.URL.parameters.openid) != 'string'){
		var exceptionMessage = "哇！外星人来啦~~ '" + H5Page.URL.parameters.openid + "'";
		art.dialog({
			title: '错误',
			content: '<span>' + exceptionMessage + '<span>'
		}).lock();
		throw exceptionMessage;
	}
	var windowHeight = 0, statusBarHeight = 0;
	if(typeof(H5Page.URL.parameters.windowHeight) == "string"){
		try{
			windowHeight = H5Page.URL.parameters.windowHeight.toInt();
		}catch(err){
			windowHeight = -1;
		}
	}else{
		windowHeight = -2;
	}
	if(typeof(H5Page.URL.parameters.statusBarHeight) == "string"){
		try{
			statusBarHeight = H5Page.URL.parameters.statusBarHeight.toInt();
		}catch(err){
			statusBarHeight = -1;
		}
	}else{
		statusBarHeight = -2;
	}
	if(windowHeight > 0 && statusBarHeight > 0 && windowHeight > statusBarHeight){
		jQuery("body>.page.container").height(windowHeight - statusBarHeight - 47);
	}
});