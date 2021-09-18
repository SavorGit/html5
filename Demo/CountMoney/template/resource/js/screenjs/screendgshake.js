define('screendgshake',['screensocket','screencore','template','layerBox','fulldm','keyboard'],function(screensocket,screencore,template,layerBox,fulldm,keyboardJS){
	var screendgshake = {
		gamestatus:0,
		stopclick:false,
		maxscore: 120,
		phbnums:10,
		autorun:1,
		autonum:20,
		gametimererror:true,
		joinInterval:null,
		lineitemRender:null,
		newjoinRender:null,
		pmitemRender:null,
		rankTen:[],
		audio:{},
		init: function() {
			var self = this;
			self.lineitemRender = template($(".dgshake-vertical").length>0?'vshakeitem-tpl':'hshakeitem-tpl');
			self.pmitemRender = template('pmshakeItem-tpl');
			var params = {};
			params.onmessage = function(data){
				if(data.type=='connected'){
					screensocket.isclose = false;
					screensocket.sendData({type:"shakegame",stype:"gamelink"});
				}else if(data.type=='gamenoround'){
					if(self.gamestatus==0){
						self.showLastRoundUser();
					}
				}else if(data.type=='gameonline'){
					self.gamestatus==1&&self.rushuser(data);
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.initAudio();
					self.bindEvent();
					self.maxscore = data.maxscore;
					self.phbnums = data.phbnums;
					if(self.phbnums>10||self.phbnums==0) self.phbnums = 10;
					self.createLine();
					if(data.type=='gameiswait'){
						$('.welcomeBox').removeClass("display-none").animateControl(screencore.anicssArr());
						self.gamestatus = 1;
						clearInterval(self.joinInterval);
						self.autorun = data.autorun;
						self.autonum = data.autonum;
						self.joinInterval = setInterval(function(){
							screensocket.sendData({type:"shakegame",stype:"gameonline"});
						},2e3);
					}else{
						self.gamestatus = 2;
						self.gametimererror = true;
						setTimeout(function(){
							if(self.gamestatus == 2&&self.gametimererror){
								layerBox.showConfirm('警告','当前轮次计时器存在异常，需要重置才可以继续开始',['重置本轮','跳过本轮，进入下一轮'],function(){
									screensocket.sendData({type:"shakegame",stype:"gameerror"});
								},function(){
									screensocket.sendData({type:"shakegame",stype:"gamedel"});
								});
							}
						},4e3);
						$(".dgshake-list").removeClass('display-none');
					}
				}else if(data.type=='gameiscountdown'){
					var b = $(".webstartdjs"),e = b.find(".webstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					b.removeClass('display-none');
					self.audio.countAudio.play();
					data.djs==0&&$(".dgshake-list").removeClass('display-none');
				}else if(data.type=='gameisdjs'){
					self.gamestatus = 2;
					self.gametimererror = false;
					$(".welcomeBox,.webstartdjs").addClass('display-none');
					var b = $(".webgamedjs"),s = b.find(".gamedjsani");
					s.text(data.djs);
					b.removeClass('display-none');
					if(data.djs == 0){
						self.gamestatus = 3;
						b.addClass('display-none');
						self.audio.overAudio.play();
						$(".bgneedrun").removeClass('runbg');
						layerBox.showLoading('正在加载排名数据，请稍后...');
					}
					self.rushDom(data.list);
				}else if(data.type=='gameshowphbbtn'){
					layerBox.closeLayer();
					var btn = $(".rankBox-btns .paiming");
					btn.attr({'data-rotateid':data.rotateid,'data-gamephb':data.gamephb});
					self.showEndUser(data.list);
					screencore.sendLuckerTpl(data.rotateid);
				}else if(data.type=='gamedgshakerefresh'||data.type=='gameerrorhaddone'){
					window.location.reload();
				}else if(data.type=='gameiserror'){
					layerBox.showMsg('当前轮次已被删除');
					setTimeout(function(){
						window.location.reload();
					},1e3);
				}else if(data.type=='dgshakeoffline'){
					screensocket.forceoff = true;
					layerBox.showMsg('当前游戏不支持多开，当前窗口已经被迫下线','0');
				}else if(data.type=='screendm'){
					var messages = data.messages;
					if(messages){
						if($.isArray(messages)&&messages.length>0){
							$.each(messages,function(i, val){
								if(val.type=='1'){
									fulldm.addBullet(val);
								}
							});
						}
					}else{
						fulldm.addBullet(data);
					}
				}else if(data.type=='screendeldm'){
					if(!$.isArray(data.msgid)){
						fulldm.delBullet(data.msgid);
					}else{
						$.each(data.msgid,function(index,val){
							fulldm.delBullet(val);
						});
					}
				}else if(data.type=='screenresetdm'){
					fulldm.resetBullet();
				}
			};
			params.onclose = function(){
				screensocket.reconnect();
				clearInterval(self.joinInterval);
			};
			screensocket.init(params);
		},
		initAudio: function(){
			var self = this;
			self.audio.joinAudio = document.getElementById("joinaudio");
			self.audio.countAudio = document.getElementById("countaudio");
			self.audio.overAudio = document.getElementById("overaudio");
		},
		bindEvent: function() {
			var self = this;
			$(".start-btn").on('click',function(){
				if(screensocket.isclose) return;
				if(parseInt($(".welcomeBox-nums span").text())==0) return layerBox.showMsg('当前无用户参与，无法开始游戏');
				if(self.stopclick) return;
				self.stopclick = true;
				$(".welcomeBox").addClass('display-none');
				screencore.hideFootAndQr();
				clearInterval(self.joinInterval);
				screensocket.sendData({type:"shakegame",stype:"gamestart"});
			});
			$(".rankBox .nextround").on('click',function(){
				screencore.gameautocreate();
			});
			var clickpm = false;
			$(".rankBox .paiming").on('click',function(){
				var $this = $(this);
				$(".banglistBox-btns").removeAttr("data-nowrotateid");
				if(clickpm) return;
				clickpm = true;
				screencore.ajaxSubmit('screen.common.gamerotatephb',{'gametype':XCV2Config.gametype,rotateid:$this.attr('data-rotateid'),gamephb:$this.attr('data-gamephb')},'正在获取排行榜数据').then(function(data){
					 clickpm = false;
					 if(data.errno==0){
						 var pmHtml = "";
						 if(data.message.length>0){
							 $.each(data.message,function(k,v){
								v.key = k;
								pmHtml += self.pmitemRender(v);
							 })
						 }
						 $(".banglistBox .banglist").html(pmHtml);
						 $('.banglistBox').removeClass("display-none").animateControl('bounceInUp');
					 }else{
						layerBox.showMsg(data.message);
					 }
				}, function(){
					  clickpm = false;
					  layerBox.showMsg('网络太差，请稍后重试');
				});
			});
			$(".banglist-close i").on('click',function(){
				 $('.banglistBox').animateControl('bounceOutDown',function(e){
					e.addClass('display-none');
				 });
			});
			var clickpn = false;
			$(".banglistBox-btns a").on('click',function(){
				var $this = $(this);
				if(clickpn) return;
				clickpn = true;
				var isprev = $this.hasClass('banglistBox-btn-prev');
				var rotateid = $this.parent().attr('data-nowrotateid')?$this.parent().attr('data-nowrotateid'):$(".rankBox-btns .paiming").attr('data-rotateid');
				screencore.ajaxSubmit('screen.common.gamerotatepnphb',{'gametype':XCV2Config.gametype,rotateid:rotateid,isprev:isprev?'1':'2'},'正在获取排行榜数据').then(function(data){
					 clickpn = false;
					 if(data.errno==0){
						 var pmHtml = "";
						 if(data.message.data.length>0){
							 $.each(data.message.data,function(k,v){
								v.key = k;
								pmHtml += self.pmitemRender(v);
							 }) 
						 }
						 $this.parent().attr('data-nowrotateid',data.message.rotateid);
						 $(".banglistBox .banglist").html(pmHtml);
					 }else{
						layerBox.showMsg(data.message);
					 }
				}, function(){
					  clickpn = false;
					  layerBox.showMsg('网络太差，请稍后重试');
				});
			});
			keyboardJS.bind('space', function(e) {
				if(self.gamestatus==1){
					$(".start-btn").trigger('click');
				}
			});
			keyboardJS.bind('right', function(e) {
				if(self.gamestatus==2){
					layerBox.showConfirm('警告','当前轮次还未结束，确定要强制结束么?',['确定','取消'],function(){
						$(".welcomeBox").addClass('display-none');
						screensocket.sendData({type:"shakegame",stype:"gameend"});
					});
				}else{
					self.gamestatus!=1&&$(".rankBox .nextround").trigger('click');
				}
			});
			keyboardJS.bind('shift', function(e) {
				if(self.gamestatus==1||self.gamestatus==2) return;
				if(!$(".rankBox").is(":hidden")){//已经出来了前10排名 
					if($(".banglistBox").is(":hidden")){
						$(".rankBox .paiming").trigger('click');
					}else{
						$(".banglist-close i").trigger('click');
					}
				}
			});
		},
		rushDom:function(list){
			var self = this,lbox = $(".dgshake-list ul"),l = lbox.find('li'),isvertical = lbox.hasClass('dgshake-vertical'),vmax = 530;
			self.rankTen = list;
			l.each(function(i,v){
				if(list[i]){
					var openid = list[i].openid,notfly = $(v).attr('data-openid')==openid,isintop = l.filter(function(o, i) {
						return openid == $(i).attr("data-openid")
					});
					if(!notfly && isintop.length > 0 ){
						var frompos = isintop[0].getBoundingClientRect(),topos = $(v)[0].getBoundingClientRect(),x = topos.left - frompos.left,y = topos.top - frompos.top;
						if (x || y) {
							isintop.css({
								"transform":"translate(" + x + "px," + y + "px)",
								"transition":"transform 0.2s",
							}).on("webkitTransitionEnd transitionend", function() {
								isintop.removeAttr('style');
							});
						}
					}
					var left = (list[i].score/self.maxscore).toFixed(2);//百分比
					$(v).find(".nicknamebox").text(list[i].nickname);
					$(v).find(".avatarbox img").attr("src",list[i].avatar);
					$(v).find(".myscore").text(list[i].score);
					if(isvertical){
						left = left >=1 ? vmax + 'px': (left * vmax) + 'px';
					}else{
						left = left >= 1 ? '100%' : (left*100)+'%';
					}
					var cssobj = isvertical?{"height":left}:{"width":left};
					$(v).find(".barbox").css(cssobj);
					$(v).attr("data-openid",openid);
				}else{
					$(v).find(".nicknamebox").text('虚位以待');
					$(v).find(".avatarbox img").attr("src",defaultImg);
					$(v).find(".myscore").text(0);
					$(v).removeAttr("data-openid");
					var cssobj = isvertical?{"height":0}:{"width":0};
					$(v).find(".barbox").css(cssobj);
				}
			});
		},
		showEndUser:function(enduser,endphbnums){
			var self = this,list = enduser||self.rankTen,phbnums = endphbnums||self.phbnums;
			screencore.gameEndphb(list,phbnums);
		},
		showLastRoundUser:function(){
			var self = this;
			screencore.ajaxSubmit('screen.common.getLastrotatephb',{'gametype':XCV2Config.gametype}).then(function(data){
				 if(data.errno==0){
					 var lastusers = data.message;
					 if(lastusers=='1'){
						$(".shake-mainbox .emptybox").removeClass("display-none");
					 }else{
						var tipindex = layerBox.showLoading('无正在进行的轮次，直接显示最后一轮结果');
						setTimeout(function(){
							layerBox.close(tipindex);
						},1e3);
						self.bindEvent();
						var btn = $(".rankBox-btns .paiming");
						btn.attr({'data-rotateid':lastusers.rotateid,'data-gamephb':lastusers.gamephb});
						self.showEndUser(lastusers.users,lastusers.phbnums);
					 }
				 }else{
					layerBox.showMsg(data.message);
				 }
			}, function(){
				  layerBox.showMsg('网络太差，请稍后重试');
			});
			
		},
		createLine:function(){
			var self = this;
			if($('.dgshake-list ul').children().length>0) return;
			var trackHtml = "";
			for (var i = 0; i < 10; i++) {
				trackHtml += self.lineitemRender({});
			}
			$(trackHtml).appendTo(".dgshake-list ul");
		},
		rushuser:function(data){
			var self = this;
			$(".welcomeBox-nums span").text(data.count);
			var end10 = data.user;
			if(!end10) return;
			end10 = screencore.objectToarray(end10);
			var userdom = $(".welcome-users div");
			$.each(userdom,function(i,val){
				var oneuser = end10[i],useravatar = oneuser?oneuser.avatar:defaultImg;
				$(this).find('img').attr('src',useravatar);
			});
			if(self.autorun==2){
				if(self.gamestatus==1&&data.count>=self.autonum){
					self.autostart();
				}
			}
		},
		autostart:function(){
			var self = this;
			clearInterval(self.joinInterval);
			setTimeout(function(){
				$(".start-btn").trigger('click');
			},1e3)
		}
	};
	return screendgshake;
});
