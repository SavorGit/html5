define('wechatcore',['jquery','ydui','layer','laytpl','slideBox','emojicore'],function($,YDUI,layer,laytpl,slideBox){
	var wechatcore = {
		debug:false,
		newjointimer:null,
		tipzIndex:2000,
		device:function(type){
			if(type==1){
				return YDUI.device.isIOS;
			}else if(type==2){
				return YDUI.device.isMobile;
			}else if(type==3){
				return YDUI.device.isWeixin;
			}
		},
		ios12over:function(){//ios12以上13以下
			var self = this;
			var ioscenter = '12.2';
			var ios = false;
			var str= navigator.userAgent.toLowerCase(); 
			var version =str.match(/cpu iphone os (.*?) like mac os/);
			if(version){
				ios = version[1].replace(/_/g,".");
				ios = self.compareVesion(ioscenter,ios);
			}
			return ios;
		},
		ios13over:function(){
			var self = this;
			var ioscenter = '12.99';
			var ios = false;
			var str= navigator.userAgent.toLowerCase(); 
			var version =str.match(/cpu iphone os (.*?) like mac os/);
			if(version){
				ios = version[1].replace(/_/g,".");
				ios = self.compareVesion(ioscenter,ios);
			}
			return ios;
		},
		ios14over:function(){
			var self = this;
			var ioscenter = '13.99';
			var ios = false;
			var str= navigator.userAgent.toLowerCase(); 
			var version =str.match(/cpu iphone os (.*?) like mac os/);
			if(version){
				ios = version[1].replace(/_/g,".");
				ios = self.compareVesion(ioscenter,ios);
			}
			return ios;
		},
		ios134over:function(){
			var self = this;
			var ioscenter = '13.4';
			var ios = false;
			var str= navigator.userAgent.toLowerCase(); 
			var version =str.match(/cpu iphone os (.*?) like mac os/);
			if(version){
				ios = version[1].replace(/_/g,".");
				ios = self.compareVesion(ioscenter,ios);
			}
			return ios;
		},
		compareVesion:function(a,b) {
		  var self = this;
		  var a= self.toNum(a); 
		  var b= self.toNum(b);  
		  if(a==b){
			return true;
		  }else if( a > b){
			return false;
		  }else{
			return true;
		  }            
		},
		toNum:function(a){
		  var a = a.toString();
		  var c = a.split('.');
		  var num_place=["","0","00","000","0000"],r=num_place.reverse();
		  for (var i=0;i<c.length;i++){ 
			 var len=c[i].length;       
			 c[i]=r[len]+c[i];  
		  } 
		  var res= c.join(''); 
		  return res; 
		},
		openKeyboard(dom,boardtitle,url){
			var self = this;
			var $keyboard = $(dom);
			// 初始化参数
			$keyboard.keyBoard({
				disorder: false,
				toptitle:boardtitle||'请输入安全密码',
				title:'安全验证',
				maskclose:false,
				showcancel:false,
			});
			$keyboard.keyBoard('open');
			// 六位密码输入完毕后执行
			$keyboard.on('done.ydui.keyboard', function (ret) {
				wechatcore.ajaxSubmit('wechat.login.checklogin',{password:ret.password},'正在验证密码...').then(function(data){
					 if(data.errno==0){
						 self.showtopmsg('密码验证成功',1e3,function(){
							self.reloadpage(url);
						});
					 }else{
						$keyboard.keyBoard('error', '对不起，您的安全密码不正确，请重新输入');
					 }
				}, function(){
					  wechatcore.msg('网络异常验证失败，请稍后重试');
				});
				// $keyboard.keyBoard('close');
			});
		},
		setcookie:function(name, val, expires){
			if(!expires) expires= 86400;
			YDUI.util.cookie.set(name, val, expires);
		},
		getcookie:function(name){
			return YDUI.util.cookie.get(name);
		},
		setTemplocalStorage:function (key,value){
			var curTime = new Date().getTime();
			localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
		},
		getTemplocalStorage:function(key,exp){
			var data = localStorage.getItem(key);
			if(data==null){
				return null;
			}
			var dataObj = JSON.parse(data);
			if ((new Date().getTime() - dataObj.time)/1e3 > exp) {
				localStorage.removeItem(key);
				return null;
			}else{
				var datatoJson = dataObj.data;
				return datatoJson;
			}
		},
		getlocalStorage:function(key){
			return YDUI.util.localStorage.get(key);
		},
		setlocalStorage:function(key,value){
			return YDUI.util.localStorage.set(key,value);
		},
		dellocalStorage:function(key){
			return YDUI.util.localStorage.remove(key);
		},
		clearlocalStorage:function(){
			return YDUI.util.localStorage.clear();
		},
		getImgBase64:function(obj, callback){
			YDUI.util.getImgBase64(key,callback);
		},
		getQueryString:function(key){
			return YDUI.util.getQueryString(key);
		},
		lockpage:function(){
			YDUI.util.pageScroll.lock();
		},
		unlockpage:function(){
			YDUI.util.pageScroll.unlock();
		},
		coundown:function(time,lg,draw,jgtime){
				var b = setInterval(function() {
					time = time -1;
					if(time > 0){//>0
						if (lg) {
							lg(time);
						}
					}else{
						clearInterval(b);
						if (draw) {
							draw()
						}
					}
				}, jgtime||1e3);
		},
		showtopmsg:function(tips,showTime,fuc){
			var tipsTpl = $('<div  class="zam-app-tipsmsg zam-app-flex zam-app-justifyCenter">'+tips+'</div>');
			tipsTpl.css({"z-index":(this.tipzIndex)});
			this.tipzIndex++;
			tipsTpl.appendTo("body");
			tipsTpl.addClass('zam-app-tipsmsghide');
			setTimeout(function(){
				tipsTpl.removeClass('zam-app-tipsmsghide').addClass('zam-app-tipsmsgshow');
				setTimeout(function(){
					tipsTpl.removeClass('zam-app-tipsmsgshow').addClass('zam-app-tipsmsghide');
					setTimeout(function(){
						tipsTpl.remove();
						if(fuc){
							fuc();
						}
					},500)
				},showTime||2e3)
			},30);
		},
		msg:function(txt,time){
			layer.open({
				content:txt
				,skin: 'msg'
				,time:time||2
			});
		},
		ask:function(title,txt,btns,func,func2,className){
			var params = {
				shadeClose: false,
				yes: function(index){
				  func&&func(index);
				},
				no: function(index){
				  func2&&func2(index);
				}
			};
			params.title = title?title:false;
			params.content = txt?txt:false;
			params.className = className?className:'';
			params.btn = btns?btns:['确定','取消'];
			layer.open(params);
		},
		bask:function(txt,btns,func){
			var params = {
				shadeClose: false
				,skin: 'footer'
				,yes: function(index){
				   func&&func(index);
				}
			};
			params.content = txt?txt:false;
			params.btn = btns?btns:['确定','取消'];
			layer.open(params);
		},
		bpopup:function(dom,data,stringcss,fn){
			 var self = this,obj = {
				type: 1
				,content:self.tpl(dom,data)
				,anim: 'up'
				,shade: 'background-color: rgba(0,0,0,.3)'
				,style:stringcss||'position:fixed; bottom:0; left:0; width: 100%;border:none;'
				,success:function(e){
					fn&&fn(e);
				}
		    };
			var layindex = layer.open(obj);
		   return layindex;
		},
		bpopupbyhtml:function(html,stringcss,skin){
			var self = this;
			var openobj = {
				type: 1
				,content:html
				,anim: 'scale'
				,style:stringcss||'position:fixed; bottom:0; left:0; width: 100%;border:none;'
		   };
		   if(skin){
				openobj.skin = skin;
		   }
		   var layindex = layer.open(openobj);
		   return layindex;
		},
		bpopupBox:function(html,className){
			var self = this;
			var openobj = {
				type: 1
				,shadeClose: false
				,content:html
				,anim: 'scale'
		   };
		   if(className){
				openobj.className = className;
		   }
		   return layer.open(openobj);
		},
		loading:function(txt){
			 var index = layer.open({
				type: 2
				,shadeClose: false
				,content: txt
			 });
			 return index;
		},
		close:function(index){
			layer.close(index)
		},
		closeall:function(){
			layer.closeAll();
		},
		ajaxSubmit: function(url,params,tips){
			var self = this;
			if(tips){
				var layerindex = self.loading(tips);
			}
			params.hdid = XCV2Config.hdid;
			params.hdhash = XCV2Config.hdhash;
			var ajaxObj = $.Deferred();
			$.ajax({
				url:self.makeurl(url),
				type: 'post',
				data:params,
				dataType: 'json'
			}).then(function(json){
				if(tips){
					self.close(layerindex);
				}
				ajaxObj.resolve(json);
			}, function(json){
				if(tips){
					self.close(layerindex);
				}
				self.alert(json);
				ajaxObj.reject(json);
			});
			return ajaxObj.promise();
		},
		makeurl:function(r,hdid){
			var i = this.getQueryString('i');
			var j = this.getQueryString('j');
			if(!hdid){
				return './index.php?i='+i+'&j='+j+'&c=entry&do=mobile&r='+r+'&m=meepo_xianchangv2';
			}else{
				return './index.php?i='+i+'&j='+j+'&c=entry&do=mobile&r='+r+'&m=meepo_xianchangv2&hdid='+hdid;
			}
		},
		tpl:function(dom,data){
			return laytpl(dom.html()).render(data);
		},
		oneSlideBox:function(config){
				slideBox.popBoxinit(config);
		},
		anicss:function(element, animationName, callback) {
			var node = document.querySelector(element);
			node.classList.add('animated', animationName);
			function handleAnimationEnd() {
				node.classList.remove('animated', animationName)
				node.removeEventListener('animationend', handleAnimationEnd);
				if (typeof callback === 'function') callback();
			}
			node.addEventListener('animationend', handleAnimationEnd);
		},
		uploadVideo:function(params,func,func2,seltype){
			var self = this;
			seltype = seltype||1;
			var selvideotype = seltype == 1?'capture="camera"':'';
			var layerindex = self.loading('视频文件上传中...');
			var videofdom = params.obj.parent();
			var upUrl = self.makeurl(params.url,XCV2Config.hdid);
			params.obj.wrap("<form class='ajaxupload' action="+upUrl+" method='post' enctype='multipart/form-data'></form>");
			$(".ajaxupload").ajaxSubmit({
				dataType:'json',
				success:function(data){
					params.obj.unwrap();
					params.obj.remove();
					self.close(layerindex);
					videofdom.append('<input type="file" name="file" accept="video/*" '+selvideotype+' class="videofile">');
					func&&func(data);
				},
				error:function(data){
					params.obj.unwrap();
					params.obj.remove();
					self.close(layerindex);
					videofdom.append('<input type="file" name="file" accept="video/*" '+selvideotype+' class="videofile">');
					func2&&func2(data);
				}
			});
		},
		uploadImg:function(params,func,imgnum,txt){
			 var self = this;
			 imgnum = imgnum||1;
			 if(XCV2Config.isiframe){
				 parent.wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						if(localIds.length > imgnum){
							self.msg(txt||'一次只能上传'+imgnum+'张图片');
						}else{
							self.getUploadImg(params,localIds,func);
						}
					}
				});
			 }else{
				 wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						if(localIds.length > imgnum){
							self.msg(txt||'一次只能上传'+imgnum+'张图片');
						}else{
							self.getUploadImg(params,localIds,func);
						}
					}
				});
			 }
		},
		getUploadImg:function(params,localIds,func){
			var self = this;
			var localId = localIds.shift();
			if(XCV2Config.isiframe){
				parent.wx.uploadImage({
					localId: localId,
					isShowProgressTips: 1,
					success: function (res) {
						var serverId = res.serverId; // 返回图片的服务器端ID
						self.ajaxSubmit(params,{media_id:serverId},'图片上传中').then(function(data){
							func&&func(data);
							if(localIds.length > 0){  
								self.getUploadImg(params,localIds,func);  
							}  
						}, function(data){
							 self.alert(data);
							 self.msg('网络超时，上传失败');
						});
					}
				});
			}else{
				wx.uploadImage({
					localId: localId,
					isShowProgressTips: 1,
					success: function (res) {
						var serverId = res.serverId; // 返回图片的服务器端ID
						self.ajaxSubmit(params,{media_id:serverId},'图片上传中').then(function(data){
							func&&func(data);
							if(localIds.length > 0){  
								self.getUploadImg(params,localIds,func);  
							}  
						}, function(data){
							 self.alert(data);
							 self.msg('网络超时，上传失败');
						});
					}
				});
			}
		},
		uploadImg2:function(params,func,imgnum,txt){
			 var self = this;
			 imgnum = imgnum||1;
			 if(XCV2Config.isiframe){
				 parent.wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						if(localIds.length > imgnum){
							self.msg(txt||'一次只能上传'+imgnum+'张图片');
						}else{
							self.downUploadImg(params,localIds,func);
						}
					}
				});
			 }else{
				 wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						if(localIds.length > imgnum){
							self.msg(txt||'一次只能上传'+imgnum+'张图片');
						}else{
							self.downUploadImg(params,localIds,func);
						}
					}
				});
			 }
		},
		downUploadImg:function(params,localIds,func){//直接下载base64码
			var self = this;
			var localId = localIds.shift();
			if(XCV2Config.isiframe){
				parent.wx.getLocalImgData({
				  localId: localId,
				  success: function (res) {
					var localData = res.localData;
					if (localData.indexOf('data:image') != 0) {
						localData = 'data:image/jpeg;base64,' +  localData;
					}
					localData = localData.replace(/\r|\n/g, '');
					self.ajaxSubmit(params,{media_id:localData},'图片上传中').then(function(data){
						func&&func(data);
						if(localIds.length > 0){  
							self.downUploadImg(params,localIds,func); 
						}  
					}, function(data){
						 self.alert(data);
						 self.msg('网络超时，上传失败');
					});
				   }
				});
			}else{
				wx.getLocalImgData({
				  localId: localId,
				  success: function (res) {
					var localData = res.localData;
					if (localData.indexOf('data:image') != 0) {
						localData = 'data:image/jpeg;base64,' +  localData;
					}
					localData = localData.replace(/\r|\n/g, '');
					self.ajaxSubmit(params,{media_id:localData},'图片上传中').then(function(data){
						func&&func(data);
						if(localIds.length > 0){  
							self.downUploadImg(params,localIds,func); 
						}  
					}, function(data){
						 self.alert(data);
						 self.msg('网络超时，上传失败');
					});
				   }
				});
			}
		},
		//用户选择本地手机图片直接生成图片base64
		getwximgbase64:function(func,imgnum){
			var self = this;
			 imgnum = imgnum||1;
			 if(XCV2Config.isiframe){
				 parent.wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						for(var i=0;i<localIds.length;i++){
							var localId = localIds[i];
							parent.wx.getLocalImgData({
							  localId: localId,
							  success: function (res) {
									var localData = res.localData;
									if(localData.substr(0,5)!='data:'){
										localData = 'data:image/jpg;base64,' +  localData;
									}
									localData = localData.replace(/\r|\n/g, '');
									func&&func(localData);
							   }
							});
						}
					}
				  });
			 }else{
				 wx.chooseImage({
					count:imgnum,
					success: function (res) {
						var localIds = res.localIds;
						for(var i=0;i<localIds.length;i++){
							var localId = localIds[i];
							wx.getLocalImgData({
							  localId: localId,
							  success: function (res) {
									var localData = res.localData;
									if(localData.substr(0,5)!='data:'){
										localData = 'data:image/jpg;base64,' +  localData;
									}
									localData = localData.replace(/\r|\n/g, '');
									func&&func(localData);
							   }
							});
						}
					}
				  });
			}
		},
		previewImage:function(e){
			var imgArray = [];
			var thisimg = $(e).attr('src');
			imgArray.push(thisimg);
			if(XCV2Config.isiframe){
				parent.wx.previewImage({
				  current: thisimg,
				  urls: imgArray
				});
			}else{
				wx.previewImage({
				  current: thisimg,
				  urls: imgArray
				});
			}
		},
		previewImages:function(e){
			var imgArray = [];
			var thisimg = $(e).attr('src');
			var someImgBox = $(e.parentNode.parentNode).find('img');
			if(someImgBox.length>1){
				someImgBox.each(function(index, element) {
					imgArray.push($(element).attr('src'));
				});
			}else{
				imgArray.push(thisimg);
			}
			if(XCV2Config.isiframe){
				parent.wx.previewImage({
				  current: thisimg,
				  urls: imgArray
				});
			}else{
				wx.previewImage({
				  current: thisimg,
				  urls: imgArray
				});
			}
		},
		waitImgLoad:function(callback){
			var self = this;
			var t_img_load; 
			var img_isLoad = true;
			if($('.needwait').length>0){
				$('.needwait').each(function(){
					if(this.height === 0){
						img_isLoad = false;
						return false;
					}
				});
				if(img_isLoad){
					clearTimeout(t_img_load); 
					callback&&callback();
				}else{
					img_isLoad = true;
					t_img_load = setTimeout(function(){
						self.waitImgLoad(callback);
					},500);
				}
			}else{
				callback&&callback();
			}
		},
		alert:function(data){
			if(this.debug){
				alert(JSON.stringify(data));
			}
		},
		timeTostring:function(time,type){
			  if(time){
				var now = new Date(time*1000);
			  }else{
				var now = new Date();
			  }
			  if(!type) type = 1;
			  var year = now.getFullYear();     
			  var month = now.getMonth()+1;     
			  var date = now.getDate();     
			  var hour = now.getHours();     
			  var minute = now.getMinutes();     
			  var second = now.getSeconds();  
			  if(type=='1'){
				 return   (month<10?'0'+month:month)+"-"+(date<10?'0'+date:date)+" "+(hour<10?'0'+hour:hour)+":"+(minute<10?'0'+minute:minute)+":"+(second<10?'0'+second:second);     
			  }else{
				 return   year+'-'+(month<10?'0'+month:month)+"-"+(date<10?'0'+date:date)+" "+(hour<10?'0'+hour:hour)+":"+(minute<10?'0'+minute:minute)+":"+(second<10?'0'+second:second);
			  }
		},
		newjoin:function(name){
			var self = this;
			if (!name) return;
			var joinBox = $('.newjoin-enter');
			if (joinBox.hasClass('movein')) {
				clearTimeout(self.newjointimer);
			}
			joinBox.removeClass('moveout');
			joinBox.addClass('movein').find('.name').text(name);
			self.newjointimer = setTimeout(function () {
				joinBox.removeClass('movein').addClass('moveout').find('.name').text('');
				setTimeout(function () {
					joinBox.removeClass('moveout');
				}, 400)
			}, 2500)
		},
		gotopage:function(find,url){
			 var self = this;
			 self.sendMsg2frame(find,url);
			 var nowpage = window.location.href;
			 if(nowpage.indexOf(find)<0){
				 self.reloadpage(url);
			 }
		},
		reloadpage:function(url){
			if(url==null){
				url = this.reloadUrl(window.location.href);
			}
			window.location.href = this.reloadUrl(url);
			//window.location.replace(url);
		},
		sendMsg2frame:function(r,url){
			if(!XCV2Config.isiframe) return false;
			var nowpage = window.location.href;
			 if(nowpage.indexOf(r)<0){
				 window.parent.postMessage({
						 msg:{'module':r,'url':url}
				},'*');
			 }
		},
		senddmMsg2frame:function(r,url){
			if(!XCV2Config.isiframe) return false;
			window.parent.postMessage({
				msg:{'module':r,'url':url}
			},'*');
		},
		layerAsklucker:function(data,reloadurl){
			var self = this;
			if(XCV2Config.appluckerdialog!='1') return;
			if(!XCV2Config.isiframe){
				reloadurl = reloadurl || XCV2Config.myrecordurl;
				var fromluckers = data.openids;
				$.each(fromluckers,function(i,v){
					if(v==XCV2Config.openid){
						self.ajaxSubmit("wechat.common.ajaxluckinfo",{luckid:i,modulekey:data.module}).then(function(json){
							if(json.errno==0){
								self.ask('恭喜您中奖啦',json.message,['查看详情','关闭'],function(index){
									self.close(index);
									self.reloadpage(reloadurl);
								});
							}
						});
					}
				})
			}else{
				self.senddmMsg2frame('luckopenids',data);	
			}
		},
		reloadUrl:function(url,key){
			var key= (key || 't') +'='; 
			var reg=new RegExp(key+'\\d+');  
			var timestamp=+new Date();
			if(url.indexOf(key)>-1){ 
				return url.replace(reg,key+timestamp);
			}else{  
				if(url.indexOf('\?')>-1){
					var urlArr=url.split('\?');
					if(urlArr[1]){
						return urlArr[0]+'?'+key+timestamp+'&'+urlArr[1];
					}else{
						return urlArr[0]+'?'+key+timestamp;
					}
				}else{
					if(url.indexOf('#')>-1){
						return url.split('#')[0]+'?'+key+timestamp+location.hash;
					}else{
						return url+'?'+key+timestamp;
					}
				}
			}
		},
		randomInt:function(n, m){
			var random = Math.floor(Math.random()*(m-n+1)+n);
			return random;
		},
		playAudio:function(audio){
			if(XCV2Config.isiframe){
				parent.wx.getNetworkType({
				  success: function (res) {
						audio.play();
				  }
				})
			}else{
				wx.getNetworkType({
				  success: function (res) {
						audio.play();
				  }
				})	
			}
		},
		showWxpay:function(data,func,func2){
			var self = this;
			if(XCV2Config.isiframe){
				parent.wx.chooseWXPay({
					timestamp: ""+data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package, 
					signType: data.signType,
					paySign:data.paySign,
					success: function (res) {
						func&&func(res);
					},
					cancel: function (err) {
						func2&&func2(err);
					},
					fail: function(res) {
						self.msg('支付出错，请稍后重试');
					},
				});
			}else{
				wx.chooseWXPay({
					timestamp: ""+data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package, 
					signType: data.signType,
					paySign:data.paySign,
					success: function (res) {
						func&&func(res);
					},
					cancel: function (err) {
						func2&&func2(err);
					},
					fail: function(res) {
						self.msg('支付出错，请稍后重试');
					},
				});				
			}
		},
		gamePayrotate:function(rotateid,fee,func){
			var self = this;
			var blayindex = self.bpopupBox(self.tpl($("#payrotate-tpl"),{fee:fee}),'apppayrotate');
			$("body").on('click','.app-payconfirm',function(){
				var $this = $(this);
				$this.addClass('btn-disabled');
				self.ajaxSubmit('wechat.common.gamepayrotate',{gametype:XCV2Config.gametype,rotateid:rotateid,fee:fee},'正在发起支付..').then(function(json){
					$this.removeClass('btn-disabled');
					if(json.errno==0){
					   self.showWxpay(json.message,function(){
						    self.close(blayindex);
							self.msg('支付成功');
							self.shakePermit(function(){
								func&&func();
							});
					   },function(){
						    self.close(blayindex);
							self.msg('您已取消支付');
					   });
					}else if(json.errno==1){
						self.close(blayindex);
						self.reloadpage(json.message);
					}else{
						self.msg(json.message);
					}
				}, function(){
					self.msg('网络太差,发起支付失败');
				});
			 });
		},
		shakePermit:function(func){
			var self = this;
			if (typeof(DeviceMotionEvent) !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
				window.DeviceMotionEvent.requestPermission().then(function(r) {
					if(r!='granted'){
						self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，授权准许即可参与游戏',['我知道了'],function(index){
							self.close(index);
						});
					}else{
						func&&func();
					}
				}).catch(function (t) {
					self.ask('温馨提醒','苹果ios13以上系统需要您授权准许访问手机的动作与方向才可以参与本游戏',['马上去授权'],function(index){
						self.close(index);
						window.DeviceMotionEvent.requestPermission().then(function(r) {
							if (r != 'granted') {
								self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，点击准许即可参与游戏',['我知道了'],function(index){
									self.close(index);
								});
							}else{
								func&&func();
							}
						})
					});
				});
			}else{
				func&&func();
			}
		},
		shakePermit2:function(func){
			var self = this;
			if (typeof(DeviceMotionEvent) !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
			  if(XCV2Config.isiframe){
				parent.wx.getNetworkType({
				  success: function (res) {
					window.DeviceMotionEvent.requestPermission().then(function(r) {
						if(r!='granted'){
							self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，点击准许即可参与游戏',['我知道了'],function(index){
								self.close(index);
							});
						}else{
							func&&func();
						}
					}).catch(function (t) {
						window.DeviceMotionEvent.requestPermission().then(function(r) {
							if (r != 'granted') {
								self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，点击准许即可参与游戏',['我知道了'],function(index){
									self.close(index);
								});
							}else{
								func&&func();
							}
						})
					});
				  }
				})
			  }else{
				wx.getNetworkType({
				  success: function (res) {
					window.DeviceMotionEvent.requestPermission().then(function(r) {
						if(r!='granted'){
							self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，点击准许即可参与游戏',['我知道了'],function(index){
								self.close(index);
							});
						}else{
							func&&func();
						}
					}).catch(function (t) {
						window.DeviceMotionEvent.requestPermission().then(function(r) {
							if (r != 'granted') {
								self.ask('温馨提醒','您已拒绝授权准许访问手机的动作与方向，请关闭微信app后重新进入游戏，点击准许即可参与游戏',['我知道了'],function(index){
									self.close(index);
								});
							}else{
								func&&func();
							}
						})
					});
				  }
				})
			  }
			}else{
				func&&func();
			}
		},
		mediaUrl:function(url){
			if(url=='') return url;
			var http = url.substr(0, 7).toLowerCase(),https = url.substr(0, 8).toLowerCase();
			if(http=== "http://"||https=== "https://"){
				return url;
			}
			return XCV2Config.attchurl + url;
		},
		onlynum:function(e){
			var obj = $(e.target);
			if(obj.val().length==1){
				obj.val(obj.val().replace(/[^1-9]/g,''));
			}else{
				obj.val(obj.val().replace(/\D/g,''));
			}
		},
		onlynumorpoint:function(e){
			var obj = $(e.target);
			var regStrs = [
			   ['[^\\d\\.]+$', ''],
			   ['\\.(\\d?)\\.+', '.$1'],
			   ['^(\\d+\\.\\d{2}).+', '$1']
		   ];
		   for(i=0; i<regStrs.length; i++){
			   var reg = new RegExp(regStrs[i][0]);
			   obj.val(obj.val().replace(reg, regStrs[i][1]));
		   }
		},
		getwxlocation:function(func){
			var self = this;
			if(window.top!=window.self){
				parent.wx.ready(function () {
					parent.wx.getLocation({
					  success: function (res) {
						func&&func(res);
					  },
					  cancel: function (res) {
						self.msg('您拒绝了授权获取地理位置，无法进入活动');
					  }
					});
				});
			}else{
				wx.ready(function () {
					wx.getLocation({
					  success: function (res) {
						 func&&func(res);
					  },
					  cancel: function (res) {
						self.msg('您拒绝了授权获取地理位置，无法进入活动');
					  }
					});
				});
			}
		},
		closewxwindow:function(){
			if(window.top!=window.self){
				parent.wx.closeWindow();
			}else{
				wx.closeWindow();
			}
		},
		hidewxmenu:function(){
			if(window.top!=window.self){
				parent.wx.hideOptionMenu();
			}else{
				wx.hideOptionMenu();
			}
		},
	};
	return wechatcore;
});
