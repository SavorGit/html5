/**
 * 客户扫描二维码
 *
 */
$(document).ready(function(docmentEvent){
	var loadingSetting = {
		'indicatorID' : 'custemer-confirm',
		'addClass' : 'little-hot-spot-loading-indicator',
		'overlayCSS' : {},
		'beforeShow' : function(callbackOptions){
			console.log('beforeShow', callbackOptions, '|' + $(callbackOptions.indicator).html() + '|');
			var dotColor = '#FFFFFF';
			$('<style>@keyframes blink{0%{opacity:1;}100%{opacity:0;}}@-webkit-keyframes blink{0%{opacity:1;}100%{opacity:0;}}@-moz-keyframes blink{0%{opacity:1;}100%{opacity:0;}}@-ms-keyframes blink{0%{opacity:1;} 100%{opacity:0;}}@-o-keyframes blink{0%{opacity:1;}100%{opacity:0;}}.blink{animation:blink 1s linear infinite;-webkit-animation:blink 1s linear infinite;-moz-animation:blink 1s linear infinite;-ms-animation:blink 1s linear infinite;-o-animation:blink 1s linear infinite;}.sk-fading-circle{max-width:100px;max-height:100px;min-width:8px;min-height:8px;width:4em;height:4em;position:relative;margin:auto;}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0;}.sk-fading-circle .sk-circle:before{content:\'\';display:block;margin:0 auto;max-width:12px;max-height:12px;min-width:1px;min-height:1px;width:15%;height:15%;background-color:' + dotColor + ';border-radius:100%;-webkit-animation:sk-fading-circle-delay 1.2s infinite ease-in-out both;animation:sk-fading-circle-delay 1.2s infinite ease-in-out both;}.sk-fading-circle .sk-circle-text {width:100%;height:100%;text-align:center;font-size:8px;font-weight:900;display:flex;flex-direction:column;align-item:center;justify-content:center;}.sk-fading-circle .sk-circle-2{-webkit-transform:rotate(30deg);transform:rotate(30deg);}.sk-fading-circle .sk-circle-2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s;}.sk-fading-circle .sk-circle-3{-webkit-transform:rotate(60deg);transform:rotate(60deg);}.sk-fading-circle .sk-circle-3:before{-webkit-animation-delay:-1s;animation-delay:-1s;}.sk-fading-circle .sk-circle-4{-webkit-transform:rotate(90deg);transform:rotate(90deg);}.sk-fading-circle .sk-circle-4:before{-webkit-animation-delay:-0.9s;animation-delay:-0.9s;}.sk-fading-circle .sk-circle-5{-webkit-transform:rotate(120deg);transform:rotate(120deg);}.sk-fading-circle .sk-circle-5:before{-webkit-animation-delay:-0.8s;animation-delay:-0.8s;}.sk-fading-circle .sk-circle-6{-webkit-transform:rotate(150deg);transform:rotate(150deg);}.sk-fading-circle .sk-circle-6:before{-webkit-animation-delay:-0.7s;animation-delay:-0.7s;}.sk-fading-circle .sk-circle-7{-webkit-transform:rotate(180deg);transform:rotate(180deg);}.sk-fading-circle .sk-circle-7:before{-webkit-animation-delay:-0.6s;animation-delay:-0.6s;}.sk-fading-circle .sk-circle-8{-webkit-transform:rotate(210deg);transform:rotate(210deg);}.sk-fading-circle .sk-circle-8:before{-webkit-animation-delay:-0.5s;animation-delay:-0.5s;}.sk-fading-circle .sk-circle-9{-webkit-transform:rotate(240deg);transform:rotate(240deg);}.sk-fading-circle .sk-circle-9:before{-webkit-animation-delay:-0.4s;animation-delay:-0.4s;}.sk-fading-circle .sk-circle-10{-webkit-transform:rotate(270deg);transform:rotate(270deg);}.sk-fading-circle .sk-circle-10:before{-webkit-animation-delay:-0.3s;animation-delay:-0.3s;}.sk-fading-circle .sk-circle-11{-webkit-transform:rotate(300deg);transform:rotate(300deg);}.sk-fading-circle .sk-circle-11:before{-webkit-animation-delay:-0.2s;animation-delay:-0.2s;}.sk-fading-circle .sk-circle-12{-webkit-transform:rotate(330deg);transform:rotate(330deg);}.sk-fading-circle .sk-circle-12:before{-webkit-animation-delay:-0.1s;animation-delay:-0.1s;}@-webkit-keyframes sk-fading-circle-delay{0%,39%,100%{opacity:0;}40%{opacity:1;}}@keyframes sk-fading-circle-delay{0%,39%,100%{opacity:0;}40%{opacity:1;}}</style>').appendTo('head');
			var loadingIconHtml = '<div class="sk-fading-circle"><div class="sk-circle-text blink"><span>LOADING</span></div><div class="sk-circle sk-circle-1"></div><div class="sk-circle sk-circle-2"></div><div class="sk-circle sk-circle-3"></div><div class="sk-circle sk-circle-4"></div><div class="sk-circle sk-circle-5"></div><div class="sk-circle sk-circle-6"></div><div class="sk-circle sk-circle-7"></div><div class="sk-circle sk-circle-8"></div><div class="sk-circle sk-circle-9"></div><div class="sk-circle sk-circle-10"></div><div class="sk-circle sk-circle-11"></div><div class="sk-circle sk-circle-12"></div></div>';
			var loadingIcon = $(loadingIconHtml).css({
				'width': '100%',
				'height': '100%'
			});
			$(callbackOptions.indicator).css({
				'display': 'flex',
				'flex-direction': 'column',
				'align-item': 'center',
				'background': 'unset'
			}).html(loadingIcon);
		},
		'afterShow' : function(callbackOptions){
			/*
			$(window).resize(function(event){
				loadingSetting.afterShow = '';
				$(callbackOptions.element).hideLoading(loadingSetting).showLoading(loadingSetting);
				console.log('afterShow', callbackOptions);
			});
			*/
		},
		'hPos' : 'center',
		'vPos' : 'center',
		'indicatorZIndex' : 5001,
		'overlayZIndex' : 5000,
		'parent' : '',
		'marginTop' : 0,
		'marginLeft' : 0,
		'overlayWidth' : null,
		'overlayHeight' : null
	};
	var queryParameters = $.URL.parametersForGet();
	if(typeof(queryParameters) == 'object' && typeof(queryParameters.payStatus) == 'string' && queryParameters.payStatus == 'fail'){
		var message = "操作失败";
		if(typeof(queryParameters.payMsg) == "string"){
			message = queryParameters.payMsg;
		}
		art.dialog({
			title: '提示',
			content: '<span>' + message + '</span>',
			fixed: true,
			okValue: '关闭',
			ok: function () {
		        return true;
		    }
		}).lock();
	}
	/*
	if(typeof(queryParameters) instanceof Array){
		console.log('Array');
	}
	*/
	$("#nowPayButton").click(function(e){
		$('html').showLoading(loadingSetting);
	});
});
