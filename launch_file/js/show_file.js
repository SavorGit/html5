/**
 *
 * <h1>展示文件内容 - JS</h1>
 *
 * @author <a href="http://www.lizhaoweb.cn">李召(John.Lee)</a>
 * @version 1.0.0.0.1
 * @EMAIL 404644381@qq.com
 * @notes Created on 2018年07月04日<br>
 * Revision of last commit:$Revision$<br>
 * Author of last commit:$Author$<br>
 * Date of last commit:$Date$<br>
 */
$(document).ready(function(e){
	$(".page-main > .weui-grids").empty();
	$(".page-main").showLoading();
	
	//var requestURL = "https://mobile.littlehotspot.com/Smallapp3/Fileforscreen/fileconversion?action=30&box_mac=00226D655202&mobile_brand=devtools&mobile_model=iPhone%207%20Plus&openid=ofYZG4yZJHaV2h3lJHG5wOB9MzxE&oss_addr=forscreen%2Fresource%2F1562305691536.pdf&res_sup_time=1562305691536&res_eup_time=1562305691762&resource_name=MMAOTTV1.0&resource_size=628245&resource_type=3";
	/*
	$("html").showLoading();
	$.ajax({
		url: "https://mobile.littlehotspot.com/Smallapp3/Fileforscreen/fileconversion",
		type: "GET",
		cache: false,
		headers:{
			'Content-Type': 'application/json;charset=utf8',
			'organId': '1333333333'
		},
		data: {
			action: 30,
			box_mac: "00226D655202",
			mobile_brand: "devtools",
			mobile_model: "iPhone 7 Plus",
			openid: "ofYZG4yZJHaV2h3lJHG5wOB9MzxE",
			oss_addr: "forscreen/resource/1562305691536.pdf",
			res_sup_time: 1562305691536,
			res_eup_time: 1562305691762,
			resource_name: "MMAOTTV1.0",
			resource_size: 628245,
			resource_type: 3
		},
		dataType: "json",
		beforeSend: function(request) {
			request.setRequestHeader("organId:'1333333333'");
		},
		complete: function (XMLHttpRequest, textStatus) {
			$("html").hideLoading();
		},
		success: function (data, textStatus) {
			console.log(data, textStatus);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
	*/
	
	var responseObject = {
	    "code": 10000,
	    "msg": "成功",
	    "result": {
	        "status": 2,
	        "task_id": 0,
	        "percent": 100,
	        "img_num": 16,
	        "forscreen_id": "1140684",
	        "imgs": [
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/1.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/1.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/2.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/2.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/3.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/3.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/4.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/4.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/5.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/5.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/6.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/6.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/7.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/7.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/8.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/8.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/9.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/9.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/10.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/10.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/11.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/11.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/12.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/12.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/13.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/13.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/14.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/14.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/15.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/15.png"
	            },
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/16.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/16.png"
	            }
	        ]
	    }
	};
	Page.ShowFile.loadDataForFilePanel($.HttpUtils.Response.getData(responseObject));
	$(".page-main").hideLoading();
	
	// 重选文件
	$("#reChooseFile").click(function(e){});
	
	// 退出投屏
	$("#quitLaunch").click(function(e){
		var boxMac = "00226D583D92";
		var sendMessage = '{"action": 3,"openid":"ofYZG4yZJHaV2h3lJHG5wOB9MzxE"}'
		SavorClient.launchToBox({
			boxMac: boxMac,
			sendMessage: sendMessage
		});
	});
	
	// 播放上一张
	$("#prev_page").click(function(e){
		var chooseFile = $(".page-main > .weui-grids").find(".choose");
		var prevFile = chooseFile.prev();
		if(prevFile.size() < 1){
			return;
		}
		chooseFile.removeClass("choose").find(".cover").removeClass("font-color-1").addClass("font-color-2").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/FFFFFF_right-triangle.png");
		prevFile.addClass("choose").find(".cover").removeClass("font-color-2").addClass("font-color-1").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/1CBEB6_right-triangle.png");
		console.log("prevFile", prevFile.offset().top);
		var mainContainer = $(".page-main");
		mainContainer.animate({
			scrollTop: prevFile.offset().top - mainContainer.offset().top + mainContainer.scrollTop()
		}, 300);
		var boxMac = "00226D583D92";
		var sendMessage = '{"action": 7,"resource_type":1, "url": "forscreen/resource/1562297113131_pdf/1.png", "filename":"resource_1562297113131_pdf_1.png","openid":"ofYZG4yZJHaV2h3lJHG5wOB9MzxE","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqVAgUWGzZ1psIMFYQDug7hYicc7kfXlRqO0cezj7OURvRbOWQFsIPyIMmRPFoKzCD5uh9xRkf8aRA/132","nickName":"笨熊?","forscreen_id":"1142709"}'
		SavorClient.launchToBox({
			boxMac: boxMac,
			sendMessage: sendMessage
		});
	});
	
	// 播放下一张
	$("#next_page").click(function(e){
		var chooseFile = $(".page-main > .weui-grids").find(".choose");
		var nextFile = chooseFile.next();
		if(nextFile.size() < 1){
			return;
		}
		chooseFile.removeClass("choose").find(".cover").removeClass("font-color-1").addClass("font-color-2").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/FFFFFF_right-triangle.png");
		nextFile.addClass("choose").find(".cover").removeClass("font-color-2").addClass("font-color-1").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/1CBEB6_right-triangle.png");
		console.log("nextFile", nextFile.offset().top);
		var mainContainer = $(".page-main");
		mainContainer.animate({
			scrollTop: nextFile.offset().top - mainContainer.offset().top + mainContainer.scrollTop()
		}, 300);
		var boxMac = "00226D583D92";
		var sendMessage = '{"action": 7,"resource_type":1, "url": "forscreen/resource/1562297113131_pdf/1.png", "filename":"resource_1562297113131_pdf_1.png","openid":"ofYZG4yZJHaV2h3lJHG5wOB9MzxE","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqVAgUWGzZ1psIMFYQDug7hYicc7kfXlRqO0cezj7OURvRbOWQFsIPyIMmRPFoKzCD5uh9xRkf8aRA/132","nickName":"笨熊?","forscreen_id":"1142709"}'
		SavorClient.launchToBox({
			boxMac: boxMac,
			sendMessage: sendMessage
		});
	});
	
	// 点击某一张
	$(".weui-grid").click(function(e){
		var chooseFile = $(".page-main > .weui-grids").find(".choose");
		var thisFile = $(this);
		if(thisFile.size() < 1){
			return;
		}
		chooseFile.removeClass("choose").find(".cover").removeClass("font-color-1").addClass("font-color-2").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/FFFFFF_right-triangle.png");
		thisFile.addClass("choose").find(".cover").removeClass("font-color-2").addClass("font-color-1").children("img").attr("src", "https://oss.littlehotspot.com/Html5/images/launch_file/1CBEB6_right-triangle.png");
		var boxMac = "00226D583D92";
		var sendMessage = '{"action": 7,"resource_type":1, "url": "forscreen/resource/1562297113131_pdf/1.png", "filename":"resource_1562297113131_pdf_1.png","openid":"ofYZG4yZJHaV2h3lJHG5wOB9MzxE","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqVAgUWGzZ1psIMFYQDug7hYicc7kfXlRqO0cezj7OURvRbOWQFsIPyIMmRPFoKzCD5uh9xRkf8aRA/132","nickName":"笨熊?","forscreen_id":"1142709"}'
		SavorClient.launchToBox({
			boxMac: boxMac,
			sendMessage: sendMessage
		});
	});
});

(function(win, $){
	var page = win.Page;
	if(typeof(page) != 'object'){
		page = {};
	}
	page.ShowFile = {
		SHOW_MAX_PANELS_COUNT_FOR_HISTORY: 2,
		SHOW_MAX_FILES_COUNT_FOR_HISTORY: 4,
		/**
		 * 数据结构如下：
		 *
		 * {
	        "status": 2,
	        "task_id": 0,
	        "percent": 100,
	        "img_num": 16,
	        "forscreen_id": "1140684",
	        "imgs": [
	            {
	                "img_path": "http://oss.littlehotspot.com/forscreen/resource/1562297113131_pdf/1.png",
	                "oss_path": "forscreen/resource/1562297113131_pdf/1.png"
	            }
	        ]
	    }
		*/
		loadDataForFilePanel: function(dataObject){
			if(typeof(dataObject) != 'object'){
				return;
			}
			var objectArray = dataObject.imgs;
			if(typeof(objectArray) != 'object' || !objectArray instanceof Array){
				return;
			}
			var filesPanel = "";
			for(var index in objectArray){
				var file = objectArray[index];
				if(typeof(file) != 'object' && typeof(file.img_path) != 'string' && typeof(file.oss_path) != 'string'){
					continue;
				}
				var pageNumber = index.toInt() + 1;
				var chooseClass = index == 0 ? ' choose' : '';
				var fontColor = index == 0 ? ' font-color-1' : ' font-color-2';
				var pageIcon = index == 0 ? 'https://oss.littlehotspot.com/Html5/images/launch_file/1CBEB6_right-triangle.png' : 'https://oss.littlehotspot.com/Html5/images/launch_file/FFFFFF_right-triangle.png';
				filesPanel += '<div class="weui-grid' + chooseClass + '"><img src="' + file.img_path + '" /><div class="cover' + fontColor + '"><img src="' + pageIcon + '"/><label class="page-number">' + pageNumber + '</label></div></div>';
			}
			$(".page-main > .weui-grids").html(filesPanel);
		}
	};
	win.Page = page;
})(window, jQuery);
