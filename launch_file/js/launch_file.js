﻿/**
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
$(document).ready(function(e){
	$('[name="saveType"]').each(function(index, e){
		var obj = $(e).removeAttr("checked");
		if(index < 1){
			obj.attr("checked", true);
		}
	});
	$("#console").css('font-size','10px').hide().append("传入的参数：" + JSON.stringify(Page.URL.parameters));
	$(".page-top > span").click(function(e){
		Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT++;
		if(Page.LaunchFile.SHOW_CONSOLE_CLICK_COUNT >= 30){
			$("#console").show();
		}
	});
	$(".page-top > a").click(function(e){
		wx.miniProgram.getEnv(function(res) {
			if(res.miniprogram) {
				wx.miniProgram.redirectTo({
					url: '/pages/forscreen/relief',
					success: function(res){
						$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $(".page-top > a").click(); redirectTo("/pages/forscreen/relief")  Success：' + JSON.stringify(res));
					},
					fail: function(res){
						$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $(".page-top > a").click(); redirectTo("/pages/forscreen/relief")  Fail：' + JSON.stringify(res));
					}
				});
			}
		});
	});
	$("#file_name").change(function(e){
		var fullFileName = $(this).val();
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_name").change();  要上传的文件名：' + fullFileName);
		var smpleFileName = $.FileUtils.getSmpleFileName(fullFileName);
		$(this).nextAll(".type").children("#selectfiles").html('<div class="file-choose">' + $.FileUtils.getSuffix(smpleFileName).toUpperCase() + '</div><a href="javascript:void(0);">重新选择</a>');
		$(this).nextAll(".name").hide();
		$("#postfiles").removeAttr("disabled");
	});
	$("#file_upload_status").change(function(e){
		Page.LaunchFile.Variable.uploadEndTimeToOSS = new Date().getTime();
		var fileUploadStatus = $(this).val();
		var ossKey = $("#oss_key").val();
		var fileName = $("#file_name").val();
		var fileSize = $("#oss_file_size").val();
		var saveType = $('[name="saveType"]:checked').val();
		var isFresh = 1;
		Page.LaunchFile.Variable.uploadStusToOSS.push({
			openId: Page.URL.parameters.openid,
			boxMac: Page.URL.parameters.box_mac,
			ossKey: ossKey,
			upStatus: fileUploadStatus,
			fileName: fileName,
			fileSize: fileSize,
			saveType: saveType,
			isFresh: isFresh
		});
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  文件上传OSS的状态：' + fileUploadStatus);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  文件上传OSS的键：' + ossKey);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  文件名：' + fileName);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  文件大小：' + fileSize);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  开始上传时间：' + Page.LaunchFile.Variable.uploadStartTimeToOSS);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  结束上传时间：' + Page.LaunchFile.Variable.uploadEndTimeToOSS);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  文件保存类型：' + saveType);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#file_upload_status").change();  isFresh：' + isFresh);
		if(fileUploadStatus == "200"){
			Page.LaunchFile.gotoPageForShowFile({
				name: fileName,
				size: fileSize,
				upStartTime: Page.LaunchFile.Variable.uploadStartTimeToOSS,
				upEndTime: Page.LaunchFile.Variable.uploadEndTimeToOSS,
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
		//$(".page-main > .will-upload-file > .file-panel > .file")
		Page.LaunchFile.Logger.statusForUploadOSS({
			url: "https://mobile.littlehotspot.com/h5/fileforscreen/addlog"
		});
		while(uploader.files.length > 0){
			uploader.files.shift();
		}
		$('[name="saveType"]').each(function(index, e){
			var obj = $(e).removeAttr("checked");
			if(index < 1){
				obj.attr("checked", true);
			}
		});
		$("#selectfiles").html('<div>+</div>');
		//$("#postfiles").attr("disabled", "disabled");
		$("#ossfile").html("");
		$(".page-main > .will-upload-file > .file-panel > .file > .name").show();
		$("html").hideLoading();
	});
	$("#postfiles").click(function(e){
		$(this).attr("disabled", "disabled");
		$("html").showLoading();
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $("#postfiles").click();  文件上传OSS');
		Page.LaunchFile.Variable.uploadStartTimeToOSS = new Date().getTime();
	});
	/*
	var jsonForFileList = [
		{
			"title": "最近投屏文件",
			"file_list": [
				{
					"file_name": "xxxxxxx.doc",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.docx",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.xls",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.xlsx",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.txt",
					"file_type_img": ""
				}
			]
		},
		{
			"title": "频繁投屏文件",
			"file_list": [
				{
					"file_name": "xxxxxxx.ppt",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.pptx",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.csv",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.rtf",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.pdf",
					"file_type_img": ""
				}
			]
		},
		{
			"title": "XXXXX",
			"file_list": [
				{
					"file_name": "xxxxxxx.ppt",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.pptx",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.csv",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.rtf",
					"file_type_img": ""
				},
				{
					"file_name": "xxxxxxx.pdf",
					"file_type_img": ""
				}
			]
		}
	];
	Page.LaunchFile.loadDataForHistoryPanels(jsonForFileList);
	*/
	$(".page-main > .uploaded-files > .list-panel > .list > .file").click(function(e){
		var forscreenId = $(this).attr("forscreen-id");
		var isFresh = 2;
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $(".page-main > .uploaded-files > .list-panel > .list > .file").click();  forscreenId：' + forscreenId);
		$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] $(".page-main > .uploaded-files > .list-panel > .list > .file").click();  isFresh：' + isFresh);
		Page.LaunchFile.gotoPageForShowFile({
			forscreenId: forscreenId,
			isFresh: isFresh
		});
	});
});

(function(win, $){
	var page = win.Page;
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
		 * 数据结构如下：
		 *
		 * [
			 {
				"title": "最近投屏文件",
				"file_list": [
					{
						"file_name": "xxxxxxx.doc",
						"file_type_img": ""
					}
				]
			}
		]
		*/
		loadDataForHistoryPanels: function(objectArray){
			if(typeof(objectArray) != 'object' || !objectArray instanceof Array){
				return;
			}
			var uploadedFilesPanel = "";
			for(var pIndex in objectArray){
				if(pIndex >= page.LaunchFile.SHOW_MAX_PANELS_COUNT_FOR_HISTORY){
					break;
				}
				var panel = objectArray[pIndex];
				if(typeof(panel) != 'object' && typeof(panel.title) != 'string'){
					continue;
				}
				uploadedFilesPanel += '<div class="list-panel"><div class="title">' + panel.title + '</div><div class="list">';
				var fileList = panel.file_list;
				if(fileList && fileList instanceof Array){
					for(var fIndex in fileList){
						if(fIndex >= page.LaunchFile.SHOW_MAX_FILES_COUNT_FOR_HISTORY){
							break;
						}
						var file = fileList[fIndex];
						uploadedFilesPanel += '<div class="file"><div class="type">' + $.FileUtils.getSuffix(file.file_name).toUpperCase() + '</div><div class="name">' + file.file_name + '</div></div>';
					}
				}
				uploadedFilesPanel += '</div></div>';
			}
			$(".page-main > .uploaded-files").html(uploadedFilesPanel);
			$(".page-main > .uploaded-files > .list-panel > .list > .file").click(function(e){
				Page.LaunchFile.gotoPageForShowFile();
			});
		},
		gotoPageForShowFile: function(fileObj){
			console.log("gotoPageForShowFile", fileObj, Page.URL.parameters);
			$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  OpenId：' + Page.URL.parameters.openid);
			$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  机顶盒MAC：' + Page.URL.parameters.box_mac);
			$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  是否打开极简版：' + Page.URL.parameters.is_open_simple);
			wx.miniProgram.getEnv(function(res) {
				if(res.miniprogram) {
					var miniProgrameURL = '';
					switch(fileObj.isFresh){
						case 1: 
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  保存类型：' + fileObj.saveType);
							wx.miniProgram.postMessage({
								data: {
									openid: Page.URL.parameters.openid,
									box_mac: Page.URL.parameters.box_mac,
									oss_addr: fileObj.ossKey,
									file_name: fileObj.name,
									file_size: fileObj.size,
									res_sup_time: fileObj.upStartTime,
									res_eup_time: fileObj.upEndTime,
									is_open_simple: Page.URL.parameters.is_open_simple,
									save_type: fileObj.saveType,
									is_fresh: fileObj.isFresh,
									pushStatusForOSS: Page.LaunchFile.Variable.uploadStusToOSS
								}
							});
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  postMessage ' + fileObj.isFresh);
							var miniProgrameURL = '/pages/forscreen/forfile/h5files_result?openid=' + Page.URL.parameters.openid
									+ '&box_mac=' + Page.URL.parameters.box_mac
									+ '&oss_addr=' + fileObj.ossKey
									+ '&file_name=' + fileObj.name
									+ '&file_size=' + fileObj.size
									+ '&res_sup_time=' + fileObj.upStartTime
									+ '&res_eup_time=' + fileObj.upEndTime
									+ '&is_open_simple=' + Page.URL.parameters.is_open_simple
									+ '&save_type=' + fileObj.saveType
									+ '&is_fresh=' + fileObj.isFresh;
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  isFresh：' + fileObj.isFresh);
							break;
						case 2: 
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  forscreen_id：' + fileObj.forscreenId);
							wx.miniProgram.postMessage({
								data: {
									openid: Page.URL.parameters.openid,
									box_mac: Page.URL.parameters.box_mac,
									is_open_simple: Page.URL.parameters.is_open_simple,
									forscreen_id: fileObj.forscreenId,
									is_fresh: fileObj.isFresh,
									pushStatusForOSS: Page.LaunchFile.Variable.uploadStusToOSS
								}
							});
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  postMessage ' + fileObj.isFresh);
							var miniProgrameURL = '/pages/forscreen/forfile/h5files_result?openid=' + Page.URL.parameters.openid
									+ '&box_mac=' + Page.URL.parameters.box_mac
									+ '&is_open_simple=' + Page.URL.parameters.is_open_simple
									+ '&forscreen_id=' + fileObj.forscreenId
									+ '&is_fresh=' + fileObj.isFresh;
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  isFresh：' + fileObj.isFresh);
							break;
						default: 
							art.dialog({
								title: '错误',
								content: '<span>未知类型<span>'
							}).lock();
							return;
					}
					$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile  小程序地址：' + miniProgrameURL);
					wx.miniProgram.redirectTo({
						url: miniProgrameURL,
						success: function(res){
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile redirectTo("/pages/forscreen/relief")  Success：' + JSON.stringify(res));
						},
						fail: function(res){
							$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] gotoPageForShowFile redirectTo("/pages/forscreen/relief")  Fail：' + JSON.stringify(res));
						}
					});
					//Page.LaunchFile.Variable.uploadStusToOSS = [];
				}
			});
		},
		Logger: {
			retryMillisecond: 10000,
			statusForUploadOSSTimer: null,
			statusForUploadOSS: function(options){
				$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志：' + JSON.stringify(options));
				clearTimeout(Page.LaunchFile.Logger.statusForUploadOSSTimer);
				$.ajax({
					url: options.url,
					type: options.method ? options.method : "POST",
					cache: false,
					headers: options.headers ? options.headers : {},
					data: options.data ? options.data : {},
					dataType: "JSONP",
					jsonpCallback: "h5turbine",
					complete: function (XMLHttpRequest, textStatus) {
						//$("html").hideLoading();
					},
					success: function (data, textStatus) {
						console.log(new Date().getTime(), data, textStatus);
						$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志[成功]：' + JSON.stringify(options) + '\t' + JSON.stringify(data));
						if(typeof(data) != 'object'){
							Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
								Page.LaunchFile.Logger.statusForUploadOSS(options)
							}, Page.LaunchFile.Logger.retryMillisecond);
						}
						if(data.code != 10000){
							Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
								Page.LaunchFile.Logger.statusForUploadOSS(options)
							}, Page.LaunchFile.Logger.retryMillisecond);
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						console.log(new Date().getTime(), XMLHttpRequest, textStatus, errorThrown);
						$("#console").append('\n[' + new Date().format("yyyy-MM-dd hh:mm:ss.S") + '] statusForUploadOSS  发送埋点日志[失败]：' + JSON.stringify(options));
						Page.LaunchFile.Logger.statusForUploadOSSTimer = setTimeout(function(){
							Page.LaunchFile.Logger.statusForUploadOSS(options)
						}, Page.LaunchFile.Logger.retryMillisecond);
					}
				});
			}
		}
	};
	win.Page = page;
})(window, jQuery);