define('appgame',['appsocket','jquery.shake','wechatcore','touch'],function(appsocket,Shake,wechatcore,touch){
	var angle = 0,totalAngle = 0,tempAngle = 0;
	var appgame = {
		rotateid:0,
		gamestatus: 0,
		shaketype:-1,
		statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束'],
		gameInterval:null,
		myscore: 0,
		maxscore: 120,
		myshakeEvent:null,
		kh:['加油啊','看什么看，速度了','别停啊，伙计','加油~加油'],
		init: function() {
			var self = this;
			var params={};
			params.onmessage = function(data){
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.hideMask();//隐藏mask
					self.rotateid = data.rotateid;
					self.shaketype = data.shaketype;
					self.initshaketype();
					$(".zam-app-gametime span").text(data.gametime);
					self.maxscore = data.maxscore;
					self.initAudio();
					self.bindEvent();
					if(data.type=='gameiswait'){
						self.gamestatus = 1;
						self.myscore = 0;
						var tips = self.statustip[0];
					}else{
						self.gamestatus = 2;
						self.myscore = data.myscore;
						var tips = self.statustip[2];
					}
					var percent = ((self.myscore/self.maxscore).toFixed(2)*100)+"%";
					self.setprogress(percent,self.myscore);//设置progress并显示
					self.changetip(tips);
				}else if(data.type=='gameiscountdown'){
					var b = $(".appstartdjs"),e = b.find(".appstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					b.removeClass('hidden');
					self.changetip(self.statustip[1]);
					wechatcore.playAudio(self.djsaudio);
					data.djs==0&&self.changetip(self.statustip[2]);
				}else if(data.type=='gameisdjs'){
					self.gamestatus = 2;
					$(".appstartdjs").addClass('hidden');
					$(".zam-app-gametime span").text(data.djs);
					data.djs==0&&self.endshake();
				}else if(data.type=='gameshakerefresh'||data.type=='gameappshakerefresh'){
					appsocket.closeClient();
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
		},
		initshaketype:function(){
			var self = this;
			$(".zam-app-shake-ing,.zam-app-click-ing,.zam-app-rotate-ing").addClass('hidden');
			if(self.shaketype==1){
				$(".zam-app-shake-ing").removeClass('hidden');
			}else if(self.shaketype==2){
				$(".zam-app-click-ing").removeClass('hidden');
			}else if(self.shaketype==3){
				$(".zam-app-rotate-ing").removeClass('hidden');
			}else{
				$("#rotate").css({'transform':'rotate(0deg)','-webkit-transform':'rotate(0deg)'});
				self.gameInterval!=null&&clearInterval(self.gameInterval);
			}
		},
		bindEvent: function() {
			var self = this;
			if(self.shaketype==1){
				if(self.myshakeEvent==null){
					self.myshakeEvent = new Shake({threshold:15});
					self.myshakeEvent.start();
					window.addEventListener('shake',function(){
						self.shakeEvent();
					}, false);
				}else{
					self.myshakeEvent.start();
				}
			}else if(self.shaketype==2){
				self.clickEvent();
			}else{
				self.gameInterval!=null&&clearInterval(self.gameInterval);
				self.rotateEvent();
			}
		},
		clickEvent:function(){
			var self = this;
			$('.zam-app-clickimg').off('click').on('click',function(){
				if (self.gamestatus!=2) return ;
				$(this).hide();
				$('.zam-app-clickedimg').removeClass('hidden');
				setTimeout(function(){
					$('.zam-app-clickedimg').addClass('hidden');
					$('.zam-app-clickimg').show();
				},3e2);
				self.myscore++;
				self.workerdata();
			})
			$('.zam-app-clickedimg').off('click').on('click',function(){
				if (self.gamestatus!=2) return ;
				$(this).addClass('hidden');
				$('.zam-app-clickimg').show();
			})
		},
		rotateEvent:function(){
			var self = this;
			tempAngle = 0;
			totalAngle = 0;
			touch.on('#rotate', 'touchstart', function(ev){
				if (self.gamestatus!=2) return;
				ev.startRotate();
				ev.originEvent.preventDefault();
			});
			touch.on('#rotate','rotate',function(ev){
				if (self.gamestatus!=2) return;
				totalAngle = angle + ev.rotation;
				if(ev.fingerStatus === 'end') {//停下来的时候 记住当时的角度
					angle = angle + ev.rotation;
					tempAngle = 0;
					totalAngle = 0;
				}
				this.style.webkitTransform = 'rotate(' + (ev.rotation % 360) + 'deg)';
			})
			self.gameInterval = setInterval(function(){
				if (self.gamestatus!=2) return;
				if(totalAngle > 0 && tempAngle!=totalAngle && totalAngle - tempAngle >= 360){
					tempAngle = totalAngle;
					self.myscore++;
					self.workerdata();
				}
			},300);
		},
		shakeEvent: function() {
			var self = this;
			if (self.gamestatus!=2) return;
			self.myscore++;
			self.workerdata();
		},
		stopShake: function() {//摇不动了
		  var self = this;
		  if(self.shaketype==2){
			 $('.zam-app-clickedimg').addClass('hidden');
			 $('.zam-app-clickimg').show();
		  }else if(self.shaketype==3){
			 $("#rotate").css({'transform':'rotate(0deg)','-webkit-transform':'rotate(0deg)'});
			 self.gameInterval!=null&&clearInterval(self.gameInterval);
		  }
		},
		endshake:function(){//结束
			var self = this;
			self.gamestatus = 3;
			self.changetip(self.statustip[3]);
			self.stopShake();
			self.showMask();
			if(self.shaketype==1){
				self.myshakeEvent.stop();
			}else if(self.shaketype==3){
				touch.off('#rotate', 'touchstart');
				touch.off('#rotate', 'rotate');
			}
			self.myscore = 0;
		},
		setprogress:function(percent,score){
			var self = this,p = $(".progress-box"),t = p.find(".totalshakenums"),b = p.find(".progress-bar"),c = p.find(".hadshakenums");
			b.css({"width":percent||"0%"});
			c.text(score||"0");
			t.text(self.maxscore);
			self.showProgressBox();
		},
		workerdata:function(){
			var self =this;
			if(self.myscore>self.maxscore){
				self.stopShake();
				self.setprogress("100%",self.maxscore);
			}else{
				self.changetip(self.kh[Math.floor(Math.random()*self.kh.length)]);
				self.senddata({stype:'senddata',score:self.myscore});
				self.setprogress(((self.myscore/self.maxscore).toFixed(2)*100)+"%",self.myscore);
				if(self.shaketype==1){
					wechatcore.playAudio(self.shakeaudio);
					wechatcore.anicss('.zam-app-shakehand','shake');
				}
			}
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'shakegame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		changetip:function(tips){
			$('.zam-app-shaketip').text(tips);
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
			$(".zam-app-gametime span").text(0);
		},
		showphbbtn:function(rotateid,gamephb){
			var btn = $(".zam-app-shake-over .phb-btn");
			btn.attr({'data-rotateid':rotateid,'data-gamephb':gamephb});
			btn.removeClass('hidden');
		},
		hidephbbtn:function(){
			var btn = $(".money-tips .phb-btn");
			btn.removeClass('hidden');
		}
	};
	return appgame;
});
