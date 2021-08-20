/**
 * <h1>文件投屏 - JS</h1>
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
jQuery(document).ready(function(e){
	// 日志控制台初始化
	jQuery("#console").css('font-size','10px').hide().append("传入的参数：" + JSON.stringify(H5Page.URL.parameters));
	jQuery("#console").css('font-size','10px').hide().append("支持的扩展名：" + fileExt);
	// 加载最近投屏文件列表数据
	//loadDataForSavedLaunchedFile(H5Page.URL.parameters.openid);
	// 头部文件的点击事件
	jQuery(".page-top>span").click(function(e){
		H5Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT++;
		if(H5Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT >= 30){
			jQuery("#console").show();
		}
	});
	// 免责声明按钮点击事件
	jQuery(".page-top>a").click(function(e){
		wx.miniProgram.getEnv(function(res) {
			if(res.miniprogram) {
				wx.miniProgram.navigateTo({
					url: '/pages/forscreen/relief',
					success: function(res){
						jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-top > a").click(); navigateTo("/pages/forscreen/relief")  Success：' + JSON.stringify(res));
					},
					fail: function(res){
						jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-top > a").click(); navigateTo("/pages/forscreen/relief")  Fail：' + JSON.stringify(res));
					}
				});
			}
		});
	});
	// 文件名字段变更事件(代表已经选择文件完成)
	jQuery("#file_name").change(function(e){
		var fullFileName = jQuery(this).val();
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_name").change();  要上传的文件名：' + fullFileName);
		jQuery('.page.upload-file>.page-main>.panel.will-upload>.file>.pic').attr('src',H5Page.LaunchFile.getFileIcon(fullFileName));
		jQuery('.page.upload-file>.page-main>.panel.will-upload>.file>.name').text(jQuery('#ossfile').text());
		jQuery('.page.choose-file').hide();
		jQuery('.page.upload-file').show();
		// 文件选择完成埋点
		H5Page.LaunchFile.Logger.statusForUploadOSS({
			url: WXMiniProgramApp.miniPush.http.apiVersionRootUrl + '/datalog/recordlog', // https://mobile.littlehotspot.com/smallapp46/datalog/recordlog
			data:{
				openid: H5Page.URL.parameters.openid,// 用户openid
				type: 7,// 类型 固定参数值为 7
				action_type: 2// 操作动作 1文件选择 2文件选择成功 3文件点击投屏 4文件上传成功
			}
		});
	});
	// 文件上传状态字段变更事件(代表文件上传 OSS 状态)
	jQuery("#file_upload_status").change(function(e){
		H5Page.LaunchFile.Variable.uploadEndTimeToOSS = new Date().getTime();
		var fileUploadStatus = jQuery(this).val();
		var ossKey = jQuery("#oss_key").val();
		var fileName = jQuery("#file_name").val();
		var fileSize = jQuery("#oss_file_size").val();
		var saveType = jQuery('[name="saveType"]:checked').val();
		var isFresh = 1;
		saveType = typeof(saveType) == 'string' ? parseInt(saveType) : saveType;
		if(typeof(saveType) != 'number'){
			saveType = 1;
		}
		H5Page.LaunchFile.Variable.uploadStusToOSS.push({
			openId: H5Page.URL.parameters.openid,
			boxMac: H5Page.URL.parameters.box_mac,
			ossKey: ossKey,
			upStatus: fileUploadStatus,
			fileName: fileName,
			fileSize: fileSize,
			saveType: saveType,
			isFresh: isFresh
		});
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件上传OSS的状态：' + fileUploadStatus);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件上传OSS的键：' + ossKey);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件名：' + fileName);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件大小：' + fileSize);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  开始上传时间：' + H5Page.LaunchFile.Variable.uploadStartTimeToOSS);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  结束上传时间：' + H5Page.LaunchFile.Variable.uploadEndTimeToOSS);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件保存类型：' + saveType);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  isFresh：' + isFresh);
		if(fileUploadStatus == "200"){// 文件已经上传到OSS
			// 文件上传OSS完成时埋点
			H5Page.LaunchFile.Logger.statusForUploadOSS({
				url: WXMiniProgramApp.miniPush.http.apiVersionRootUrl + '/datalog/recordlog', // https://mobile.littlehotspot.com/smallapp46/datalog/recordlog
				data:{
					openid: H5Page.URL.parameters.openid,// 用户openid
					type: 7,// 类型 固定参数值为 7
					action_type: 4// 操作动作 1文件选择 2文件选择成功 3文件点击投屏 4文件上传成功
				},
				async: false
			});
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_upload_status").change();  文件已经上传到 OSS 且已经发送埋点！');
			H5Page.LaunchFile.gotoPageForShowFile({
				name: fileName,
				size: fileSize,
				upStartTime: H5Page.LaunchFile.Variable.uploadStartTimeToOSS,
				upEndTime: H5Page.LaunchFile.Variable.uploadEndTimeToOSS,
				ossKey: ossKey,
				saveType: saveType,
				isFresh: isFresh
			});
		}
		H5Page.LaunchFile.Logger.statusForUploadOSS({
			url: WXMiniProgramApp.miniPush.http.apiRootUrl + '/h5/fileforscreen/addlog' //"https://mobile.littlehotspot.com/h5/fileforscreen/addlog"
		});
		while(uploader.files.length > 0){
			uploader.files.shift();
		}
		jQuery("html").hideLoading();
	});
	// 投屏按钮的点击事件(触发文件上传 OSS 操作)
	jQuery("#postfiles").click(function(e){
		jQuery(this).attr("disabled", "disabled");
		jQuery("html").showLoading();
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#postfiles").click();  文件上传OSS');
		H5Page.LaunchFile.Variable.uploadStartTimeToOSS = new Date().getTime();
		//uma.trackEvent('forscreen_forfile_uploadToOSS','CLK',{'open_id':H5Page.URL.parameters.openid,'box_mac':H5Page.URL.parameters.box_mac,'type':'uploading'});
		uma.push({
			action: 'aplus.record',
			arguments: ['forscreen_forfile_uploadToOSS', 'CLK', {'open_id':H5Page.URL.parameters.openid,'box_mac':H5Page.URL.parameters.box_mac,'rtype':'uploading'}]
		});
		// 开始上传OSS时埋点
		H5Page.LaunchFile.Logger.statusForUploadOSS({
			url: WXMiniProgramApp.miniPush.http.apiVersionRootUrl + '/datalog/recordlog', // https://mobile.littlehotspot.com/smallapp46/datalog/recordlog
			data:{
				openid: H5Page.URL.parameters.openid,// 用户openid
				type: 7,// 类型 固定参数值为 7
				action_type: 3// 操作动作 1文件选择 2文件选择成功 3文件点击投屏 4文件上传成功
			},
		});
	});
	// 保存的投屏文件重投按钮的点击事件
	jQuery(".page-main>.used-recently>.list>.item>.show-block>.relaunch").click(function(e){
		relaunchFileToBox(this);
	});
	// 保存的投屏文件删除按钮的点击事件
	jQuery(".page-main>.used-recently>.list>.item>.btn.del").click(function(e){
		deleteFileForSaved(this);
	});
	// 保存的投屏文件条目增加滑动事件
	jQuery('.panel.used-recently>.body>.item').touchWipe({autoRetract:true, item:'.item', itemDelete: '.btn.del'});
	// 隐藏上传文件页面
	jQuery('.page.upload-file').hide();
});

/**
 * 重新投屏操作
 *
 *@param btnElement 按钮
 */
function relaunchFileToBox(btnElement){
	var forscreenId = jQuery(btnElement).prev('.file').attr("forscreen-id");
	var isFresh = 2;
	jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] relaunchFileToBox 重新投屏 forscreenId：' + forscreenId);
	jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] relaunchFileToBox 重新投屏 isFresh：' + isFresh);
	H5Page.LaunchFile.gotoPageForShowFile({
		forscreenId: forscreenId,
		isFresh: isFresh
	});
}

/**
 * 删除已经保存的投屏文件操作
 *
 *@param btnElement 按钮
 */
function deleteFileForSaved(btnElement){
	var fileObject = jQuery(btnElement).prev('.show-block').children('.file');
	var openId = fileObject.attr('open-id');// H5Page.URL.parameters.openid;
	var forscreenId = fileObject.attr('forscreen-id');
	var url = WXMiniProgramApp.miniPush.http.apiVersionRootUrl + '/fileforscreen/delFile';
	jQuery("html").showLoading();
	jQuery.ajax({
		url: url,
		type: "POST",
		cache: false,
		headers: {
			'LHS-App-Type': 'WX-MINI-PUSH-H5'
		},
		data: {
			openid: openId,
			forscreen_id: forscreenId
		},
		dataType: "JSON",
		//jsonpCallback: "h5turbine",
		complete: function (XMLHttpRequest, textStatus) {
			jQuery("html").hideLoading();
		},
		success: function (data, textStatus) {
			console.log(new Date().getTime(), data, textStatus);
			if(data.code != 10000){
				art.dialog({
					title: '提示',
					content: '<span>文件删除失败<br/>错误码：' + data.code + '<br/>错误信息：' + data.msg + '<span>',
					okValue: '知道了',
					ok: function () {
						return true;
					}
				}).lock();
				return;
			}
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-main>.used-recently>.list>.item>.btn.del").click();  最近投屏文件删除[成功]：{url:"' + url + '", methed: "POST", headers: {"LHS-App-Type": "WX-MINI-PUSH-H5"}, data: {openid: "' + openId + '", forscreen_id: "' + forscreenId + '"}}\t' + JSON.stringify(data));
			art.dialog({
				title: '提示',
				content: '<span>文件删除成功<span>',
				beforeunload: function () {
					window.location.reload();
					return true;
				},
				okValue: '知道了',
				ok: function () {
					window.location.reload();
					return true;
				}
			}).lock();
			//loadDataForSavedLaunchedFile(H5Page.URL.parameters.openid);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(new Date().getTime(), XMLHttpRequest, textStatus, errorThrown);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-main>.used-recently>.list>.item>.btn.del").click();  最近投屏文件删除[失败]：{url:"' + url + '", methed: "POST", headers: {"LHS-App-Type": "WX-MINI-PUSH-H5"}, data: {openid: "' + openId + '", forscreen_id: "' + forscreenId + '"}}\t' + textStatus + '\t' + errorThrown);
			art.dialog({
				title: '错误',
				content: '<span>文件删除失败<span>',
				okValue: '知道了',
				ok: function () {
					return true;
				}
			}).lock();
		}
	});
}

/**
 * 加载最近投屏文件列表数据
 *
 *@param openId 微信小程序的openid
 */
function loadDataForSavedLaunchedFile(openId){
	jQuery(".panel.used-recently").showLoading();
	var url = WXMiniProgramApp.miniPush.http.apiVersionRootUrl + '/fileforscreen/getFilelist';
	jQuery.ajax({
		url: url,
		type: "POST",
		cache: false,
		headers: {
			'LHS-App-Type': 'WX-MINI-PUSH-H5'
		},
		data: {
			openid: openId
		},
		dataType: "JSON",
		//jsonpCallback: "h5turbine",
		complete: function (XMLHttpRequest, textStatus) {
			jQuery(".panel.used-recently").hideLoading();
		},
		success: function (data, textStatus) {
			console.log(new Date().getTime(), data, textStatus);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] loadDataForSavedLaunchedFile  加载最近投屏的文件列表[成功]：{url:"' + url + '", methed: "POST", headers: {"LHS-App-Type": "WX-MINI-PUSH-H5"}, data: {openid: "' + openId + '"}}\t' + JSON.stringify(data));
			if(data.code != 10000){
				art.dialog({
					title: '提示',
					content: '<span>错误码：' + data.code + '<br/>错误信息：' + data.msg + '<span>',
					okValue: '知道了',
					ok: function () {
						return true;
					}
				}).lock();
				return;
			}
			var list = data.result.datalist;
			if(!(list instanceof Array)){
				return;
			}
			jQuery('.panel.used-recently>.body').empty();
			$.each(list, function(index, bean){
				var relaunchButtonObject = jQuery('<div class="btn relaunch theme-button-dark">重投</div>').click(function(e){relaunchFileToBox(this);});
				var showBlockObject = jQuery('<div class="show-block flex-row-center-space_between"><div class="file flex-row-center-space_between" forscreen-id="' + bean.forscreen_id + '" open-id="' + H5Page.URL.parameters.openid + '"><img class="icon" src="' + bean.ext_img + '"/><div class="right flex-column-flex_start-space_between"><div class="name theme-font1 one-line-overflow">' + bean.resource_name + '</div><div class="bottom flex-row-center-flex_start"><div class="size theme-font3">' + bean.file_size + '</div><div class="page-count theme-font3">' + bean.page_num + '页</div></div></div></div></div>').append(relaunchButtonObject);
				var itemObject = jQuery('<div class="item flex-row-center-space_between touch-move-unactive"></div>').append(showBlockObject).append(jQuery('<div class="btn del theme-button-red">删除</div>').click(function(e){deleteFileForSaved(this);}));
				jQuery('.panel.used-recently>.body').append(itemObject);
			});
			// 保存的投屏文件条目增加滑动事件
			jQuery('.panel.used-recently>.body>.item').touchWipe({autoRetract:true, item:'.item', itemDelete: '.btn.del'});
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(new Date().getTime(), XMLHttpRequest, textStatus, errorThrown);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] loadDataForSavedLaunchedFile  加载最近投屏的文件列表[失败]：{url:"' + url + '", methed: "POST", headers: {"LHS-App-Type": "WX-MINI-PUSH-H5"}, data: {openid: "' + openId + '"}}\t' + textStatus + '\t' + errorThrown);
			art.dialog({
				title: '错误',
				content: '<span>加载最近投屏的文件列表失败<span>',
				okValue: '知道了',
				ok: function () {
					return true;
				}
			}).lock();
		}
	});
}

(function(win, jQuery){
	var page = win.H5Page;
	if(typeof(page) != 'object'){
		page = {};
	}
	page.LaunchFile = {
		SHOW_MAX_PANELS_COUNT_FOR_HISTORY: 2,
		SHOW_MAX_FILES_COUNT_FOR_HISTORY: 4,
		SHOW_CONSOLE_CLICK_COUNT: 0,
		Variable: {
			uploadStusToOSS: [],
			uploadStartTimeToOSS: 0,
			uploadEndTimeToOSS: 0
		},
		/**
		 * 跳转到文件展示页
		 *
		 *@param fileObj 文件对象
		 */
		gotoPageForShowFile: function(fileObj){
			console.log("gotoPageForShowFile", fileObj, H5Page.URL.parameters);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  OpenId：' + H5Page.URL.parameters.openid);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  机顶盒MAC：' + H5Page.URL.parameters.box_mac);
			jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  是否打开极简版：' + H5Page.URL.parameters.is_open_simple);
			wx.miniProgram.getEnv(function(res) {
				if(res.miniprogram) {
					var miniProgrameURL = '';
					switch(fileObj.isFresh){
						case 1: 
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  保存类型：' + fileObj.saveType);
							wx.miniProgram.postMessage({
								data: {
									openid: H5Page.URL.parameters.openid,
									box_mac: H5Page.URL.parameters.box_mac,
									oss_addr: fileObj.ossKey,
									file_name: fileObj.name,
									file_size: fileObj.size,
									res_sup_time: fileObj.upStartTime,
									res_eup_time: fileObj.upEndTime,
									is_open_simple: H5Page.URL.parameters.is_open_simple,
									save_type: fileObj.saveType,
									is_fresh: fileObj.isFresh,
									pushStatusForOSS: H5Page.LaunchFile.Variable.uploadStusToOSS
								}
							});
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  postMessage ' + fileObj.isFresh);
							var miniProgrameURL = '/pages/forscreen/forfile/h5files_result?openid=' + H5Page.URL.parameters.openid
									+ '&box_mac=' + H5Page.URL.parameters.box_mac
									+ '&oss_addr=' + fileObj.ossKey
									+ '&file_name=' + fileObj.name
									+ '&file_size=' + fileObj.size
									+ '&res_sup_time=' + fileObj.upStartTime
									+ '&res_eup_time=' + fileObj.upEndTime
									+ '&is_open_simple=' + H5Page.URL.parameters.is_open_simple
									+ '&save_type=' + fileObj.saveType
									+ '&is_fresh=' + fileObj.isFresh;
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  isFresh：' + fileObj.isFresh);
							break;
						case 2: 
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  forscreen_id：' + fileObj.forscreenId);
							wx.miniProgram.postMessage({
								data: {
									openid: H5Page.URL.parameters.openid,
									box_mac: H5Page.URL.parameters.box_mac,
									is_open_simple: H5Page.URL.parameters.is_open_simple,
									forscreen_id: fileObj.forscreenId,
									is_fresh: fileObj.isFresh,
									pushStatusForOSS: H5Page.LaunchFile.Variable.uploadStusToOSS
								}
							});
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  postMessage ' + fileObj.isFresh);
							var miniProgrameURL = '/pages/forscreen/forfile/h5files_result?openid=' + H5Page.URL.parameters.openid
									+ '&box_mac=' + H5Page.URL.parameters.box_mac
									+ '&is_open_simple=' + H5Page.URL.parameters.is_open_simple
									+ '&forscreen_id=' + fileObj.forscreenId
									+ '&is_fresh=' + fileObj.isFresh;
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  isFresh：' + fileObj.isFresh);
							break;
						default: 
							art.dialog({
								title: '错误',
								content: '<span>未知类型<span>'
							}).lock();
							return;
					}
					jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  小程序地址：' + miniProgrameURL);
					wx.miniProgram.redirectTo({
						url: miniProgrameURL,
						success: function(res){
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile redirectTo("/pages/forscreen/relief")  Success：' + JSON.stringify(res));
						},
						fail: function(res){
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile redirectTo("/pages/forscreen/relief")  Fail：' + JSON.stringify(res));
						}
					});
				}
			});
		},
		/**
		 * 获取文件图标
		 *
		 *@param filename 文件名
		 *@return 文件的图标
		 */
		getFileIcon: function(filename){
			var fileSuffix = jQuery.FileUtils.getSuffix(filename);
			if(/^docx?$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/doc.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/doc.png';
			}else if(/^xlsx?$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/excel.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/excel.png';
			}else if(/^pptx?$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/ppt.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/ppt.png';
			}else if(/^rtf$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/rtf.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/rtf.png';
			}else if(/^txt$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/txt.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/txt.png';
			}else if(/^pdf$/i.test(fileSuffix)){
				return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/pdf.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/pdf.png';
			}
			return WXMiniProgramApp.miniPush.http.ossRootUrl + '/Html5/images/mini-push/pages/forscreen/forfile/folder.png'; //'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/folder.png';
		},
		Logger: {
			retryMillisecond: 10000,
			statusForUploadOSSTimer: null,
			/**
			 * 根据上传到OSS的状态，调用API接口，通知服务端
			 *
			 *@param options 请求接口的相关参数。{url:'', method:'POST', headers:{}, data:{}}
			 */
			statusForUploadOSS: function(options){
				try{
					jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志：' + JSON.stringify(options));
					clearTimeout(H5Page.LaunchFile.Logger.statusForUploadOSSTimer);
					jQuery.ajax({
						url: options.url,
						type: options.method ? options.method : "POST",
						cache: false,
						headers: options.headers ? options.headers : {},
						data: options.data ? options.data : {},
						async: options.data ? options.async : true,
						dataType: "JSONP",
						jsonpCallback: "h5turbine",
						complete: function (XMLHttpRequest, textStatus) {
							//jQuery("html").hideLoading();
						},
						success: function (data, textStatus) {
							console.log(new Date().getTime(), data, textStatus);
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志[成功]：' + JSON.stringify(options) + '\t' + JSON.stringify(data));
							if(typeof(data) != 'object'){
								H5Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
									H5Page.LaunchFile.Logger.statusForUploadOSS(options)
								}, H5Page.LaunchFile.Logger.retryMillisecond);
							}
							if(data.code != 10000){
								H5Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
									H5Page.LaunchFile.Logger.statusForUploadOSS(options)
								}, H5Page.LaunchFile.Logger.retryMillisecond);
							}
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							console.log(new Date().getTime(), XMLHttpRequest, textStatus, errorThrown);
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志[失败]：' + JSON.stringify(options));
							H5Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
								H5Page.LaunchFile.Logger.statusForUploadOSS(options)
							}, H5Page.LaunchFile.Logger.retryMillisecond);
						}
					});
				} catch (e){
					jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志[异常]：' + JSON.stringify(options) + '\t' + JSON.stringify(e));
				}
			}
		}
	};
	win.H5Page = page;
})(window, jQuery);
