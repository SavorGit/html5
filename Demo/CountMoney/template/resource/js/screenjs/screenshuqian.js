define('screenshuqian',['screensocket','screencore','template','layerBox','fulldm','keyboard'],function(screensocket,screencore,template,layerBox,fulldm,keyboardJS){
	var screenshuqian = {
		gamestatus:0,
		stopclick:false,
		maxscore: 120,
		onemoney:100,
		phbnums:10,
		autorun:1,
		autonum:20,
		gametimererror:true,
		joinInterval:null,
		newjoinRender:null,
		pmitemRender:null,
		rankTen:[],
		audio:{},
		init: function() {
			var self = this;
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
					$(".shuqian-wrapper").removeClass('display-none');
					if(self.phbnums>10||self.phbnums==0) self.phbnums = 10;
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
					}
				}else if(data.type=='gameiscountdown'){
					var b = $(".webstartdjs"),e = b.find(".webstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					b.removeClass('display-none');
					self.audio.countAudio.play();
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
						layerBox.showLoading('正在加载排名数据，请稍后...');
					}					self.rushDom(data.list);
				}else if(data.type=='gameshowphbbtn'){
					layerBox.closeLayer();
					var btn = $(".rankBox-btns .paiming");
					btn.attr({'data-rotateid':data.rotateid,'data-gamephb':data.gamephb});
					self.showEndUser(data.list);
					screencore.sendLuckerTpl(data.rotateid);
				}else if(data.type=='gameshuqianrefresh'||data.type=='gameerrorhaddone'){
					window.location.reload();
				}else if(data.type=='gameiserror'){
					layerBox.showMsg('当前轮次已被删除');
					setTimeout(function(){
						window.location.reload();
					},2e3);
				}else if(data.type=='shuqianoffline'){
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
								v.score = v.score * self.onemoney;
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
								v.score = v.score * self.onemoney;
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
			$(function(){
				var rankItemW = ($(window).width()-80)*0.09;
				$(".shu-rank-item-head").height(Math.floor((rankItemW*22/106))-1+'px');
				$(".shu-rank-item-footer").height((rankItemW*14/106)+'px');
			})
			$(window).resize(function() {
				var rankItemW = ($(window).width()-80)*0.09;
				$(".shu-rank-item-head").height(Math.floor((rankItemW*22/106))-1+'px');
				$(".shu-rank-item-footer").height((rankItemW*14/106)+'px');
			});
		},
		rushDom:function(list){
			var self = this;
			self.rankTen = list;
			var f = $(".shu-rank-item");
			f.each(function(n) {
				var j = list[n],
					i = " ",
					l = 0,
					o;
				if (j) {
					i = j.nickname;
					l = parseInt(j.score*self.onemoney);
					o = j.avatar
				}
				var q = $(this);
				var m = q.find(".shu-rank-item-score");
				if (parseInt(m.text() > l)) {
					return;
				}
				if (l > 0) {//25000
					var p = Math.floor(l / 25000 * 400);
					p = p > 500 ? 500 : p;
					q.find(".shu-rank-item-body").css("height", p)
				} else {
					q.find(".shu-rank-item-body").css("height", 0)
				}
				q.find(".shu-rank-item-name").html(i);
				m.text(l);
				var r = q.find(".shu-rank-item-info > img");
				if (o) {
					r.css("visibility", "visible");
					r.attr("src", o)
				} else {
					r.css("visibility", "hidden")
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
						$(".shuqian-mainbox .emptybox").removeClass("display-none");
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
		rushuser:function(data){
			var self = this;
			$(".welcomeBox-nums span").text(data.count);
			var end10 = data.user;
			if(!end10) return;
			end10 = screencore.objectToarray(end10);
			var userdom = $(".welcome-users div");
			$.each(userdom,function(i,val){
				var oneuser = end10[i];
				if(oneuser){
					$(this).css('background-image',"url("+oneuser.avatar+")");
				}else{
					$(this).css('background-image',"url()");
				}
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
	return screenshuqian;
});
