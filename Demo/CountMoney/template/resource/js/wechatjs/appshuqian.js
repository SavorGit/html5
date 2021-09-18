define('appshuqian',['appsocket','wechatcore','howler'],function(appsocket,wechatcore){
	var appshuqian = {
		rotateid:0,
		gamestatus: 0,
		shaketype:1,
		statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束'],
		gameInterval:null,
		myscore: 0,
		maxscore: 120,
		onemoney:100,
		myshakeEvent:null,
		kh:['加油啊','看什么看，速度了','别停啊，伙计','加油~加油'],
		init: function() {
			var self = this;
			var params={};
			params.onmessage = function(data){
				console.log(data);
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.rotateid = data.rotateid;
					self.shaketype = data.shaketype;
					$(".gametimeremain span").text(data.gametime);
					self.maxscore = data.maxscore;
					self.initAudio();
					self.bindEvent();
					if(data.type=='gameiswait'){
						self.gamestatus = 1;
						self.myscore = 0;
						var tips = self.statustip[0];
						self.changetip(tips);
						self.hidephbbtn();
						self.onlygametip();
					}else{
						self.gamestatus = 2;
						self.myscore = data.myscore;
						var tips = self.statustip[2];
						self.changetip(tips);
						self.onlygamestatus();
						self.hidetip();
					}
					self.setprogress(self.myscore);
				}else if(data.type=='gameiscountdown'){
					var b = $(".appstartdjs"),e = b.find(".appstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					b.removeClass('hidden');
					self.changetip(self.statustip[1]);
					wechatcore.playAudio(self.djsaudio);
					self.hidetip();
					data.djs==0&&self.changetip(self.statustip[2]);
				}else if(data.type=='gameisdjs'){
					self.hidetip();
					self.gamestatus = 2;
					$(".appstartdjs").addClass('hidden');
					$(".gametimeremain span").text(data.djs);
					data.djs==0&&self.endshake();
				}else if(data.type=='gameshuqianrefresh'||data.type=='gameappshuqianrefresh'){
					appsocket.closeClient();
				}else if(data.type=='gameshowphbbtn'){
					self.gamestatus==3&&self.showphbbtn(data.rotateid,data.gamephb);
				}else if(data.type=='gamenoround'||data.type=='gameislucker'){
					self.gamestatus = 0;
					self.changetip((data.type=='gamenoround'?'暂无正在进行的轮次':XCV2Config.isluckertxt));
					self.onlygamestatus();
					$('.ri').hide();
					$(".gametimeremain span").text(0);
					self.setprogress(0);
				}else if(data.type=='gamestartnojoin'){
					self.gamestatus = 0;
					self.changetip('本轮游戏已经开始，无法加入');
					self.onlygamestatus();
					self.setprogress(0);
					$('.ri').hide();
					$(".gametimeremain span").text(0);
				}else if(data.type=='gameneedpay'){
					self.changetip('请先购买参与游戏资格');
					self.onlygamestatus();
					$(".gametimeremain span").text(0);
					self.setprogress(0);
					$('.ri').hide();
					wechatcore.gamePayrotate(data.rotateid,data.fee,function(){
						appsocket.closeClient();
				   });
				}else if(data.type=='gameiserror'){
					appsocket.closeClient();
				}else if(data.type=='addblack'){
					data.userid==XCV2Config.userid&&wechatcore.closewxwindow();
				}else if(data.type=='goto'){
					wechatcore.gotopage(data.r,data.url);
				}else if(data.type=='luckopenids'){
					wechatcore.layerAsklucker(data);
				}
			};
			appsocket.init(params);
		},
		initAudio: function(){
			var self = this;
			self.shakeaudio = $('#shakeaudio')[0];
			self.djsaudio = $("#djsaudio")[0];
			wx.getNetworkType({
				success: function (res) {
					self.shakeaudio.load();
					self.djsaudio.load();
				}
			});
			if(!self._djsaudio){
			self._djsaudio = new Howl({
				src: [$('#djsaudio').attr("src")],
				onplayerror: function() {
					self._djsaudio.once('unlock', function() {
						self._djsaudio.play();
					});
				}
			});
			}
			if(!self._shakeaudio){
				self._shakeaudio = new Howl({
					src: [$('#shakeaudio').attr("src")],
					onplayerror: function() {
						self._shakeaudio.once('unlock', function() {
							self._shakeaudio.play();
						});
					}
				});
			}
		},
		bindEvent: function() {
			var self = this;
			var moneyBox =  $(".money_box");
			moneyBox.off("touchstart").on("touchstart", function(e) {
				if(self.gamestatus!=2) return;
				if (e.cancelable) {
					if (!e.defaultPrevented) {
						e.preventDefault();
					}
				}
				startY = e.originalEvent.changedTouches[0].pageY;
			});
			moneyBox.off("touchend").on("touchend", function(e) {
				if(self.gamestatus!=2) return;
				moneyBox.find('.money').show();
				if (e.cancelable) {
					if (!e.defaultPrevented) {
						e.preventDefault();
					}
				}
				moveEndY = e.originalEvent.changedTouches[0].pageY,
				Y = moveEndY - startY;
					if ( Y < -50 ) {
						$('.ri').show();
						self._shakeaudio.play();
						moneyBox.find('.money').animate({
							"bottom":"110%"
						},400, function () {
							$(this).remove();
							self.workerdata();
						});
						setTimeout(function () {
							moneyBox.append('<div class="money"></div>');
						},100)
					}
			});
			$(".money-tips").on('click touchstart',function(){
				self.onlygamestatus();
			});
		},
		endshake:function(){
			var self = this;
			self.gamestatus = 3;
			$('.ri').hide();
			self.changetip(self.statustip[3]);
			self.onlygamestatus();
		},
		setprogress:function(score){
			var self = this,p = $(".money_count");
			p.find(".money_add span").html(score*self.onemoney);
		},
		workerdata:function(){
			var self =this;
			if(self.gamestatus!=2) return;
			self.myscore++;
			self.senddata({stype:'senddata',score:self.myscore});
			self.setprogress(self.myscore);
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'shakegame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		onlygamestatus:function(){
			var self = this;
			self.hidegametip();
			self.showgamestatus();
			self.showtip();
			self.gamestatus!=3&&self.hidephbbtn();
		},
		onlygametip:function(){
			var self =this;
			self.hidegamestatus();
			self.showgametip();
			self.showtip();
		},
		changetip:function(tips){
			$('.money-tips .gamestatus').html(tips);
		},
		showtip:function(){
			$('.money-tips').removeClass('hidden');
		},
		hidetip:function(){
			$('.money-tips').addClass('hidden');
		},
		showgamestatus:function(){
			$('.money-tips .gamestatus').removeClass('hidden');
		},
		hidegamestatus:function(){
			$('.money-tips .gamestatus').addClass('hidden');
		},
		showgametip:function(){
			$('.money-tips .gametip').removeClass('hidden');
		},
		hidegametip:function(){
			$('.money-tips .gametip').addClass('hidden');
		},
		showphbbtn:function(rotateid,gamephb){
			var btn = $(".money-tips .phb-btn");
			btn.attr({'data-rotateid':rotateid,'data-gamephb':gamephb});
			btn.removeClass('hidden');
		},
		hidephbbtn:function(){
			var btn = $(".money-tips .phb-btn");
			btn.addClass('hidden');
		}
	};
	return appshuqian;
});
