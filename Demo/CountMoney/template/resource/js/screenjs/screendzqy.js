define('screendzqy',['screensocket','screencore','template','layerBox','zamnotice','fulldm','keyboard','domtoimage','velocity','jquery.ui'],function(screensocket,screencore,template,layerBox,zamnotice,fulldm,keyboardJS,domtoimage){
	var screendzqy = {
		changeround:'2',
		clienttpl:null,
		img:null,
		maoconfig:{
			l:20,
			radius:0,
			has:[],
			arr:[],
			linemin:20,
			linemax:40,
			linepressure:1,
			smoothness:90,
		},
		devices:[],
		savedImgs:false,
		init:function(rotate){
			var self = this;
			self.clienttpl = template('qyclient-tpl');
			if(rotate!=''){
				self.changeround = rotate.changeround;
				self.inithyImg(rotate.hyimg);
				self.initdevices(rotate.devices);
			}else{
				$(".loading-box").remove();
				$(".dzqy-mainbox .emptybox").removeClass('display-none');
			}
			self.bindEvent();
			self.initsocket();
		},
		inithyImg:function(img){
			screencore.getBase64img(img,function(url){
				$(".dzqy-bg").attr("src",url);
				$(".loading-box").remove();
			});
		},
		initdevices:function(devices){
			var self = this,deviceBox = $(".dzqy-mainbox");
			self.img = $(".maoimg")[0];
			deviceBox.find(".dzqy_device").remove();
			self.devices = [];
			$.each(devices,function(i,v){
				deviceBox.append(self.clienttpl(v));
				var acanvas = deviceBox.find(".device-"+v.id+" canvas");
				self.devices['device-'+v.id] = {
					id:v.id,
					drawtype:v.drawtype,
					linewidth:v.linewidth,
					linecolor:v.linecolor,
					startp:null,
					scale:parseFloat(v.scaleval),
					canvas:acanvas[0],
					ctx:acanvas[0].getContext("2d"),
					width:v.cwidth,
					height:v.cheight,
				};
				self.devices['device-'+v.id].followdevice = v.isfollowdraw=='1'?'device-'+v.followdeviceid:'0';
				self.devices['device-'+v.id].maoconfig = $.extend(self.maoconfig,{l:v.linewidth*2,linemin:v.linewidth,linemax:v.linewidth * 2});
			});
		},
		initsocket:function(){
			var self = this;
			var params = {};
			params.onmessage = function(data){
				if(data.type=='connected'){
					screensocket.isclose = false;
					screensocket.sendData({type:"dzqygame",stype:"dzqylink"});
				}else if(data.type=="gamelinked"){
					self.initcanvas(data);
				}else if(data.type=='gamedata'){
					self.drawcanvas(data);
				}else if(data.type=='clientrefresh' || data.type=='clientclear'){
					for(var i in self.devices){
						var v = self.devices[i];
						if(v.id==data.device || v.followdevice=='device-'+data.device){
							self.clear(i);
						}
					}
				}else if(data.type=='clientshowreadyimg'){
					self.showclientreadyImg(data);
				}
			};
			screensocket.init(params);
		},
		bindEvent: function() {
			var self = this;
			keyboardJS.bind('space', function(e) {
				if(self.savedImgs) return;
				self.savedImgs = true;
				self.flyto();
			});
			keyboardJS.bind('right', function(e) {
				if(self.changeround=='2') return;
				screencore.ajaxSubmit('screen.dzqy.nextround',{rotateid:rotateInfo.id}).then(function(json){
					if(json.errno==0){
						window.location.href = json.message;
					}else{
						zamnotice.showNotice('提示',json.message,2e3,false,'info','info');
					}
				});
			});
		},
		initcanvas:function(data){
			var self = this,obj = $(".dzqy-mainbox ."+data.device);
		},
		drawcanvas:function(data){
			var self = this;
			switch(data.isstart) {
				 case 1:
				    self.drawstart(data);
					break;
				 case 2:
					self.drawmoving(data);
					break;
				 case 3:
					self.drawend(data);
					break;
				 case 4:
					for(var i in self.devices){
						var v = self.devices[i];
						if(i==data.device||v.followdevice==data.device){
							self.clear(i);
						}
					}
					break;
			} 
		},
		drawstart:function(data){
			var self = this,alldevices = self.devices;
			for(var i in alldevices){
				var v = alldevices[i];
				if(i===data.device || v.followdevice===data.device){
					if(v.drawtype=='1'){
						v.startp = data.point;
					}else{
						v.startp = data.point;
						v.maoconfig.arr.unshift(data.point);
						v.maoconfig.has = [];
					}
				}
			}
		},
		drawmoving:function(data){
			var self = this,alldevices = self.devices;
			for(var i in alldevices){
				var onedevice = alldevices[i];
				if(i===data.device || onedevice.followdevice===data.device){
					var ctx=onedevice.ctx;
					var startp = onedevice.startp;
					var maoconfig = onedevice.maoconfig;
					var scale=onedevice.scale;
					var point= data.point;
					var bj = maoconfig.radius;
					var dis = 0;
					var time = 0;
					if(onedevice.drawtype=='1'){
						ctx.beginPath();
						ctx.lineCap = "round";
						ctx.moveTo(startp.x * onedevice.scale, startp.y* onedevice.scale);
						ctx.lineTo(point.x * onedevice.scale, point.y * onedevice.scale);
						ctx.closePath();
						ctx.strokeStyle = onedevice.linecolor;
						ctx.lineWidth = onedevice.linewidth * onedevice.scale;
						ctx.stroke();
						onedevice.startp = point;
					}else{
						maoconfig.has.unshift({time:data.nowtime ,dis:self.distance(startp,point)});
						for (var n = 0; n < maoconfig.has.length-1; n++) {
							dis += maoconfig.has[n].dis;
							time += maoconfig.has[n].time - maoconfig.has[n+1].time;
							if (dis > maoconfig.smoothness) {
								break;
							}
						}
						var newbj = Math.min( time / dis * maoconfig.linepressure + maoconfig.linemin , maoconfig.linemax) / 2;
						var len = Math.round(maoconfig.has[0].dis / 2) + 1;
						for (var i = 0; i < len; i++) {
							var x = startp.x + (point.x - startp.x)/len*i;
							var y = startp.y + (point.y - startp.y)/len*i;
							var r = bj + (newbj - bj)/len*i;
							ctx.beginPath();
							ctx.lineCap = "round";
							x = x - maoconfig.l / 2;
							y = y - maoconfig.l / 2;
							maoconfig.arr.unshift({x,y});
							ctx.drawImage(self.img,x * scale,y * scale,maoconfig.l * scale,maoconfig.l * scale);
							maoconfig.l = maoconfig.l - 0.2;
							if( maoconfig.l < maoconfig.linemin) maoconfig.l = maoconfig.linemin;
						}
						onedevice.maoconfig.radius = newbj;
						onedevice.startp = point;
					}
				}
			}
			console.log(self.devices);
		},
		drawend:function(data){
			var self = this,alldevices = self.devices;
			for(var i in alldevices){
				var onedevice = alldevices[i];
				if(onedevice.drawtype=='2'){
					if(i===data.device || onedevice.followdevice===data.device){
					  var maoconfig = onedevice.maoconfig;
					  maoconfig.l =	maoconfig.linemax;
					  if(maoconfig.arr.length > 100){
						for(var j = 0; j < 60 ;j++){
						  maoconfig.arr[j].x = maoconfig.arr[j].x - maoconfig.l / 4;
						  maoconfig.arr[j].y = maoconfig.arr[j].y - maoconfig.l / 4;
						  //onedevice.ctx.drawImage(self.img,maoconfig.arr[j].x * onedevice.scale,maoconfig.arr[j].y * onedevice.scale,maoconfig.l * onedevice.scale,maoconfig.l * onedevice.scale);
						  maoconfig.l = maoconfig.l - onedevice.scale;
						  if(maoconfig.l < maoconfig.linemin/2) maoconfig.l = onedevice.linemin/2;
						}
						onedevice.maoconfig.l = maoconfig.linemax;
						onedevice.maoconfig.arr = [];
					  }
					  if (maoconfig.arr.length==1) {
						onedevice.maoconfig.arr = [];
					  }
					}
				}
			}
		},
		distance:function(a,b){
			var x = b.x - a.x , y = b.y - a.y;
			return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
		},
		clear:function(device){
			var self = this,onedevice = self.devices[device];
			if(onedevice){
				onedevice.startp = null;
				onedevice.maoconfig = $.extend(self.maoconfig,{l:onedevice.linewidth*2,linemin:onedevice.linewidth,linemax:onedevice.linewidth * 2});
				onedevice.ctx.clearRect(0, 0,onedevice.width, onedevice.height);
			}
		},
		flyto:function(){
			var self = this,deviceBox = $(".dzqy-mainbox"),eachindex=0;
			deviceBox.find(".needfly").length>0&&deviceBox.find(".needfly").each(function(i,v){
				var $this = $(this);
				$this.velocity({
					top: $this.attr("data-flytop")+"px",
					left: $this.attr("data-flyleft")+"px",
				}, {
					duration: 1e3,
					easing: "easeInSine",
				});
				eachindex++;
			});
			if(deviceBox.find(".needfly").length==eachindex){
			  setTimeout(function(){
					deviceBox.find("canvas").each(function(i,v){
						self.savedrawimg($(this),$(this).parent().attr("data-deviceid"));
					});
					self.saveto();
			  },1200);
			}
		},
		savedrawimg:function(obj,deviceid){
			var self = this;
			if(rotateInfo=="") return;
			var imgData = obj[0].toDataURL();
			screencore.ajaxSubmit('screen.dzqy.savedrawimg',{rotateid:rotateInfo.id,deviceid:deviceid,imgData:imgData}).then(function(json){});		
		},
		saveto:function(){
			var self = this,dzqyBox = $(".dzqy-mainbox"); 
			if(rotateInfo=="") return;
			domtoimage.toPng(dzqyBox.get(0)).then(function (dataUrl) {
				screencore.ajaxSubmit('screen.dzqy.savedrawimg',{rotateid:rotateInfo.id,imgData:dataUrl}).then(function(json){
					self.savedImgs = false;
					zamnotice.showNotice('提示','签约成功',1e3,false,'success','success');
				});
			}).catch(function (error) {
				console.error('oops, something went wrong', error);
			});
		},
		showclientreadyImg:function(data){
			var self = this,deviceBox = $(".dzqy-mainbox").find(".device-"+data.device);
			self.clear('device-'+data.device);
			deviceBox.find("canvas").addClass("display-none");
			deviceBox.find("img").removeClass("display-none");
		}
	};
	return screendzqy;
});
