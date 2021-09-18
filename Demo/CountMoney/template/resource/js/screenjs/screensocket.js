define('screensocket',['screencore'],function(screencore){
		var screensocket = {
			parmas:null,
			wsClient:null,
			senddata:null,
			isclose:true,//开屏即为socket关闭状态
			forceoff:false,
			init:function (params) {
				var self = this;
				self.parmas = params;
				var sroutes = screencore.getQueryString('r');
				var gamename = sroutes.split('.');
				self.senddata = {
					game:gamename[1],
					hdid:XCV2Config.hdid,
					rhdid:XCV2Config.rhdid,
					rotateid:XCV2Config.rotateid,
					userid:'screen',
				};
				self.wsClient = new WebSocket(XCV2Config.wsAddress);
				self.wsClient.onopen = function(){
					if(params.onopen){
						params.onopen();
					}else{
						setInterval(function(){
							self.heartBeat();
						},6e3);
					}
				};
				self.wsClient.onmessage = function (evt) {
					var data = JSON.parse(evt.data);
					params.onmessage&&params.onmessage(data);
				};
				self.wsClient.onclose = function (evt) {
					self.isclose = true;
					console.log(evt);
					if(params.onclose){
						params.onclose(evt);
					}else{
						console.log('通讯服务器断开..');
						self.reconnect();
					}
				};
				self.wsClient.onerror = function (evt) {
					self.isclose = true;
					console.log(evt);
					if(params.onerror){
						params.onerror(evt);
					}else{
						console.log('连接通讯服务器异常..');
					}
				};
			},
			reconnect:function(){
				var self = this;
				!self.forceoff && self.init(self.parmas);
			},
			wssend:function(data){
				var self = this;
				!self.isclose&&self.wsClient.send(JSON.stringify(data));
			},
			wsloginsend:function(data){//旨在用于open状态发送消息
				var self = this;
				self.wsClient.send(JSON.stringify(data));
			},
			heartBeat:function(){
				var self = this;
				!self.isclose&&self.wsClient.send('{"type":"ping"}');
			},
			closeClient:function(){
				var self = this;
				!self.isclose&&self.wsClient.close();
			},
			sendData:function(obj){
				var self = this,objdata = self.senddata;
				$.extend(objdata,obj);
				self.wssend(objdata);
			},
		};
		return screensocket;
});

  
    
