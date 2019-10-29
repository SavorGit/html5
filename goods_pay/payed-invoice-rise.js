/**
 * 支付完成&发票抬头
 *
 */
$(document).ready(function(docmentEvent){
	var clickTimesForDebug = 30;
	var clickDebug = 0;
	$('.title').click(function(e){
		clickDebug++;
		if(clickDebug > clickTimesForDebug){
			$('#console').show();
		}
	});
	var loadingSetting = {
		'indicatorID' : 'payed-invoice-rise',
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
	$('#chooseFromWechart').click(function(event){
		try{
			var ua = navigator.userAgent.toLowerCase();
	        if(ua.match(/MicroMessenger/i) != "micromessenger") {
				art.dialog({
					title: '提示',
					content: '<span>请在微信下使用此功能。</span>',
					fixed: true,
					okValue: '关闭',
					ok: function () {
				        return true;
				    }
				}).lock();
				return;
	        }
			wx.ready(function(){
	        	$('html').showLoading(loadingSetting);
				wx.invoke('chooseInvoiceTitle',{
					"scene":"1"
				},function(res) {
					JohnLeeConsole.print('#chooseFromWechart', 'click', 'try', 'wx.ready', 'wx.invoke', 'chooseInvoiceTitle', res);
					$('html').hideLoading(loadingSetting);
					if(typeof(res) == 'object' && res != null && res.err_msg == "chooseInvoiceTitle:ok"){
						var invoiceTitleInfo = JSON.parse(res.choose_invoice_title_info);
						if(typeof(invoiceTitleInfo) == 'object' && invoiceTitleInfo != null){
							$('[name="companyName"]').val(invoiceTitleInfo.title);
							$('[name="companyDutyParagraph"]').val(invoiceTitleInfo.taxNumber);
						}else{
							alert(res.choose_invoice_title_info);
						}
					}else{
						alert(JSON.stringify(res));
					}
				});
			});
		}catch(err){
			JohnLeeConsole.print('#chooseFromWechart', 'click', 'catch', err);
			console.error(err);
		}
	});
	$(".input input,.input textarea").keyup(function(event){
		changeColorCheck(this);
	});
	$(".input input,.input textarea").blur(function(event){
		this.scrollIntoView(false)
	});
	$('[name="carrier"]:radio').click(function(event){
		var value = $(this).val();
		if(typeof(value) != 'string'){
			return;
		}
		var addressParentObject = $('.mailing-address');
		if(2 == value){// 电子发票。electron
			$('<input type="text" name="address" placeholder="电子邮箱" minlength="5" maxlength="60" />').blur(function(event){
				this.scrollIntoView(false)
			}).appendTo(addressParentObject.css({
				height: '30px',
    			'line-height': '30px'
			}).empty());
		}else if(1 == value){// 纸质发票。paper
			$('<textarea name="address" placeholder="邮寄地址" minlength="1" maxlength="100"></textarea>').blur(function(event){
				this.scrollIntoView(false)
			}).appendTo(addressParentObject.css({
				height: '60px',
    			'line-height': '60px'
			}).empty());
		}
	});
	$('#invoicingLater').click(function(event){
		var invoicingLaterPage = art.dialog({
			title: '保存开票地址',
			content: '<div style="font-size:14px;text-align:center;"><div style="height:30px;line-height:30px;text-align:center;"><input type="text" id="saveInvoiceRisePhone" placeholder="手机号" minlength="11" maxlength="11" element-type="mobile-phone" style="width:80%;height:18px;font-size:14px;color:#333333;border:1px solid #BBBBBB;background-color:#FFFFFF;" onkeyup="javascript:changeColorCheck(this);" /></div><div style="margin-top:20px;font-size:12px;color:#333333;">将开票地址发送至您的手机中，以便后续进行开票</div></div>',
			fixed: true,
			okValue: '确定',
			width: '80%',
			ok: function () {
				var saveInvoiceRisePhoneValue = checkElement($('#saveInvoiceRisePhone'), $('#saveInvoiceRisePhone').attr('placeholder'));
				if(saveInvoiceRisePhoneValue == false){
					return false;
				}
				var invoiceOrderNo = $('.invoice-order-no').children('value').text();
				$('html').showLoading(loadingSetting);
				var apiURL = 'https://dev-mobile.littlehotspot.com/h5/saleorder/sendaddr';
				var requestData = {
					'oid': invoiceOrderNo,
					'phone': saveInvoiceRisePhoneValue
				};
				JohnLeeConsole.print('#invoicingLater', 'click', 'art.dialog', 'ok', 'ajax', apiURL, requestData);
				$.ajax({
					url: apiURL,
					data: requestData,
					async: true,
					cache: false,
					contentType: 'application/x-www-form-urlencoded',
					dataType: 'jsonp',
					jsonp: 'callback',
					success: function (data, textStatus){
						JohnLeeConsole.print('#invoicingLater', 'click', 'art.dialog', 'ok', 'ajax', 'success', data, textStatus);
						$('html').hideLoading(loadingSetting);
		        		if(data.code == 10000){
							art.dialog({
								title: '提示',
								content: '<span>短信发送成功。请查收短信。</span>',
								fixed: true,
								okValue: '关闭',
								ok: function () {
									invoicingLaterPage.close();
							        return true;
							    }
							}).lock();
		        		}else{
							art.dialog({
								title: '提示',
								content: '<span><div>短信发送失败。</div><div>原因：' + data.msg + '</div></span>',
								fixed: true,
								okValue: '关闭',
								ok: function () {
							        return true;
							    }
							}).lock();
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						JohnLeeConsole.print('#invoicingLater', 'click', 'art.dialog', 'ok', 'ajax', 'error', XMLHttpRequest, textStatus, errorThrown);
						$('html').hideLoading(loadingSetting);
						art.dialog({
							title: '错误',
							content: '<span>短信发送失败。</span>',
							fixed: true,
							okValue: '关闭',
							ok: function () {
						        return true;
						    }
						}).lock();
					}
				});
				return false;
		    }
		}).lock();
	});
	$('#invoicingNow').click(function(event){
		var companyName = checkElement($('[name="companyName"]'), $('[name="companyName"]').attr('placeholder'));
		if(companyName == false){
			return;
		}
		var companyDutyParagraph = checkElement($('[name="companyDutyParagraph"]'), $('[name="companyDutyParagraph"]').attr('placeholder'));
		if(companyDutyParagraph == false){
			return;
		}
		var invoiceOrderNo = $('.invoice-order-no').children('value').text();
		var invoiceDetail = $('.invoice-detail').children('value').text();
		var invoiceAmount = $('.invoice-amount').children('value').text();
		var invoiceCarrier = checkElement($('[name="carrier"]:checked'));
		if(invoiceCarrier == false){
			return;
		}
		var invoiceContacts = checkElement($('[name="invoiceContacts"]'), $('[name="invoiceContacts"]').attr('placeholder'));
		if(invoiceContacts == false){
			return;
		}
		var invoicePhone = checkElement($('[name="invoicePhone"]'), $('[name="invoicePhone"]').attr('placeholder'));
		if(invoicePhone == false){
			return;
		}
		var address = checkElement($('[name="address"]'), $('[name="address"]').attr('placeholder'));
		if(address == false){
			return;
		}
		$('html').showLoading(loadingSetting);
		var apiURL = 'https://dev-mobile.littlehotspot.com/h5/saleorder/addinvoice';
		var requestData = {
			'company': companyName,
			'credit_code': companyDutyParagraph,
			'oid': invoiceOrderNo,
			'detail': invoiceDetail,
			'amount': invoiceAmount,
			'invoice_type': invoiceCarrier,
			'contact': invoiceContacts,
			'phone': invoicePhone,
			'address': address
		};
		JohnLeeConsole.print('#invoicingNow', 'click', 'ajax', apiURL, requestData);
		$.ajax({
			url: apiURL,
			data: requestData,
			async: true,
			cache: false,
			contentType: 'application/x-www-form-urlencoded',
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function (data, textStatus){
				JohnLeeConsole.print('#invoicingNow', 'click', 'ajax', 'success', data, textStatus);
				$('html').hideLoading(loadingSetting);
        		if(data.code == 10000){
					$('.msg').css({
						'font-weight':400,
						'font-size':'20px'
					}).text(data.msg);
					$('.invoice-rise').css('background-color', 'unset').html('<span style="font-size:14px;">发票将在7个工作日内为您开具，请注意查收</span>');
					$('html,body').animate({
						scrollTop: 0
					}, 800);
        		}else{
					art.dialog({
						title: '提示',
						content: '<span style="font-size:14px;"><div>发票开具失败。</div><div>原因：' + data.msg + '</div></span>',
						fixed: true,
						okValue: '关闭',
						ok: function () {
					        return true;
					    }
					}).lock();
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				JohnLeeConsole.print('#invoicingNow', 'click', 'ajax', 'error', XMLHttpRequest, textStatus, errorThrown);
				$('html').hideLoading(loadingSetting);
				art.dialog({
					title: '错误',
					content: '<span>发票开具失败。</span>',
					fixed: true,
					okValue: '关闭',
					ok: function () {
				        return true;
				    }
				}).lock();
			}
		});
	});
	function checkElement(element, propertyLabel){
		var value = $(element).val();
		var minLen = $(element).attr('minlength');
		var maxLen = $(element).attr('maxlength');
		var eType = $(element).attr('element-type');
		if(typeof(minLen) != "number"){
			try{
				minLen = parseInt(minLen);
			}catch(err){
				minLen = 0;
			}
		}
		if(typeof(maxLen) != "number"){
			try{
				maxLen = parseInt(maxLen);
			}catch(err){
				maxLen = 0;
			}
		}
		if(minLen > value.length){
			$(element).css('border-color', '#FF0000');
			art.dialog({
				title: '提示',
				content: '<span>\'' + propertyLabel + '\'最少输入' + minLen + '个字符。</span>',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					$(element).focus();
			        return true;
			    }
			}).lock();
			return false;
		}else if(maxLen < value.length){
			$(element).css('border-color', '#FF0000');
			art.dialog({
				title: '提示',
				content: '<span>\'' + propertyLabel + '\'最多输入' + maxLen + '个字符。</span>',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					$(element).focus();
			        return true;
			    }
			}).lock();
			return false;
//		}else{
//			$(element).css('border-color', '#BBBBBB');
//			return value;
		}
		switch(eType){
			case 'mobile-phone':
				if(!/^1\d{10}$/.test(value)){
					$(element).css('border-color', '#FF0000');
					art.dialog({
						title: '提示',
						content: '<span>\'' + propertyLabel + '\'输入错误。<br/>请输入正确的手机号。</span>',
						fixed: true,
						okValue: '关闭',
						ok: function () {
							$(element).focus();
					        return true;
					    }
					}).lock();
					return false;
				}else{
					$(element).css('border-color', '#BBBBBB');
					return value;
				}
				break;
			default:
				$(element).css('border-color', '#BBBBBB');
				return value;
				break;
		}
	}
});

function changeColorCheck(ele){
	var value = $(ele).val();
	var minlength = $(ele).attr("minlength");
	var maxlength = $(ele).attr("maxlength");
	var propertyLabel = $(ele).attr('placeholder');
	var eType = $(ele).attr('element-type');
	if(typeof(minlength) != "number"){
		try{
			minlength = parseInt(minlength);
		}catch(err){
			minlength = 0;
		}
	}
	if(typeof(maxlength) != "number"){
		try{
			maxlength = parseInt(maxlength);
		}catch(err){
			maxlength = 0;
		}
	}
	if(typeof(value) != "string"){
		value = "";
	}
	if(minlength <= value.length && maxlength >= value.length){
		switch(eType){
			case 'mobile-phone':
				if(/^1\d{10}$/.test(value)){
					$(ele).css('border-color', '#BBBBBB');
				}
				break;
			default:
				$(ele).css('border-color', '#BBBBBB');
				break;
		}
	}
}