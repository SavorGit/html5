define('appshakestart',['appsocket','jquery.shake','wechatcore'],function(appsocket,Shake,wechatcore){
//  	var angle = 0,totalAngle = 0,tempAngle = 0;
	var appshakestart = {
		rotateid:0,
		gamestatus: 0,//nojoin,gamenoround
// 		shaketype:1,
		statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束',''],
		gameInterval:null,
		myscore: 0,
		maxscore: 120,
		myshakeEvent:null,
		kh:['加油啊','看什么看，速度了','别停啊，伙计','加油~加油'],
		init: function() {
			var self = this;
			var params={};
			params.onmessage = function(data){
			 //   console.log(data);
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.hideMask();//隐藏mask
				// 	self.shaketype = 1;
				// 	self.initshaketype();
				//  	$(".zam-app-gametime span").text(data.gametime);
					self.initAudio();
					self.bindEvent();
					if(data.type=='gameiswait'){
					    if(!($('.show-myscore').hasClass('hidden'))){
					        $('.show-myscore').addClass('hidden');
					    }
						self.gamestatus = 1;
						self.myscore = 0;
						$('.show-myscore span').text(0);
				// 		var tips = self.statustip[0];
				 		self.changetip(self.statustip[0]);
					}else{
						self.gamestatus = 2;
				 		self.myscore = data.myscore;
						$('.show-myscore span').text(data.myscore);
						$('.show-myscore').removeClass('hidden');
				// 		var tips = self.statustip[2];
						self.changetip(self.statustip[2]);
						self.changeCirclImg(1);
					}
					
				}else if(data.type=='gameisnopub'){
				    wechatcore.msg('活动未发布，仅准许10人参与',1000);
				    // self.changetip('活动未发布，仅准许10人参与');
				}else if(data.type=='gamepause'){
				    self.gamestatus = 5;
				}else if(data.type=='gameiscountdown'){
					var b = $(".appstartdjs"),e = b.find(".appstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					if(wxdjsisshow == '1' && b.hasClass('hidden')){
					    b.removeClass('hidden');
					}
					self.changetip(self.statustip[1]);
					wechatcore.playAudio(self.djsaudio);
					if(data.djs==0){
						self.changetip(self.statustip[2]);
						self.changeCirclImg(1);
					}
				}else if(data.type=='gameisdjs'){
				    $('.show-myscore').removeClass('hidden');
					self.gamestatus = 2;
					if(!$(".appstartdjs").hasClass('hidden')){
					    $(".appstartdjs").addClass('hidden');
					}
				// 	$(".zam-app-gametime span").text(data.djs);
					data.djs==0&&self.endshake();
				}else if(data.type=='gameshakestartrefresh'||data.type=='gameappdgshakerefresh'){
				// 	appsocket.closeClient();
				    wechatcore.reloadpage();
				}else if(data.type=='gameshowphbbtn'){
					self.gamestatus==3&&self.showphbbtn(data.rotateid,data.gamephb);
				}else if(data.type=='gamenoround'||data.type=='gameislucker'){
					self.gamestatus = 0;
					self.changetip((data.type=='gamenoround'?'暂无正在进行的轮次':XCV2Config.isluckertxt));
					self.shaketype = -1;
					self.initshaketype();
					self.hideProgressBox();
					self.hideMask();
				}else if(data.type=='gamestartnojoin'){
					self.gamestatus = 0;
					self.changetip('本轮游戏已经开始，无法加入');
					self.hideProgressBox();
					self.hideMask();
					self.shaketype = -1;
					self.initshaketype();
				}else if(data.type=='gameneedpay'){
					self.changetip('请先购买参与游戏资格');
					self.hideProgressBox();
					self.hideMask();
					self.shaketype = -1;
					self.initshaketype();
					wechatcore.gamePayrotate(data.rotateid,data.fee,function(){
						appsocket.closeClient();
				   });
				}else if(data.type=='gameisend'){
					self.gamestatus = 3;
				// 	self.myscore = 0;
					self.changetip(self.statustip[3]);
				}else if(data.type=='gameiserror'){
					appsocket.closeClient();
				}else if(data.type=='addblack'){
					data.userid==XCV2Config.userid&&WeixinJSBridge.call('closeWindow');
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
		},
		initshaketype:function(){
			var self = this;
			$(".zam-app-shake-ing").addClass('hidden');
			if(self.shaketype==1){
				$(".zam-app-shake-ing").removeClass('hidden');
			}else{
				self.changeCirclImg();
			}
		},
		bindEvent: function() {
			var self = this;
			if(self.myshakeEvent==null){
				self.myshakeEvent = new Shake({threshold:15});
				self.myshakeEvent.start();
				window.addEventListener('shake',function(){
					self.shakeEvent();
				}, false);
			}else{
				self.myshakeEvent.start();
			}
		},
		shakeEvent: function() {
			var self = this;
			if (self.gamestatus!=2) return;
			self.myscore++;
// 			console.log(self.myscore);
			
// 			self.workerdata();
            self.changetip(self.kh[Math.floor(Math.random()*self.kh.length)]);
			self.senddata({stype:'senddata',score:self.myscore});
			$('.show-myscore span').text(self.myscore);
			wechatcore.playAudio(self.shakeaudio);
		},
		stopShake: function() {//摇不动了
		  var self = this;
		  self.changeCirclImg();
		},
		endshake:function(){//结束
			var self = this;
			self.gamestatus = 3;
			self.changetip(self.statustip[3]);
			$('.show-myscore').addClass('hidden');
			self.stopShake();
			self.showMask();
			self.myshakeEvent.stop();
			self.myscore = 0;
		},
		setprogress:function(percent,score){
			var self = this,p = $(".progress-box"),t = p.find(".totalshakenums"),b = p.find(".progress-bar"),c = p.find(".hadshakenums");
			b.css({"width":percent||"0%"});
			c.text(score||"0");
			t.text(self.maxscore);
			self.showProgressBox();
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'shakestartgame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		changetip:function(tips){
			$('.zam-app-shaketip').text(tips);//.zam-app-shake-over 
		},
		showMask:function(){
			$(".zam-app-shake-over").removeClass('hidden');
		},
		hideMask:function(){
			$(".zam-app-shake-over").addClass('hidden');
		},
		showProgressBox:function(){
			$(".progress-box").removeClass('hidden');
		},
		hideProgressBox:function(){
			$(".progress-box").addClass('hidden');
// 			$(".zam-app-gametime span").text(0);
		},
		showphbbtn:function(rotateid,gamephb){
			var btn = $(".zam-app-shake-over .phb-btn");
			btn.attr({'data-rotateid':rotateid,'data-gamephb':gamephb});
			btn.removeClass('hidden');
		},
		hidephbbtn:function(){
			var btn = $(".money-tips .phb-btn");
			btn.removeClass('hidden');
		},
		changeCirclImg:function(type){
			if(type==1){
				$(".zam-app-shakehand").addClass('shake');
			}else{
				$(".zam-app-shakehand").removeClass('shake');
			}
			
		}
	};
	return appshakestart;
});