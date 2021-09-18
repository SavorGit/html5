define('fulldm',['template','screencore','jquerytrans'],function(template,screencore){
	var fulldm = {
		timer:null,
		oldBullet:[],
		newBullet:[],
		haddelBullet:[],
		dmtpl:null,
		isLoop:false,
		loadhistory:'1',
		dmspeed:'2',
		config:{},
		init:function(container,config){
			var self = this;
			if(!config||$.isEmptyObject(config)) return;
			self.config = config;
			self.dmtpl = template('fulldm-tpl');
			if(config.isloop=='1'){
				self.isLoop = true;
			}
			self.loadhistory = config.loadhistory;
			if(config.loadhistory=='1'){
				self.ajaxhistory(config.historynum);//加载历史消息
			}
			self.dmspeed = config.dmspeed;
			self.boxH = 100;
			self.container = container;//弹幕外框
			self.clientHeight = 800;
			self.resize();
			self.isBullet = false;
			self.loopTimer = 0;
			var l = self.clientHeight / self.boxH;
			self.yPos = [];
			for (var g = 0; g < l; g++) {
				self.yPos.push(g)
			}
			self.posLen = self.yPos.length;
			self.oldPos = [];
			var openfulldm = window.localStorage.getItem("openfulldm"+XCV2Config.hdid);
			if(openfulldm=='2'){
				self.close();	
			}else{
				if(!openfulldm){//并未有缓存则判断是否设置了开屏播放弹幕
					config.opendm=='1'&&self.open();
				}else{
					openfulldm=='1'&&self.open();	
				}
			}
			var resizeTimer = null;
			$(window).bind('resize', function () {
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function () {
					self.resize();
				},500);
			});
		},
		resize:function(){
			var self = this;
			var  zoom = (window.innerHeight / 800);
			self.clientWidth = parseInt(window.innerWidth / zoom);
		},
		ajaxhistory:function(num){
			var self = this;
			screencore.ajaxSubmit('socket.ajaxdm',{num:num,rhdid:self.config.hdid||0}).then(function(e){
					self.oldBullet = e.message;
			});
		},
		bulletTimer:function(){
			var self = this;
			self.timer = setInterval(function() {
				if (self.newBullet.length > 0 && self.yPos.length > 0) {
					self.createBulletMsg(self.newBullet.shift());
					self.loopTimer = 0
				} else {
					if (self.isLoop && self.loopTimer >= 2 && self.yPos.length > 0 && self.oldBullet.length > 0) {
						self.createBulletMsg(self.oldBullet.shift())
					} else {
						self.loopTimer++
					}
				}
			},1500);
		},
		vpos:-1,
		createBulletMsg:function(k) {
			var self = this;
			if(k.content!=''){
				k.needavatar = self.config.needavatar;
				k.neednickname = self.config.neednickname;
				k.content = screencore.emoToimg(k.content);
			}
			var domhtml = self.dmtpl(k);
			var g = $(domhtml);
			if(self.config.needbg=='1'&&self.config.bgcolortype=='2'){
				g.find('.fulldmBox-wrapper').css({"background-color":self.randColor()});
			}
			if(self.config.fontcolortype=='2'){
				g.find('.fulldmBox-info').css({"color":self.randColor()});
			}
			var olength = self.oldPos.length;
			if(olength==0){
				self.vpos = self.yPos[Math.floor(Math.random()*self.yPos.length)];
			}else{
				if(olength==self.yPos.length){
					self.oldPos = [];
					var vpos = self.yPos[Math.floor(Math.random()*self.yPos.length)];
					if(vpos == self.vpos){
						vpos = (vpos==7?0:vpos+1);
					}
					self.vpos = vpos;
				}else{
					var diffPos = self.diffarr(self.yPos,self.oldPos);
					self.vpos = diffPos[Math.floor(Math.random()*diffPos.length)];
				}
			}
			self.oldPos.push(self.vpos);
			var j = self.vpos * self.boxH ;
			self.container.append(g);
			var f = g.outerWidth(true);
			g.css({"top": j,"left":self.clientWidth+'px'});
			g.transition({
				x: -(self.clientWidth + f*2),
				duration:self.rollspeed(),
				easing: "linear",
				complete: function() {
					g.remove();
					if(self.isLoop){
						self.isdelExists(k.id)==-1&&self.oldBullet.push(k);
					}
				}
			})
		},
		rollspeed:function(){
			var speed = this.dmspeed;
			return speed=='1'?(20000+this.getRandom(1,2)*1e3):speed=='2'?(10000+this.getRandom(1,2)*1e3):(5000+this.getRandom(1,2)*1e3);
		},
		diffarr:function(arr1, arr2) {
			return arr1.concat(arr2).filter(function(v, i, arr) {
				return arr.indexOf(v) === arr.lastIndexOf(v);
			});
		},
		randColor:function(){
			var e = .78,
			t = ["rgba(141,50,160," + e + ")", "rgba(225,99,15," + e + ")", "rgba(242,73,73," + e + ")", "rgba(18,155,240," + e + ")", "rgba(90,162,12," + e + ")", "rgba(20,185,148," + e + ")"],
			n = Math.floor(6 * Math.random());
			return t[n]
		},
		close:function() {
			var self = this;
			if($.isEmptyObject(self.config)) return;
			clearInterval(self.timer);
			self.isBullet = false;
			self.container.find(".fulldmBox-item").remove();
			$(".control-normal-list .fulldm-icon-box .isstop").show();
		},
		open: function() {
			var self = this;
			if($.isEmptyObject(self.config)) return;
			self.isBullet = true;
			self.bulletTimer();
			$(".control-normal-list .fulldm-icon-box .isstop").hide();
		},
		addBullet:function(g) {
			this.newBullet.push(g);
		},
		delBullet:function(key){
			 var e = this;
			 e.haddelBullet.push(key);
			 if ($('.fulldm-' + key).length > 0) {
				$('.fulldm-' + key).remove();
			 }
			 var dmkey = e.isnewExists(key);
			 if(dmkey!==-1){
				e.newBullet.splice(dmkey,1);
			 }else{
				var olddmkey = e.isoldExists(key);
				if(olddmkey!==-1){
					e.oldBullet.splice(olddmkey,1);
				 }
			 }
		},
		resetBullet:function(){
			var e = this;
			e.oldBullet=  [];
			e.newBullet = [];
			$(".fulldmBox").empty();
		},
		isoldExists:function(keyid){
			var e = this;
			var dmindex = -1;
			for (var i = 0, len = e.oldBullet.length; i < len; i++) {
				if (keyid == e.oldBullet[i].id) {
					 dmindex = i;
					 break;
				}
			}	
			return dmindex;
		},
		isnewExists:function(keyid){
			var e = this;
			var dmindex = -1;
			for (var i = 0, len = e.newBullet.length; i < len; i++) {
				if (keyid == e.newBullet[i].id) {
					 dmindex = i;
					 break;
				}
			}	
			return dmindex;
		},
		isdelExists:function(keyid){
			var e = this;
			var dmindex = -1;
			for (var i = 0, len = e.haddelBullet.length; i < len; i++) {
				if (keyid == e.haddelBullet[i]) {
					 dmindex = i;
					 break;
				}
			}	
			return dmindex;
		},
		getRandom:function(d, a) {
			var b = a - d;
			var c = Math.random() * b + d;
			return parseInt(c, 10)
		},
	};
	return fulldm;
});