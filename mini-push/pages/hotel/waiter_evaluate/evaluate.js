/**
 *
 */
$(document).ready(function(docEvent){
	$('title').html('亲，您对服务满意吗？');
	$("input,textarea").blur(function () {
		$("html,body").animate({scrollTop: document.documentElement.clientHeight},500);
	});
	//$("html").showLoading();
	//$("#console").show();
	var apiURLDomain = pageConfig.apiURLDomain.prod;
	if('devp' == runEnv){
		apiURLDomain = pageConfig.apiURLDomain.devp;
	}
	$(".waiter-evaluate-score-panel>.wapper>.lable").click(function(e){
		logger.SHOW_CONSOLE_CLICK_COUNT++;
		if(logger.SHOW_CONSOLE_CLICK_COUNT >= 30){
			$("#console").show();
		}
	});
	JohnLeeConsole.print("服务员信息：" + JSON.stringify(waiterInfo));
	JohnLeeConsole.print("默认分值：" + JSON.stringify(defaultScore));
	JohnLeeConsole.print("标签列表：" + JSON.stringify(tagArray));
	JohnLeeConsole.print("默认评论：" + JSON.stringify(defaultComment));
	if(typeof(waiterInfo) == 'object'){
		var waiterPanelObject = $('.waiter-evaluate-info-panel');
		if(typeof(waiterInfo.name) == 'string'){
			waiterPanelObject.find('.wapper').attr('waiter-id', waiterInfo.id);
		}
		if(typeof(waiterInfo.name) == 'string' && waiterInfo.name.trim() != ''){
			waiterPanelObject.find('.info>.name').text(waiterInfo.name);
		}else{
			waiterPanelObject.find('.info>.name').html('<div style="color:#BEBEBE;">无</span>');
		}
		if(typeof(waiterInfo.title) == 'string' && waiterInfo.name.trim() != ''){
			waiterPanelObject.find('.info>.title').addClass('theme-font7').text(waiterInfo.title);
		}else{
			waiterPanelObject.find('.info>.title').html('<div style="color:#BEBEBE;">无</span>');
		}
		if(typeof(waiterInfo.photo) == 'string' && waiterInfo.name.trim() != ''){
			waiterPanelObject.find('img.photo').attr('src', waiterInfo.photo);
		}else{
			waiterPanelObject.find('img.photo').attr('src', 'https://oss.littlehotspot.com/Html5/images/common/default_user_head_1.jpg');
		}
	}
	var _defaultScore = 0;
	if (typeof(defaultScore) != 'number'){
		_defaultScore = defaultScore;
	}else{
		try{
			_defaultScore = parseFloat(defaultScore);
		}catch(error){
			_defaultScore = 0;
		}
	}
	var starGroupObject = $('.waiter-evaluate-score-panel .star-group').empty();
	if(typeof(pageConfig.starCount) == 'number' && pageConfig.starCount > 0){
		for(index = 0; index < pageConfig.starCount; index++){
			var starCount = index + 1;
			var starHalfCount = starCount - 0.5;
			/*
			var starClass = 'fa-star-o';
			var startColor = pageConfig.startColor._default;
			if(_defaultScore >= starHalfCount && _defaultScore < starCount){
				starClass = 'fa-star-half-o';
				startColor = pageConfig.startColor.selected;
			}else if(_defaultScore >= starCount){
				starClass = 'fa-star';
				startColor = pageConfig.startColor.selected;
			}
			
			$('<div class="fa ' + starClass + '" aria-hidden="true"></div>').css({color:startColor}).appendTo(starGroupObject);
			*/
			var starClass = 'fa-star-o theme-font3';
			if(_defaultScore >= starHalfCount && _defaultScore < starCount){
				starClass = 'fa-star-half-o theme-font5';
			}else if(_defaultScore >= starCount){
				starClass = 'fa-star theme-font5';
			}
			
			$('<div class="fa ' + starClass + ' " aria-hidden="true"></div>').appendTo(starGroupObject);
		}
	}
	if(typeof(tagArray) == 'object' && tagArray instanceof Array && tagArray.length > 0){
		var tagsObject = $('.waiter-evaluate-comment-panel>.tags').empty();
		$(tagArray).each(function(index,item){
			var selectedClass = ' theme-font5';
			if(typeof(item.selected) == 'boolean' && item.selected == true){
				selectedClass = ' selected theme-button-red';
				$('textarea').val(item.value);
			}
			tagsObject.append('<div class="tag' + selectedClass + '" data-id="' + item.id + '">' + item.value + '</div>');
		});
	}
	if(typeof(defaultComment) != 'string'){
		defaultComment = '';
	}
	$('.fa').click(function(e){
		/*
		$(this).removeClass('fa-star-o').removeClass('fa-star-half-o').addClass('fa-star').css({color:pageConfig.startColor.selected});
		$(this).prevAll('.fa').removeClass('fa-star-o').removeClass('fa-star-half-o').addClass('fa-star').css({color:pageConfig.startColor.selected});
		$(this).nextAll('.fa').removeClass('fa-star').removeClass('fa-star-half-o').addClass('fa-star-o').css({color:pageConfig.startColor._default});
		*/
		$(this).removeClass('fa-star-o').removeClass('fa-star-half-o').removeClass('theme-font3').addClass('fa-star').addClass('theme-font5');
		$(this).prevAll('.fa').removeClass('fa-star-o').removeClass('fa-star-half-o').removeClass('theme-font3').addClass('fa-star').addClass('theme-font5');
		$(this).nextAll('.fa').removeClass('fa-star').removeClass('fa-star-half-o').removeClass('theme-font5').addClass('fa-star-o').addClass('theme-font3');
	});
	$('.tag').click(function(e){
		$('.tag').removeClass('selected').removeClass('theme-button-red').addClass('theme-font5');
		$(this).removeClass('theme-font5').addClass('selected').addClass('theme-button-red');
		if(typeof($('textarea').val()) != 'string' || $('textarea').val().trim() ==''){
			$('textarea').val($(this).text());
		}else{
			$('textarea').val($('textarea').val() + ',' + $(this).text());
		}
	});
	$('.btn-submit').removeClass('theme-button').addClass('theme-rad-panel').click(function(e){
		$("html").showLoading();
		var waiterId = $('.waiter-evaluate-info-panel .wapper').attr('waiter-id');
		if(typeof(waiterId) != 'string' || waiterId.trim() == ''){
			art.dialog({
				title: '提示',
				content: '服务员标识不存在',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					return true;
				}
			}).lock();
			return;
		}
		var score = $('.fa-star').size();
		if(score < 1){
			art.dialog({
				title: '提示',
				content: '请为服务员打分',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					return true;
				}
			}).lock();
			return;
		}
		var tagIds = '';
		$('.tag.selected').each(function(index, item){
			if (index > 0){
				tagIds += ',';
			}
			tagIds += $(item).attr('data-id');
		});
		var comment = $('textarea').val();
		var apiURL = apiURLDomain + '/h5/comment/addcomment';
		var requestHeaders = {};
		var requestData = {
			content:comment,
			ep:waiterId,
			score:score,
			tags:tagIds
		};
		var timeout = 6000;
		JohnLeeConsole.print(">>>>>", apiURL, "POST", 'timeout=' + timeout + 'ms');
		JohnLeeConsole.print(">>>>>", JSON.stringify(requestHeaders), JSON.stringify(requestData));
		$.ajax({
			url: apiURLDomain + '/h5/comment/addcomment',
			timeout: timeout,
			type: "POST",
			cache: false,
			headers: requestHeaders,
			data: requestData,
			dataType: "JSONP",
			jsonpCallback: "h5turbine",
			/*
			beforeSend: function (XMLHttpRequest) {
		    this; // 调用本次AJAX请求时传递的options参数
				console.log('beforeSend', XMLHttpRequest);
			},
			complete: function (XMLHttpRequest, textStatus) {
				//$("html").hideLoading();
				console.log(XMLHttpRequest, textStatus);
			},
			*/
			success: function (data, textStatus) {
				$("html").hideLoading();
				JohnLeeConsole.print("<<<<<", apiURL, JSON.stringify(data));
				if(typeof(data) != 'object'){
					art.dialog({
						title: '错误',
						content: '服务器返回数据格式错误',
						fixed: true,
						okValue: '关闭',
						ok: function () {
							return true;
						}
					}).lock();
					return;
				}
				if(data.code != 10000){
					art.dialog({
						title: '错误',
						content: '代码：' + data.code + '<br/>信息：' + data.msg,
						fixed: true,
						okValue: '关闭',
						ok: function () {
							return true;
						}
					}).lock();
					return;
				}
				art.dialog({
					title: '提示',
					content: data.msg,
					fixed: true,
					lock: true,
					okValue: '关闭',
					beforeunload: function () {
						try{
							JohnLeeConsole.print(">>>>> Wechart[/pages/index/index]");
							wx.miniProgram.getEnv(function(res) {
								if(res.miniprogram) {
									/*
									wx.miniProgram.navigateTo({
										url: '/pages/hotel/waiter_evaluate'
									});
									*/
									wx.miniProgram.switchTab({
										url: '/pages/index/index'
									});
								}
							});
						}catch(error){
							JohnLeeConsole.print(">>XXXX>> Wechart-ERROR[/pages/index/index]",error);
						}
						return true;
					}
				});
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				$("html").hideLoading();
				JohnLeeConsole.print("请求出错：", apiURL, XMLHttpRequest, textStatus, errorThrown);
				art.dialog({
					title: '错误',
					content: '网络异常，请稍候再试',
					fixed: true,
					okValue: '关闭',
					ok: function () {
						return true;
					}
				}).lock();
			}
		});
	});
	/*
	$(document).ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
		if(XMLHttpRequest.status == 'undefined'){
			return;
		}
		switch(XMLHttpRequest.status){
			case 403:
				// 未授权异常
				art.dialog({
					title: '错误',
					content: "系统拒绝：您没有访问权限。",
					fixed: true,
					okValue: '关闭',
					ok: function () {
						return true;
					}
				}).lock();
				break;
			case 404:
				art.dialog({
					title: '错误',
					content: "您访问的资源不存在。",
					fixed: true,
					okValue: '关闭',
					ok: function () {
						return true;
					}
				}).lock();
				break;
		}
	});
	*/
	$('.waiter-evaluate-comment-panel>textarea').css({
		resize:'none'
	}).text(defaultComment);
	//$("html").hideLoading();
});
(function(win, $){
	var pageConfig = {
		apiURLDomain: {
			devp: 'https://dev-mobile.littlehotspot.com',
			prod: 'https://mobile.littlehotspot.com'
		},
		starCount : 5,
		startColor: {
			_default : '#333333',
			selected: '#eb6877'
		}
	}
	win.pageConfig = pageConfig;
	var logger = win.logger;
	if(typeof(logger) != 'object'){
		logger ={};
	}
	logger.SHOW_CONSOLE_CLICK_COUNT = 0;
	/*
	logger.print = function(){
		var splitString = '\t';
		var newLine = '\n';
		var dateTime = new Date().format('[yyyy-MM-dd hh:mm:ss.S]');
		var consoleObject = $("#console").append(dateTime);
		for(var index = 0; index < arguments.length; index++){
			var argument = arguments[index];
			consoleObject.append(splitString);
			if(typeof(argument) == 'object' && argument != null){
				consoleObject.append(JSON.stringify(argument));
			}else{
				consoleObject.append(argument);
			}
		};
		consoleObject.append(newLine);
	}
	*/
	win.logger = logger;
})(window, jQuery);
