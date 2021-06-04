/**
 *
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
"use strict";
jQuery(document).ready(function(e){
	jQuery("#console").css('font-size','10px').hide().append("传入的参数：" + JSON.stringify(H5Page.URL.parameters));
	jQuery(".page-top>span").click(function(e){
		H5Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT++;
		if(H5Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT >= 30){
			jQuery("#console").show();
		}
	});
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
	jQuery("#file_name").change(function(e){
		var fullFileName = jQuery(this).val();
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#file_name").change();  要上传的文件名：' + fullFileName);
		jQuery('.page.upload-file>.page-main>.panel.will-upload>.file>.pic').attr('src',H5Page.LaunchFile.getFileIcon(fullFileName));
		jQuery('.page.upload-file>.page-main>.panel.will-upload>.file>.name').text(jQuery('#ossfile').text());
		jQuery('.page.choose-file').hide();
		jQuery('.page.upload-file').show();
	});
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
		if(fileUploadStatus == "200"){
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
		/**
		var content = "这是直接使用HTML5进行导出的";
		var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "savor_file.txt");//saveAs(blob,filename)
		*/
		H5Page.LaunchFile.Logger.statusForUploadOSS({
			url: "https://mobile.littlehotspot.com/h5/fileforscreen/addlog"
		});
		while(uploader.files.length > 0){
			uploader.files.shift();
		}
		jQuery("html").hideLoading();
	});
	jQuery("#postfiles").click(function(e){
		jQuery(this).attr("disabled", "disabled");
		jQuery("html").showLoading();
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery("#postfiles").click();  文件上传OSS');
		H5Page.LaunchFile.Variable.uploadStartTimeToOSS = new Date().getTime();
	});
	jQuery(".page-main>.used-recently>.list>.item>.relaunch").click(function(e){
		var forscreenId = jQuery(this).prev('.file').attr("forscreen-id");
		var isFresh = 2;
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-main>.used-recently>.list>.item>.relaunch").click();  forscreenId：' + forscreenId);
		jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] jQuery(".page-main>.used-recently>.list>.item>.relaunch").click();  isFresh：' + isFresh);
		H5Page.LaunchFile.gotoPageForShowFile({
			forscreenId: forscreenId,
			isFresh: isFresh
		});
	});
	jQuery('.page.upload-file').hide();
});

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
					wx.miniProgram.navigateTo({
						url: miniProgrameURL,
						success: function(res){
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile navigateTo("/pages/forscreen/relief")  Success：' + JSON.stringify(res));
						},
						fail: function(res){
							jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile navigateTo("/pages/forscreen/relief")  Fail：' + JSON.stringify(res));
						}
					});
				}
			});
		},
		getFileIcon: function(filename){
			var fileSuffix = jQuery.FileUtils.getSuffix(filename);
			if(/^docx?jQuery/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/doc.png';
			}else if(/^xlsx?jQuery/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/excel.png';
			}else if(/^pptx?jQuery/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/ppt.png';
			}else if(/^rtf$/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/rtf.png';
			}else if(/^txt$/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/txt.png';
			}else if(/^pdf$/i.test(fileSuffix)){
				return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/pdf.png';
			}
			return 'https://oss.littlehotspot.com/Html5/images/mini-push/pages/forscreen/forfile/folder.png';
		},
		Logger: {
			retryMillisecond: 10000,
			statusForUploadOSSTimer: null,
			statusForUploadOSS: function(options){
				jQuery("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志：' + JSON.stringify(options));
				clearTimeout(H5Page.LaunchFile.Logger.statusForUploadOSSTimer);
				jQuery.ajax({
					url: options.url,
					type: options.method ? options.method : "POST",
					cache: false,
					headers: options.headers ? options.headers : {},
					data: options.data ? options.data : {},
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
			}
		}
	};
	win.H5Page = page;
})(window, jQuery);