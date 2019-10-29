/**
 *
 * <h1>积分兑换 - JS</h1>
 *
 * @author <a href="http://www.lizhaoweb.cn">李召(John.Lee)</a>
 * @version 1.0.0.0.1
 * @EMAIL 404644381@qq.com
 * @notes Created on 2018年07月24日<br>
 * Revision of last commit:$Revision$<br>
 * Author of last commit:$Author$<br>
 * Date of last commit:$Date$<br>
 */
$(document).ready(function(){
	console.log('Request[parament]', Page.URL.parameters);
	JohnLeeConsole.print('Request[parament]', Page.URL.parameters);
	$('#console').hide();
	$(window).resize();
	$('.row > .right').click(function(e){
		var element = this;
		var goodsType = $(element).parent('.row').attr('goods-type');
		if(goodsType == 30){// 兑换虚拟商品
			Page.Exchange.convertingVirtualGoods(element);
		} else if(goodsType == 31){
			Page.Exchange.goToSetReceivingInfomation(element);
		}else{
			art.dialog({
				title: '错误',
				content: '<span>兑换失败，稍后再试~~~</span>'
			}).lock();
		}
	});
	
	$('.row > .left > .goods-info > .title').first().click(function(e){
		Page.Exchange.SHOW_CONSOLE_CLICK_COUNT++;
		if(Page.Exchange.SHOW_CONSOLE_CLICK_COUNT >= 30){
			$("#console").show();
		}
	});
});

$(window).resize(function(){
	Page.ratioPX = $(window).width() / 750;
	$('body').css({
		'font-size': (24 * Page.ratioPX) + 'px'
	});
	$('.row').css({
		width: (714 * Page.ratioPX) + 'px',
		height: (180 * Page.ratioPX) + 'px',
		padding: (20 * Page.ratioPX) + 'px ' + (18 * Page.ratioPX) + 'px 0 ' + (18 * Page.ratioPX) + 'px'
	});
	$('.row').css({
		width: (714 * Page.ratioPX) + 'px',
		height: (180 * Page.ratioPX) + 'px',
		padding: (20 * Page.ratioPX) + 'px ' + (18 * Page.ratioPX) + 'px 0 ' + (18 * Page.ratioPX) + 'px'
	});
	$('.row > .left').css({
		width: 'calc(100% - ' + (180 * Page.ratioPX) + 'px)',
		height: (180 * Page.ratioPX) + 'px',
		'border-radius': (10 * Page.ratioPX) + 'px 0 0 ' +(10 * Page.ratioPX) + 'px'
	});
	$('.row > .left > .goods-pic').css({
		width: (140 * Page.ratioPX) + 'px',
		height: (140 * Page.ratioPX) + 'px',
		margin: (20 * Page.ratioPX) + 'px',
		'border-radius': (5 * Page.ratioPX) + 'px'
	});
	$('.row > .left > .goods-info').css({
		width: 'calc(100% - ' + (140 * Page.ratioPX) + 'px)',
		height: (140 * Page.ratioPX) + 'px'
	});
	$('.row > .left > .goods-info > .title').css({
		'font-size': (30 * Page.ratioPX) + 'px'
	});
	$('.row > .left > .goods-info > .worth').css({
		'margin-top': (20 * Page.ratioPX) + 'px'
	});
	$('.row > .left > .goods-info > .expirate').css({
		'margin-top': (30 * Page.ratioPX) + 'px',
		'font-size': (20 * Page.ratioPX) + 'px'
	});
	$('.row > .right').css({
		width: (180 * Page.ratioPX) + 'px',
		height: (180 * Page.ratioPX) + 'px',
		'border-radius': '0 ' + (10 * Page.ratioPX) + 'px ' + (10 * Page.ratioPX) + 'px 0'
	});
	$('.row > .right > .info').css({
		height: (110 * Page.ratioPX) + 'px',
		'line-height': (110 * Page.ratioPX) + 'px',
		'font-size': (30 * Page.ratioPX) + 'px'
	});
	$('.row > .right > .consume').css({
		height: (30 * Page.ratioPX) + 'px',
		'font-size': (20 * Page.ratioPX) + 'px'
	});
});

(function($, win){

	// 积分兑换页面处理
	var page = win.Page;
	if(typeof(page) != 'object'){
		page = {
			ratioPX: 1
		};
	}
	if(typeof(page.URL) != 'object'){
		page.URL = {};
	}
	if(typeof(page.URL.parameters) != 'object'){
		page.URL.parameters= $.URL.parametersForGet();
	}
	page.Exchange = {
		SHOW_CONSOLE_CLICK_COUNT: 0,
		api: {
			url: 'https://mobile.littlehotspot.com/h5/activitygoods/integralExchange'
			//url: 'https://dev-mobile.littlehotspot.com/h5/activitygoods/integralExchange'
		},
		convertingVirtualGoods:function(element){// 兑换虚拟商品
			var exchange = this;
			$("html").showLoading();
			var postData = {
				is_js: 1,
				openid: $(element).parent('.row').attr('open-id'),
				goods_id: $(element).parent('.row').attr('goods-id')
			};
			console.log('Ajax[var]', exchange.api.url, postData);
			JohnLeeConsole.print('Ajax[var]', exchange.api.url, postData);
			$.ajax({
				url: exchange.api.url,
				type: "POST",
				cache: false,
				data: postData,
				dataType: "JSONP",
				jsonpCallback: "jsonpReturn",
				complete: function (XMLHttpRequest, textStatus) {
					console.log('Ajax.complete[fn]', XMLHttpRequest, textStatus);
					JohnLeeConsole.print('Ajax.complete[fn]', XMLHttpRequest, textStatus);
					/*
					$('.d-title').css({
						height: (29 * Page.ratioPX) + 'px',
			    		'line-height': (29 * Page.ratioPX) + 'px'
					});
					$('.d-header, .d-button').css({
						'font-size': (12 * Page.ratioPX) + 'px'
					});
					*/
				},
				success: function (data, textStatus) {
					$("html").hideLoading();
					console.log('Ajax.success[fn]', data, textStatus);
					JohnLeeConsole.print('Ajax.success[fn]', data, textStatus);
					if(typeof(data) == 'object'){
						if(data.code == 10000){
							art.dialog({
								title: '兑换成功',
								content: '<span>' + data.msg + '</span>',
								lock: true,
								icon: 'succeed',
								background: '#ededed',
	    						opacity: 0.87,
								okValue: '知道了 ^_^',
								ok: function(){
									return true;
								}
							});
						}else{
							art.dialog({
								title: '兑换失败',
								content: '<span>错误码：' + data.code + '</span><br/><span>错误信息：' + data.msg + '</span>',
								lock: true,
								icon: 'error',
								background: '#ededed',
	    						opacity: 0.87
							});
						}
					}else{
						art.dialog({
							title: '数据异常',
							content: '<span>接收数据错误</span>',
							lock: true,
							icon: 'error',
							background: '#ededed',
							opacity: 0.87
						});
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$("html").hideLoading();
					console.log('Ajax.error[fn]', XMLHttpRequest, textStatus, errorThrown);
					JohnLeeConsole.print('Ajax.error[fn]', XMLHttpRequest, textStatus, errorThrown);
					art.dialog({
						title: '错误',
						content: '<span>服务器正在维护，请稍后再试~~~</span>'
					}).lock();
				}
			});
		},
		goToSetReceivingInfomation:function(element){
			var data = {
				openid: $(element).parent('.row').attr('open-id'),
				goods_id: $(element).parent('.row').attr('goods-id')
			};
			var miniProgramUrl = '/pages/mine/receiving_info?data=' + JSON.stringify(data);
			wx.miniProgram.navigateTo({
				url: miniProgramUrl,
				success: function() {
					console.log('wx.miniProgram.navigateTo', 'success', miniProgramUrl);
					JohnLeeConsole.print('wx.miniProgram.navigateTo', 'success', miniProgramUrl);
				},
				fail: function() {
					console.log('wx.miniProgram.navigateTo', 'fail', miniProgramUrl);
					JohnLeeConsole.print('wx.miniProgram.navigateTo', 'fail', miniProgramUrl);
				},
				complete: function() {
					console.log('wx.miniProgram.navigateTo', 'complete', miniProgramUrl);
					JohnLeeConsole.print('wx.miniProgram.navigateTo', 'complete', miniProgramUrl);
				}
			});
		}
	};
	win.Page = page;

	// 日志处理
	var johnLeeConsole = win.JohnLeeConsole;
	if(typeof(johnLeeConsole) != 'object'){
		johnLeeConsole = {
			print: function(){
				var argumentArray = $(arguments);
				var argumentSize = argumentArray.size();
				if(argumentSize < 1){
					return;
				}
				var consolePrinter = $("#console").append('[').append(new Date().format("yyyy-MM-dd hh:mm:ss.S")).append(']\t');
				argumentArray.each(function(i, e){
					if(typeof(e) == 'object'){
						if(e instanceof Date){
							consolePrinter.append(e.format("yyyy-MM-dd hh:mm:ss.S"));
						}else{
							consolePrinter.append(JSON.stringify(e));
						}
					//}else if(typeof(e) == 'object'){
					}else{
						consolePrinter.append(e);
					}
					if(i < argumentSize - 1){
						consolePrinter.append('\t');
					}
				});
				consolePrinter.append('\n');
			}
		};
	}
	win.JohnLeeConsole = johnLeeConsole;
})(jQuery, window);

