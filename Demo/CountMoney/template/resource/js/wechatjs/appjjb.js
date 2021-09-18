define('appjjb',['appsocket','wechatcore','phaser'],function(appsocket,wechatcore){
	var appjjb = {
		rotateid:0,
		gamephb:10,
		gamestatus: 0,
		loadtxt:null,
		progresstxt:null,
		coininc:1,
		boomdec:1,
		gametime:0,
		myscore:0,
		level:0,
		showpmbtn:false,
		gametip:'',
		statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束'],
		init: function() {
			var self = this;
			self.initGame();
			self.closerule = window.localStorage.getItem("closejjbrule-"+XCV2Config.hdid);
			self.bindEvent();
		},
		initsocket:function(){
			var self = this;
			var params={};
			params.onmessage = function(data){
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					wechatcore.closeall();
					$(".rankInfo").remove();
					self.showpmbtn = false;
					self.rotateid = data.rotateid;
					self.initAudio();
					self.gametime = data.gametime;
					self.coininc = data.coininc;
					self.boomdec = data.boomdec;
					if(data.type=='gameiswait'){
						self.gamestatus = 1;
						self.myscore = 0;
						self.gametip = self.statustip[0];
						if(game.state.current!='main'){
							setTimeout(function(){
								game.state.start('main');
							},200);
						}
					}else{
						self.gamestatus = 2;
						self.myscore = data.myscore;
						if(game.state.current=='main'){
							setTimeout(function(){
								game.state.start('game');
							},200);
						}
						self.gametip = self.statustip[2];
					}
				}else if(data.type=='gameiscountdown'){
					var b = $(".appstartdjs"),e = b.find(".appstartdjsBox"),s = b.find(".startdjsani");
					s.text(data.djs>0?data.djs:'GO');
					b.removeClass('hidden');
					self.gametip = self.statustip[1];
					wechatcore.playAudio(self.djsaudio);
					if(data.djs==0){
						self.gametip = self.statustip[2];
						setTimeout(function(){
							game.state.start('game');
						},3e2);
					}
				}else if(data.type=='gameisdjs'){
					self.gamestatus = 2;
					if(self.gamestatus!=3 && game.state.current=='main'){
						setTimeout(function(){
							game.state.start('game');
						},200);
					}
					$(".appstartdjs").addClass('hidden');
					self.gametime = data.djs;
					data.djs==0 && self.endshake();
				}else if(data.type=='gamejjbrefresh'||data.type=='gameappjjbrefresh'){
					appsocket.closeClient();
				}else if(data.type=='gameshowphbbtn'){
					self.gamestatus==3&&self.showphbbtn(data.rotateid,data.gamephb);
				}else if(data.type=='gamenoround'||data.type=='gameislucker'){
					self.gamestatus = 0;
					self.gametip = (data.type=='gamenoround'?'暂无正在进行的轮次':XCV2Config.isluckertxt);
				}else if(data.type=='gamestartnojoin'){
					self.gamestatus = 0;
					self.gametip = '本轮游戏已经开始，无法加入';
				}else if(data.type=='gameneedpay'){
					self.gametip = '请先购买参与游戏资格';
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
			self.djsaudio = $("#djsaudio")[0];
		},
		bindEvent: function() {
			var self = this;
			$(".gamerule a").on('click',function(){
				$('.gamerule').addClass('hidden');
				window.localStorage.setItem("closejjbrule-"+XCV2Config.hdid,'1');
			});
		},
		endshake:function(){
			var self = this;
			self.gamestatus = 3;
			self.gametip = self.statustip[3];
		},
		workerdata:function(){
			var self =this;
			if(self.gamestatus!=2) return;
			self.senddata({stype:'senddata',score:self.myscore});
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'shakegame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		showphbbtn:function(rotateid,gamephb){
			var self = this;
			self.showpmbtn = true;
			self.rotateid = rotateid;
			self.gamephb = gamephb;
		},
		initGame:function(){
			var self = this;
			game = new Phaser.Game(Gameconfig.gameW, Gameconfig.gameH, Phaser.CANVAS, 'zam-app-mainbox');
			game.playAudio = function(audio){
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
			};
			game.States = {
				bootState:{
					init:function () {
						game.musicPause = false;
						game.scale.pagesAlignHorizontally = true;
						game.scale.pageAlignVertically = true;
						game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
					},
					preload:function () {
						game.load.crossOrigin = 'anonymous';
						game.load.image('gamebg',Gameconfig.gameImgs.gamebg);
					},
					create:function () {
						game.state.start('loader');
					}
				},
				loaderState:{
					init:function () {
						this.bg = game.add.sprite(0, 0, 'gamebg');
						this.bg.width = Gameconfig.gameW;
						this.bg.height = Gameconfig.gameH;
						self.loadtext = game.add.text(game.world.centerX,game.world.centerY,'游戏正在加载中..',{fill:'#fff',fontSize:'50px'});
						self.loadtext.anchor.set(0.5);
						self.loadtext.scale.set(0.8);
						self.progresstxt = game.add.text(game.world.centerX,game.world.centerY+50,'0%',{fill:'#fff',fontSize:'30px'});
						self.progresstxt.anchor.set(0.5);
					},
					preload:function(){
						game.load.image('titleimg', Gameconfig.gameImgs.titleimg);
						game.load.image('help', Gameconfig.gameImgs.help);
						game.load.image('popup', Gameconfig.gameImgs.popup);
						game.load.image('player',Gameconfig.gameImgs.player);
						game.load.image('coin', Gameconfig.gameImgs.coin);
						game.load.image('boom', Gameconfig.gameImgs.boom);
						game.load.image('boomed',Gameconfig.gameImgs.boomed );
						game.load.bitmapFont('zimu', Gameconfig.gameImgs.zimu,Gameconfig.gameImgs.zimuxml );
						game.load.image('scorebox',Gameconfig.gameImgs.scorebox );
						game.load.image('timebox',Gameconfig.gameImgs.timebox);
						game.load.image('numbertxt', Gameconfig.gameImgs.numbertxt);
						game.load.image('overbox', Gameconfig.gameImgs.overbox);
						game.load.image('pmbtn',Gameconfig.gameImgs.pmbtn);
						game.load.audio('coinv', Gameconfig.gameImgs.coinv, true);
						game.load.audio('boomv', Gameconfig.gameImgs.boomv, true);
						game.load.audio('overv', Gameconfig.gameImgs.overv, true);
						if(Gameconfig.gameImgs.bgv){
							game.load.audio('bgv', Gameconfig.gameImgs.bgv, true);
						}
						game.load.onFileComplete.add(function(progress){
							self.progresstxt.text = progress+'%';
						});
						game.load.onLoadComplete.add(function () {
							var voices = ['coinv', 'boomv', 'overv'];
							if(Gameconfig.gameImgs.bgv){
								voices.push('bgv');
							}
							game.sound.setDecodedCallback(voices, function () {
								self.loadtext.destroy();
								self.progresstxt.destroy();
								self.closerule!='1' && $(".gamerule").removeClass('hidden');
								game.state.start('main');
								self.initsocket();
							}, this);
						});
					},
				},
				mainState:{
					create:function () {
						this.closeHelp = function () {
							this.helpPopup.visible = false;
						};
						this.showHelp = function () {
							this.helpPopup.visible = true;
						};
						this.bg = game.add.sprite(0, 0, 'gamebg');
						this.bg.width = Gameconfig.gameW;
						this.bg.height = Gameconfig.gameH;
						var titleImg = game.add.image(game.world.centerX,360, 'titleimg');
						titleImg.scale.set(0.7);
						titleImg.anchor.set(0.5,0.5);
						this.gametxt = game.add.text(game.world.centerX,650,'111',{fill:'#fff',fontSize:'42px'});
						this.gametxt.anchor.set(0.5);
						this.player = game.add.sprite(game.world.centerX, game.height - 128 , 'player');
						this.player.anchor.set(0.5, 1);
						this.player.scale.set(0.9);
						this.helpBtn = game.add.button(game.width, 520 , 'help', this.showHelp, this);
						this.helpBtn.anchor.set(1, 0);
						this.helpBtn.width = 86 ;
						this.helpBtn.height = 238 ;
						this.helpPopup = game.add.image(game.world.centerX,game.world.centerY , 'popup');
						this.helpPopup.anchor.set(0.5, 0.5);
						this.helpPopup.scale.set(0.8);
						this.helpPopup.inputEnabled = true;
						this.helpPopup.events.onInputDown.add(this.closeHelp, this);
						this.helpPopup.visible = false;
						if(!game.musicPause && Gameconfig.gameImgs.bgv){
							self.bgm = game.add.audio('bgv', 0.5, true);
							game.playAudio(self.bgm);
							game.musicPause = true;
						}
					},
					update:function(){
						this.gametxt.text = self.gametip;
					},
				},
				gameState:{
					create:function () {
						game.physics.startSystem(Phaser.Physics.ARCADE);
						this.bg = game.add.sprite(0, 0, 'gamebg');
						this.bg.width = Gameconfig.gameW;
						this.bg.height = Gameconfig.gameH;
						this.player = game.add.sprite(game.world.centerX, game.height - 178 , 'player');
						this.player.anchor.set(0.5, 1);
						this.player.scale.set(0.9);
						game.physics.arcade.enable(this.player);
						this.player.body.collideWorldBounds = true;
						this.onStart();
						this.showScore = game.add.sprite();
						this.scoreBox = game.add.sprite(25 , 8 , 'scorebox');
						this.showScore.addChild(this.scoreBox);
						this.score = game.add.retroFont('numbertxt', 32, 62, "0123456789", 10, 0, 0);
						this.score.setFixedWidth(160, Phaser.RetroFont.ALIGN_RIGHT);
						this.score.text = "0";
						this.num = game.add.image(100 ,46 , this.score);
						this.num.scale.set(0.8);
						this.showScore.addChild(this.num);
						this.showScore.bringToTop();
						this.showScore.visible = Gameconfig.showscorebox=='1'?true:false;
						this.showTime = game.add.sprite();
						this.timeBox = game.add.sprite(game.width - 270 , 8 , 'timebox');
						this.showTime.addChild(this.timeBox);
						this.gametime = game.add.retroFont('numbertxt', 32, 62, "0123456789", 10, 0, 0);
						this.gametime.setFixedWidth(160, Phaser.RetroFont.ALIGN_RIGHT);
						this.gametime.text = "30";
						this.gamesecond = game.add.image(game.width - 200 , 46 , this.gametime);
						this.gamesecond.scale.set(0.8);
						this.showTime.addChild(this.gamesecond);
						this.showTime.bringToTop();
						this.coinbgm = game.add.audio('coinv', 0.2, false);
						this.boombgm = game.add.audio('boomv', 0.2, false);
						this.overbgm = game.add.audio('overv', 0.2, false);
						this.overPopup = game.add.group();
						this.overBox = game.add.image(game.world.centerX,game.world.centerY, 'overbox');
						this.overBox.scale.set(0.7);
						this.overBox.anchor.set(0.5,0.5);
						this.overPopup.add(this.overBox);
						this.overscore = game.add.retroFont('numbertxt', 32, 62, "0123456789", 10, 0, 0);
						this.overnum = game.add.image(game.world.centerX + 50,game.world.centerY - 88, this.overscore);
						this.overnum.scale.set(1);
						this.overPopup.add(this.overnum);
						this.pmbtn = game.add.button(game.world.centerX,game.world.centerY + 100, 'pmbtn', function () {
							this.overbgm.stop();
							wechatcore.ajaxSubmit('wechat.common.getgamerotatephb',{gametype:XCV2Config.gametype,rotateid:self.rotateid,gamephb:self.gamephb},'正在获取排行榜数据').then(function(data){
								 if(data.errno==0){
									 if(data.message.length>0){
										 $("body").append(wechatcore.tpl($("#phb-tpl"),{list:data.message}));
										 $("body .rank-close").click(function(){
												$(this).parent().parent().remove();
										 });
									 }else{
										wechatcore.msg('暂无数据');
									 }
								 }else{
									wechatcore.msg(data.message);
								 }
							}, function(){
								  wechatcore.msg('网络太差，请稍后重试');
							});
						}, this);
						this.pmbtn.scale.set(0.7);
						this.pmbtn.anchor.set(0.5,0.5);
						this.pmbtn.visible = false;
						this.overPopup.add(this.pmbtn);
						this.overPopup.visible = false;
					},
					onStart:function () {
						game.time.events.start();
						this.player.inputEnabled = true;
						this.player.input.enableDrag(false);
						this.player.input.allowVerticalDrag = false;
						var drop = {
							dropcomb: {
								game: this,
								selfPic: "coin",
								makeCount: 30,
								velocity: 400,
								acceleration: 200,
								angularVelocity: 0,
								selfTimeInterval: 0.4
							},
							dropboom: {
								game: this,
								selfPic: "boom",
								makeCount: 15,
								velocity: 350,
								acceleration: 200,
								angularVelocity: 50,
								selfTimeInterval: 0.9
							}
						};
						this.acomb = new Drop(drop.dropcomb);
						this.acomb.init();
						this.aboom = new Drop(drop.dropboom);
						this.aboom.init();
					},
					showOverPopup:function () {
						var _this = this;
						if(self.bgm){
							self.bgm.stop();
							game.musicPause = false;
						}
						setTimeout(function () {
							_this.overPopup.visible = true;
							game.playAudio(_this.overbgm);
						},400);
					},
					stopGame:function () {
						this.player.inputEnabled = false;
						game.time.events.stop(false);
						this.acomb.drops.setAll('body.velocity.y', 0);
						this.acomb.drops.setAll('body.acceleration.y', 0);
						this.aboom.drops.setAll('body.velocity.y', 0);
						this.aboom.drops.setAll('body.acceleration.y', 0);
						this.acomb.hideDrops();
						this.aboom.hideDrops();
						this.showOverPopup();
						this.overscore.text = "" + self.myscore;
					},
					setLevel:function () {
						if(self.gametime >= 60){
							self.level = 50;
						}else if(self.gametime < 60 && self.gametime >= 50){
							self.level = 100;
							this.acomb.loopevent.delay = 350;
							this.aboom.loopevent.delay = 800;
						}else if(self.gametime < 50 && self.gametime >= 40){
							self.level = 150;
							this.acomb.loopevent.delay = 300;
							this.aboom.loopevent.delay = 700;
						}else if(self.gametime < 40 && self.gametime >= 30){
							self.level = 200;
							this.acomb.loopevent.delay = 250;
							this.aboom.loopevent.delay = 600;
						}else if(self.gametime < 30 && self.gametime >= 20){
							self.level = 250;
							this.acomb.loopevent.delay = 200;
							this.aboom.loopevent.delay = 500;
						}else if(self.gametime < 10 && self.gametime >= 0){
							self.level = 500;
							this.acomb.loopevent.delay = 100;
							this.aboom.loopevent.delay = 200;
						}
					},
					crashDrops:function (player, drop) {
						 if (self.gamestatus==2 && (drop.key=='coin' || drop.key=='boom')){
							 if(drop.key === "coin") {
								game.playAudio(this.coinbgm);
								self.myscore += parseInt(self.coininc);
							  } else if(drop.key === "boom") {
								game.playAudio(this.boombgm);
								self.myscore -= parseInt(self.boomdec);
								if(self.myscore < 0){
									self.myscore = 0;
								}
							  }
							  this.getCoinsAni(drop);
							  drop.kill();
							  this.setLevel();
							  self.workerdata();
						}
					},
					getCoinsAni:function(obj,num){
						if(obj.key === "coin") {
							var goal = game.add.bitmapText(obj.x , obj.y, 'zimu','+'+self.coininc, 90);
							goal.alpha = 0;
							goal.anchor.set(0.5);
						}else{
							var goal = game.add.image(obj.x, obj.y,'boomed');
							var goalImg = game.cache.getImage('boomed');
							goal.width = obj.width;
							goal.height = goal.width / (goalImg.width / goalImg.height);
							goal.alpha = 0;
							goal.anchor.set(0.5,0.5);
							goal.scale.set(0.6);
						}
						var showTween = game.add.tween(goal).to({
							alpha: 1,
							y: goal.y - 20
						}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
						showTween.onComplete.add(function() {
							var hideTween = game.add.tween(goal).to({
								alpha: 0,
								y: goal.y - 20
							}, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
							hideTween.onComplete.add(function() {
								goal.kill();
							});
						});
					},
					gameEnd:function(){
						this.coinbgm.stop();
						this.boombgm.stop();
						this.stopGame();
					},
					update:function () {
						this.acomb && game.physics.arcade.overlap(this.acomb.drops, this.player, this.crashDrops, null, this);
						this.aboom && game.physics.arcade.overlap(this.aboom.drops, this.player, this.crashDrops, null, this);
						this.score.text = "" + self.myscore;
						this.gametime.text = "" + self.gametime;
						if(this.player.inputEnabled && self.gamestatus==3 && self.gametime==0){
							 this.gameEnd();
						}
						self.showpmbtn ? (this.pmbtn.visible = true) : (this.pmbtn.visible = false);
					}
				}
			};
			game.state.add('boot', game.States.bootState);
			game.state.add('loader', game.States.loaderState);
			game.state.add('main', game.States.mainState);
			game.state.add('game', game.States.gameState);
			game.state.start('boot');
			function Drop(config) {
				this.init = function () {
					this.drops = game.add.group();
					this.drops.enableBody = true;
					this.drops.createMultiple(config.makeCount, config.selfPic);
					this.drops.setAll('outOfBoundsKill', true);
					this.drops.setAll('checkWorldBounds', true);
					this.maxWidth = game.width - 115 ;
					this.loopevent = game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval, this.generateDrop, this);
				};
				this.generateDrop = function () {
					var e = this.drops.getFirstExists(false);
					if (e) {
						e.reset(game.rnd.integerInRange(20, this.maxWidth), -game.cache.getImage(config.selfPic).height);
						e.body.velocity.y = config.velocity + self.level;
						e.body.acceleration.y = config.acceleration;
					}
				};
				this.hideDrops = function(){
					var e = this.drops;
					e.visible = false; 
				};
			}
		},
	};
	return appjjb;
});
