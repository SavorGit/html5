define('screenthreed',['screencore','template','keyboard','snabbt'],function(screencore,template,keyboardJS){
var screenthreed = {
	qdusers:[],
	oldloaded:false,
	newqdusers:[],
	lastid:0,
	avatartype:Threeconfig.avatartype,
	animations:Threeconfig.animations,
	tempAnimations:Threeconfig.animations,
	countAnimations:[],
	stageObj: $(".three3d ul"),
	shape:'',
	nullCount:0,
	defaultAvatar:Threeconfig.defaultAvatar,
	sysavatar:[],
	ajaxtime:Threeconfig.ajaxtime,
	loopTime:Threeconfig.loopTime,
	shapeTime:Threeconfig.shapeTime,
	isImg:!0,
	showCount:false,
	shapeCount:0,
	Utils:{},
	Stage:{},
	Control:{},
	Card:{},
	wall:{},
	sphere:{},
	wall2:{},
	cylinder:{},
	cube:{},
	cube2:{},
	screw:{},
	deg:function(o) {
		return Math.PI / 180 * o
	},
	Countobj:[],
	Logoobj:[],
	Textobj:[],
	posfrom:[
			[800,-800,3e3],
			[800,800,3e3],
			[-800,800,3e3],
			[-800,-800,3e3],
	],
	leavepos:[[0,-800,0],[0,800,0]],
	leaveposindex:0,
	init:function(){
		var self = this;
		self.Configinit();
		self.Utils = self.makeUtils();
		self.Stage = self.makeStage();
		self.Control = self.makeControl();
		self.wall = self.makeWall();
		self.sphere = self.makeSphere();
		self.wall2 = self.makeWall2();
		self.sphere = self.makeSphere();
		self.cylinder = self.makeCylinder();
		self.cube = self.makeCube();
		self.cube2 = self.makeCube2();
		self.screw = self.makeScrew();
		self.tours = self.makeTours();
		self.signRender = template('sign-tpl');
		self.getolduser();
		var checkloaded = setInterval(function(){
			if(self.oldloaded){
				clearInterval(checkloaded);
				self.hadready();
			}
		},50)
	},
	Configinit: function(){
		var e = this;
		if(e.animations.length>0){
			var shapes = Threeconfig.shapes;
			for(var jj=0;jj<shapes.length;jj++){
				var shapetype = shapes[jj].shape;
				var shapename = shapes[jj].shapename;
				var shapedots = shapes[jj].shapedots;
				if(shapetype=='text'){
					e[shapename] = e.makeText(JSON.parse(shapedots));
				}else if(shapetype=='logo'){
					e[shapename] = e.makeLogo(JSON.parse(shapedots));
				}
			}
		}
		if(Threeconfig.djsCount>0 && Threeconfig.djsOn==1){
			var djscountAnimation = Threeconfig.countAnimations;
			for(var i in djscountAnimation){
				e.countAnimations.push(i);
				e[i] = e.makeCount(JSON.parse(djscountAnimation[i]));
			}
			keyboardJS.bind('space', function() {
				e.CountControl();
			});
		}
	},
	hadready:function(){
		var self = this;
		self.Card = self.makeCard();
		self.changeMode();
		setTimeout(function(){ 
			self.getNewuser();
			self.showuser();
		}, 3000);
	},
	djsPlay:function(){
		$("#countaudio")[0].play()
	},
	makeStage:function() {
		var self = this;
		var o = {
			fromRotation: [0, 0, 0],
			rotation: [0, 2 * Math.PI, 0],
			duration: 35e3,
			complete: function() {
				i()
			}
		},
		i = function() {
			self.Stage.stop(), self.Stage.snabbt(o)
		};
		return {//          stage 
			default:function(n, e) {
				n.transformOrigin || (n.transformOrigin = [0, 0, 0]), n.duration || (n.duration = Threeconfig.shapeTime),Object.keys(n).forEach(function(i) {
					o[i] = n[i]
				}),o.complete = e, self.Stage.snabbt({
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					duration: 400,
					complete: i
				})
			}, 
			snabbt: self.stageObj.snabbt.bind(self.stageObj),
			stop: function() {
				self.stageObj.snabbt("stop")
			},
			reset: function(o) {
				self.stageObj.css("transform", "")
			}
		}
	},
	makeControl:function() {
		var self = this;
		var o = function() {
			var o = self.shape;
			if(o=='count1'){
				self.animations = self.tempAnimations;
				self.showCount = false;
				o = false;
			}
			if (!o) return void self.changeMode();
			self.shapeCount++,(o.indexOf('count')==-1?self.changeMode(self.animations[self.shapeCount]):self.changeCountMode(self.animations[self.shapeCount]));
		};
		return {
			next: o
		}
	},
	makeUtils:function() {
		var self = this;
		var o = window.innerWidth,
			i = window.innerHeight,
			n = [],
			e = 0,
			s = function() {
				if (n.length && !(e > 2)) {
					++e;
					var o = n.shift(),
						i = o.item,
						t = o.url,
						a = new Image;
					a.onload = function() {
						i.append(a),$(a).fadeIn(), --e, setTimeout(s,10)
					}, a.onerror = function() {
						--e, setTimeout(s,10)
					}, a.src = t, setTimeout(s,10)
				}
			};
		return {
			width: o,
			height: i,
			in:function() {
				if(self.leaveposindex >= self.leavepos.length){
					self.leaveposindex = 0;										
				}
				var o = $.Deferred(),
					i = self.stageObj.find("li");
				var inpos = {};
				inpos.position = self.leavepos[self.leaveposindex];
				inpos.duration = 500;
				inpos.allDone =  function(){
					self.leaveposindex++,o.resolve();
				}
				return i.length ? (self.Stage.stop(), i.snabbt(inpos)) : o.resolve(), o.promise();
			},
			leave: function() {
				if(self.leaveposindex >= self.leavepos.length){
					self.leaveposindex = 0;										
				}
				var o = $.Deferred(),
					i = self.stageObj.find("li");
				var leavepos = {};
				leavepos.position = self.leavepos[self.leaveposindex];
				leavepos.duration = 500;
				leavepos.delay = function(o, i) {
						return 1e3 * Math.random()
				};
				leavepos.allDone =  o.resolve;
				return i.length ? (self.Stage.stop(), i.snabbt(leavepos)) : o.resolve(), o.promise()
			},
			loadImg: function(o) {
				n.push(o), s()
			}
		}
	},
	random:function(begin,end){
		var num = Math.round(Math.random()*(end-begin)+begin);
		return num;
	},
	makeCard:function() {
		var self = this;
		var o = -1,
			i = [],
			n = function(key) {
				var o = $('<li class="card"></li>'),
					n = 335 * Math.random() | 0;
					if(self.isImg){
						if(self.avatartype==1){
							var avatar = self.qdusers[key]?self.qdusers[key].avatar:(self.qdusers.length>0?self.qdusers[Math.floor(Math.random()*self.qdusers.length)].avatar:self.defaultAvatar);
						}else{
							if(self.avatartype==2){
								var avatar = self.qdusers[key]?self.qdusers[key].avatar:self.sysavatar[Math.floor(Math.random()*self.sysavatar.length)].avatar;
							}else{
								var avatar = self.qdusers[key]?self.qdusers[key].avatar:self.defaultAvatar;
							}
						}
						self.Utils.loadImg({
							item: o,
							url:avatar
						})
					}
					i.push(o);
					self.stageObj.append(o);
					if(!self.qdusers[key]){
						o.attr('data-avatar','none');
					}else{
						var html = '';
						var user = self.qdusers[key];
						o.attr({
						   "data-avatar" : 'had',
						   "data-padding" : 'Y',
						   "data-nickname" :user.nickname ,
						   "data-src" : user.avatar
						});
					}
			};
		return {
			count: function() {
				return i.length;
			},
			init: function(o) {
				var t = o - i.length;
				if (t > 0){
					for (var e = i.length; e < o; e++){
						n(e);
					}
				}
			},
			reset: function() {
				o = -1, $("li.card").removeClass("activate")
			},
			next: function() {
				if (++o, i[o]) return i[o]
			}
		}
	},
	makeWall:function() {
		var self = this;
		for (var o = [], i = h = 50 * Math.sqrt(2), n = self.Utils.height / h | 0, e = self.Utils.width / i | 0, s = 0; s < n; s++) for (var a = 0; a < e; a++) {
			var l = (e - 1) / 2 - a,
				r = (n - 1) / 2 - s;
			o.push({
				position: [l * i, r * h, 0],
				rotation: [0, 0, Math.PI / 4]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: {
				position: [0, 0, 0],
				duration: self.shapeTime
			}
		}
	},
	makeWall2:function() {
		var self = this;
		for (var o = [], i = h = 55 * Math.sqrt(2), n = 17, e = 20, s = 0; s < n; s++) for (var a = 0; a < e; a++) {
			var l = (e - 1) / 2 - a,
				r = (n - 1) / 2 - s,
				c = 0;
			s % 2 == 0 && (c = h / 2), o.push({
				position: [l * i + c, r * h / 2, 0],
				rotation: [0, 0, Math.PI / 4]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: function(o) {
				self.stageObj.snabbt({
					position: [0, 0, -200],
					rotation: [0, 0, 0],
					duration: 0
				});
				walltwoTime = setTimeout(o, self.shapeTime);
				var i = function() {};
				return i;
			}
		}
	},
	makeLogo:function(e) {
		var self = this;
		var o = [];							
		for (var a = 0; a < e.length; a++) {
			o.push({
				position: [ e[a].x,  e[a].y, 0],
				rotation: [0, 0, 0]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 2e3
			},
			
			stage: function(o) {
				self.stageObj.snabbt({
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					duration: 0
				});
				logoTime = setTimeout(o,self.shapeTime); 
				var i = function() {};
				return  i;
			}
			
		}
	},
	makeText:function(e) {
		var self = this;
		var o = [];							
		for (var a = 0; a < e.length; a++) {
			o.push({
				position: [ e[a].x,  e[a].y, 0],
				rotation: [0, 0, 0]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 1e3
			},
			stage: function(o) {
				self.stageObj.snabbt({
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					duration: 0
				});
				textTime = setTimeout(o,self.shapeTime);
				var i = function() {};
				return i;
			}
			
		}
	},
	makeCount:function(e) {
		var self = this;
		var o = [];							
		for (var a = 0; a < e.length; a++) {
			o.push({
				position: [ e[a].x,  e[a].y, 0],
				rotation: [0, 0, 0]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective:100
			},
			stage: function(o) {
				self.stageObj.snabbt({
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					duration: 0
				});
				countTime = setTimeout(o, 1e3);
				var i = function() {};
				return  i;
			}
			
		}
	},
	makeSphere:function() {
		var self =  this;
		for (var o = [], t = 380, e = 16, s = 30, a = {}, l = e / 2 | 0, r = 0; r < e; r++) {
			var c = (Math.sin(Math.PI / (e - 1) * r) * s | 0) + 1;
			a[r] = c
		}
		return Object.keys(a).forEach(function(i) {
			for (var s = l - i, r = a[i], c = 0; c < r; c++) {
				var p = 180 / e * s,
					u = 360 / r * c;
				1 == r && (p = p > 0 ? 90 : -90);
				var d = i * self.deg(180 / (e - 1)),
					f = c * self.deg(360 / r),
					h = t * Math.sin(d) * Math.cos(f),
					g = t * Math.sin(d) * Math.sin(f),
					v = .9 * t * Math.cos(d);
				o.push({
					rotation: [-self.deg(p), -self.deg(u), 0],
					position: [g, -v, h]
				})
			}
		}), {
			card: {
				count: o.length,
				allCard: o,
				perspective: 2e3
			},
			stage: {
				position: [0, 0, 0],
				duration: self.shapeTime
			}
		}
	},
	makeTours:function(){
			var self = this;
			var o = [];							
			var deg = function(o) {
				return Math.PI / 180 * o
			};
			var e = 360;
			var s = 10;
			var a = 15;
			var l = self.Utils.width/(a*6);
			var r = 360 / a;
			for ( var c = 0; c < s; c++){
				for (var u = 0; u < a; u++) {
						var p = s / 2 | 0,
						d = a / 2 | 0,
						f = deg(r * u),
						x = e * Math.cos(f),
						y = e * Math.sin(f),
						z = (c - p) * a * l + (u - d) * l;
						o.push({
							position: [x, y, z],
							rotation: [0, 0, 0],
							
						})
				}
			}
			return {
				card: {
					count: o.length,
					allCard: o,
					perspective:100
				},
				stage: function(o) {
					var i = function() {
						self.Stage.snabbt({
							fromRotation: [0, 0, 0],
							rotation: [0, 0, 2 * Math.PI],
							duration: self.shapeTime,
							complete: function() {
								o && o()
							}
						})
					};
					return i
				}
				
			}
			
	},
	makeCylinder:function() {
		var self = this;
		for (var o = [], i = 500, t = 500, e = 7, s = 45, a = t / e | 0, l = e / 2 | 0, r = 0; r < e; r++) for (var c = 360 / s, p = 0; p < s; p++) {
			var u = 0,
				d = 0,
				f = 0,
				h = 0;
			u = i * Math.sin(self.deg(p * c)), d = (r - l) * a, f = i * Math.cos(self.deg(p * c)), h = p * c, o.push({
				position: [u, d, f],
				rotation: [0, -self.deg(h), 0]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: {
				position: [0, 0, 0],
				duration: self.shapeTime
			}
		}
	},
	makeCube:function() {
		var self = this;
		for (var o = [], i = h = d = 100, t = 5, n = 9, e = 8, s = 0; s < e; s++) for (var a = 0; a < t; a++) for (var l = 0; l < n; l++) {
			var r = (n - 1) / 2 - l,
				c = (t - 1) / 2 - a,
				p = (e - 1) / 2 - s;
			o.push({
				position: [r * i, c * h, p * d],
				rotation: [0, 0, 0]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: {
				position: [0, 0, 0],
				duration: self.shapeTime
			}
		}
	},
	makeCube2:function() {
		var self = this;
		for (var o = [], i = 9, n = 57, e = (length / 2, []), s = [], a = [], l = 0; l < i; l++) for (var r = 0; r < i; r++) {
			var c = (i - 1) / 2,
				p = (c - l) * n,
				u = (c - r) * n,
				d = c * n + n / 2;
			e.push({
				position: [p, u, d],
				rotation: [0, 0, 0]
			}), e.push({
				position: [p, u, -d],
				rotation: [Math.PI, 0, 0]
			}), s.push({
				position: [-d, p, u],
				rotation: [0, Math.PI / 2, 0]
			}), s.push({
				position: [d, p, u],
				rotation: [0, -Math.PI / 2 * 3, Math.PI]
			}), a.push({
				position: [u, -d, p],
				rotation: [Math.PI / 2 * 3, 0, 0]
			}), a.push({
				position: [u, d, p],
				rotation: [Math.PI / 2, 0, 0]
			})
		}
		return o = e.concat(s, a), {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: function(o) {
				var i = function() {
					self.Stage.snabbt({
						fromRotation: [0, 0, 0],
						rotation: [2 * Math.PI, 2 * Math.PI, 0],
						duration: self.shapeTime,
						complete: function() {
							o && o()
						}
					})
				};
				return i;
			}
		}
	},
	makeScrew:function() {
		var self = this;
		for (var o = [], e = 300, s = 7, a = 25, l = self.Utils.width / s / a, r = 360 / a, c = 0; c < s; c++) for (var p = s / 2 | 0, u = 0; u < a; u++) {
			var d = a / 2 | 0,
				f = self.deg(r * u),
				h = (c - p) * a * l + (u - d) * l,
				g = e * Math.sin(f),
				v = e * Math.cos(f),
				m = f,
				b = 0,
				w = 0;
			o.push({
				position: [h, g, v],
				rotation: [m, b, w],
				skew: [0, self.deg(6)]
			})
		}
		return {
			card: {
				count: o.length,
				allCard: o,
				perspective: 3500
			},
			stage: function(o) {
				var n = function() {
					self.Stage.snabbt({
						fromRotation: [0, 0, 0],
						rotation: [2 * Math.PI, 0, 0],
						duration: self.shapeTime,
						complete: function() {
							n()
						}
					})
				};
				screwTime = setTimeout(o, self.shapeTime);
				return  n;
			}
		}
	},
	CountControl:function(){
	  var self = this;
	  if(!self.showCount){
		self.showCount = true;
		$('.threedb-mainbox .new-sign').hide();
		self.animations = self.countAnimations;
		self.Stage.stop();
		self.Card.reset();
		clearTimeout(textTime);
		clearTimeout(logoTime);
		clearTimeout(screwTime);
		clearTimeout(walltwoTime);
		clearTimeout(countTime);
		self.changeCountMode();
	  }
	},
	Build:function() {
		var self = this;
		var o = self[self.shape];
		if (o) {
			var i = o.stage,
				n = o.card,
				e = function() {};
			if (i && "function" == typeof i ? e = i(self.Control.next) : self.Stage.default (i, self.Control.next), n) {
				self.Card.reset();
				for (var s = 0, a = 0; a < n.count; a++) {
					var l = self.Card.next();
					if (l) {
						l.addClass("activate");
						var r = n.allCard[a];
						Object.keys(r).forEach(function(o) {
							l.data("data-" + o, r[o])
						});
						var c = {
							rotation: r.rotation,
							position: r.position,
							scale: r.scale || [1, 1],
							complete: function() {
								++s, s == n.count && e()
							}
						};
						if(self.shape.indexOf('count')==-1){
							c.duration = 500;
							c.delay = 1e3 * Math.random();
						}else{
							c.duration = 0;
						}
						r.skew || (r.skew = [0, 0]), c.skew = r.skew, l.snabbt(c)
					}
				}
			}
		}
	},
	changeMode:function(shape) {
		var self = this;
		if(!shape){
			self.shapeCount = 0;
			shape = self.animations[0];
		}
		self.Utils.leave().then(function() {
			self.stageObj.removeClass(self.shape);
			self.shape = shape;
			var i = self[shape];
			self.Card.init(i.card.count);
			self.stageObj.addClass(shape);
			self.Utils.in().then(function() {
				self.Build();
			})
		})
	},
	changeCountMode:function(o) {
		var self = this;
		if(!o){
			self.shapeCount = 0;
			o = self.animations[0];
		}
		self.stageObj.removeClass(self.shape),self.shape = o,self.stageObj.addClass(self.shape);
		var i = self[self.shape];
		self.djsPlay();
		self.Card.init(i.card.count),self.Build();	
	},
	getolduser:function(){
		var self = this;
		screencore.ajaxSubmit('screen.threed.historysign',{bdinfo:XCV2Config.bdinfo},'正在加载历史签到数据').then(function(data){
			var ajaxsigns = data.message.list;
			var signLength = ajaxsigns.length;
			if(signLength>0){
				self.lastid = ajaxsigns[0].id;
				ajaxsigns = ajaxsigns.reverse();
				self.qdusers = ajaxsigns;
				$(".signnum .count").text(data.message.num);
			}
			self.sysavatar = data.message.sysuser;
			self.oldloaded = true;
		}, function(){
			console.log('网络太差，请稍后重试.');
		});
	},
	getNewuser:function(){
		var self = this;
		screencore.ajaxSubmit('screen.threed.newsign',{bdinfo:XCV2Config.bdinfo,lastid:self.lastid}).then(function(data){
				var ajaxmsgs = data.message.message;
				var newsignLength = ajaxmsgs.length;
				if(newsignLength>0){
					self.lastid = ajaxmsgs[0].id;
					ajaxmsgs = ajaxmsgs.reverse();
					for (var m=0;m<newsignLength;m++) {
						var oneMsg = ajaxmsgs[m];
						self.qdusers.push(oneMsg);
						self.newqdusers.push(oneMsg);
					};
					$(".signnum .count").text(data.message.total);
				}
				setTimeout(function(){
						self.getNewuser();
				}, self.ajaxtime); 
		}, function(){
			setTimeout(function(){
				self.getNewuser();
			}, self.ajaxtime);
		});
	},
	showuser:function(){
		var self =  this;
		if(self.shape.indexOf('count')!=-1){
			return setTimeout(function(){self.showuser()}, self.loopTime);
		}
		var newUser = self.newqdusers.shift();
		if("undefined" != typeof newUser){ 
			var i = $(".three3d li.activate").filter(function(o, i) {
				return "Y" != $(i).attr("data-padding")
			});
			var j = $(".three3d li.activate").filter(function(o, i) {
				return "none" == $(i).attr("data-avatar")
			});
			if(i.length>0){
			  if(j.length>0){
				  var a = j.eq(Math.floor(Math.random()*j.length));
				  self.showNewuser(a,newUser);
			  }else{
				  var a = i.eq(Math.floor(Math.random()*i.length));
				  self.showNewuser(a,newUser);
			  }
			}else{
			  if(j.length==0){
				$(".three3d li.activate").attr('data-padding','N');
				i = $(".three3d li.activate").filter(function(o, i) {
					return "Y" != $(i).attr("data-padding")
				});
				var a = i.eq(Math.floor(Math.random()*i.length));
				self.showNewuser(a,newUser);
			  }else{
				var a = j.eq(Math.floor(Math.random()*j.length));
				self.showNewuser(a,newUser);
			  }
			}
		}else{
		  self.nullCount++;
		  if(self.qdusers.length>0){
			  var oldUser = self.qdusers[Math.floor(Math.random()*self.qdusers.length)];
			  if(self.nullCount>1){
					var i = $(".three3d li.activate").filter(function(o, i) {
						return "Y" != $(i).attr("data-padding")
					});
					var j = $(".three3d li.activate").filter(function(o, i) {
						return "none" == $(i).attr("data-avatar")
					});
					if(i.length>0){
					  if(j.length>0){
						  var a = j.eq(Math.floor(Math.random()*j.length));
						  self.showNewuser(a,oldUser);
					  }else{
						  var a = i.eq(Math.floor(Math.random()*i.length));
						  self.showNewuser(a,oldUser);
					  }
					}else{
						  var ii = $(".three3d li.activate").filter(function(o, i) {
							 return "Y" == $(i).attr("data-padding")
						  });
						  if(ii.length>0){
							  var box = ii.eq(Math.floor(Math.random()*ii.length));
							  self.showagainuser(box);
						  }else{
							  setTimeout(function(){self.showuser()}, self.loopTime);
						  }
					}
			  }else{
				setTimeout(function(){self.showuser()}, self.loopTime);
			  }//nullCount
		 }else{
			setTimeout(function(){self.showuser()}, self.loopTime);
		 }//qdusers
		}//newUser
	},//showNewuser
	showNewuser:function(boxdiv,Nuser){
			var self = this;
			if(boxdiv&&Nuser){
				if(!boxdiv.data()||!boxdiv.data()){
					return setTimeout(function(){self.showuser()}, self.loopTime);
				}
				var s = Nuser.avatar || self.defaultAvatar;
				var html = Nuser.nickname;
				var e = html || '木木';
				var l = "signthreed" + (new Date).getTime();
				$(".threedb-mainbox").append(self.signRender({id:l,avatar:s,nickname:e}));
				$("#" + l).snabbt({
					fromPosition: self.posfrom[Math.floor(Math.random()*self.posfrom.length)],
					//fromRotation: [0,Math.PI, 0],
					fromScale: [2, 2],
					posotion: [0, 0, 2e3],
					scale: [1, 1],
					//rotation: [0, 0, 0],
					duration: 1e3,
					easing: "easeOut",
					complete: function() {
						var r = '<img src="' + s + '">';
						$("#" + l).snabbt({
							position: boxdiv.data().dataPosition,
							rotation: boxdiv.data().dataRotation,
							duration: 600,
							scale: [.25, .25],//11
							easing: "easeIn",
							delay: 500,
							complete: function() {
								$("#" + l).remove(),boxdiv.html(r),boxdiv.attr({"data-avatar":'had',"data-padding":'Y',"data-nickname":e,"data-src":s}),setTimeout(function(){self.showuser()}, self.loopTime);
							}
						})
					}
				})
			}else{
				setTimeout(function(){self.showuser()}, self.loopTime);
			}
	},
	showagainuser:function(boxdiv){
			var self = this;
			if(boxdiv){	
				var s = boxdiv.attr('data-src') || self.defaultAvatar;
				var e = boxdiv.attr('data-nickname') || '木木';
				if(!boxdiv.data()||!boxdiv.data()){
					return setTimeout(function(){self.showuser()}, self.loopTime);
				}
				var l = "signthreed" + (new Date).getTime();
				$(".threedb-mainbox").append(self.signRender({id:l,avatar:s,nickname:e}));
				$("#" + l).snabbt({
					fromPosition: self.posfrom[Math.floor(Math.random()*self.posfrom.length)],
					//fromRotation: [0, Math.PI, 0],
					fromScale: [2, 2],
					posotion: [0, 0, 2e3],
					scale: [1, 1],
					//rotation: [0, 0, 0],
					duration: 1e3,
					easing: "easeOut",
					complete: function() {
						$("#" + l).snabbt({
							position: boxdiv.data().dataPosition,
							rotation: boxdiv.data().dataRotation,
							duration: 600,
							scale: [.25, .25],//11
							easing: "easeIn",
							delay: 500,
							complete: function() {
								$("#" + l).remove(),setTimeout(function(){self.showuser()}, self.loopTime);
							}
						})
					}
				})
			}else{
				setTimeout(function(){self.showuser()}, self.loopTime);
			}
	},
};
return screenthreed;
});