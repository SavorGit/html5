define('appsocket',['wechatcore'],function(wechatcore){
		var appsocket = {
			parmas:null,
			isclose:true,
			wsClient:null,
			init:function (params) {
				var self = this;
				self.parmas = params;
				var gameName = wechatcore.getQueryString('r').split('.');
				self.senddata = {
					game:gameName[1],
					hdid:XCV2Config.hdid,
					rhdid:XCV2Config.rhdid,
					userid:XCV2Config.userid,
					rotateid:XCV2Config.rotateid,
					openid:XCV2Config.openid,
					nickname:XCV2Config.nickname,
					avatar:XCV2Config.avatar,
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
				self.wsClient.onmessage = function (evt) {//收到消息
					var data = JSON.parse(evt.data);
					params.onmessage&&params.onmessage(data);
				};
				self.wsClient.onclose = function (evt) {//链接关闭
					self.isclose = true;
					self.wsClient = null;
					if(params.onclose){
						params.onclose(evt);
					}else{
						self.reconnect();
					}
				};
				self.wsClient.onerror = function (evt) {//链接失败
					if(params.onerror){
						params.onerror(evt);
					}else{
						console.log('连接通讯服务器异常..');
					}
				};
				window.onbeforeunload = function() {
					//self.closeClient();
				};
			},
			reconnect:function(){
				var self = this;
				self.init(self.parmas);
			},
			wssend:function(data){
				var self = this;
				!self.isclose&&self.wsClient.send(JSON.stringify(data));
			},
			wsloginsend:function(data){
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
			}
		};
		return appsocket;
});

  
    
