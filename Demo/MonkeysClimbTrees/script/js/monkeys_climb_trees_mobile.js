game_config.load({
	scene_info: {
		game_id: "MonkeysClimbTrees",
		room_id: $.getUrlParam("box_mac"),
		round: 1,
		distance: 0,
		journey: 0
	},
	web_socket: {
		url: "ws://192.168.88.86:8989/ws",
		method: {
			request: {
				enter_room: "enterRoom",
				get_round: "getRound",
				create_round: "createRound",
				start: "start",
				shake: "shake"
			}
		}
	},
	timers: {
		ready: {
			timer: null,
			interval: 1000,
			duration: 0,
			residue: 0
		},
		match: {
			timer: null,
			interval: 2000
		}
	}
});

$(document).ready(function(){
	game_config.web_socket.instance = $.websocket(game_config.web_socket.url, {
		open: function(event) {//连接打开的时候触发
			game_config.logs.write("建立连接");
			//console.log(event);
			game_config.web_socket.instance.send(game_config.web_socket.method.request.enter_room, {
				gameId: game_config.scene_info.game_id,
				roomId: game_config.scene_info.room_id,
				userId: game_config.user.id,
				userNickname: game_config.user.nickname,
				userHeader: game_config.user.header,
				round: game_config.scene_info.round
			});
		},
		close: function(event) {//连接关闭的时候触发
			game_config.logs.write("断开连接");
		},
		events: {
			init: function(event){// 初始化用户
				//console.log("fun", "init", event);
				var initData = event.data;
				game_config.scene_info.game_id = initData.gameId;
				game_config.scene_info.room_id = initData.roomId;
				game_config.scene_info.round = initData.round;
				game_config.scene_info.distance = initData.distance;
				game_config.scene_info.journey = initData.journey;
				//console.log("var", "game_config", game_config);
				game_config.logs.write("初始化用户完成。");
				game_config.web_socket.instance.send(game_config.web_socket.method.request.get_round, {
					gameId: game_config.scene_info.game_id,
					roomId: game_config.scene_info.room_id,
					userId: game_config.user.id
				});
			},
			round: function(event){// 获取当前轮次
				//console.log("fun", "round", event);
				var initData = event.data;
				game_config.scene_info.round = typeof(initData.round) == "undefined" ? 0 : initData.round;
				game_config.logs.write("获取当前轮次 : " + game_config.scene_info.round);
				
				if (game_config.scene_info.round < 1){
					game_config.web_socket.instance.send(game_config.web_socket.method.request.create_round, {
						gameId: game_config.scene_info.game_id,
						roomId: game_config.scene_info.room_id,
						userId: game_config.user.id
					});
				}
			},
			newRound: function(event){// 接收新轮次
				//console.info("fun", "newRound", event);
				var room = event.data;
				game_config.scene_info.round = typeof(room.round) == "undefined" ? 0 : room.round;
				game_config.logs.write("获取新的轮次：" + game_config.scene_info.round);
			},
			sit: function(event){// 用户就坐
				console.log("fun", "sit", event);
				var sitData = event.data;
				game_config.scene_info.game_id = sitData.gameId;
				game_config.scene_info.room_id = sitData.roomId;
				game_config.scene_info.round = typeof(sitData.round) == "undefined" ? 0 : sitData.round;
				game_config.scene_info.distance = typeof(sitData.distance) == "undefined" ? 0 : sitData.distance;
				game_config.scene_info.journey = typeof(sitData.journey) == "undefined" ? 0 : sitData.journey;
				game_config.user.speed = typeof(sitData.speed) == "undefined" ? 0 : sitData.speed;
				console.log("var", "game_config", game_config);
				game_config.logs.write("用户已经就座。");
			},
			ready: function(event){// 准备
				console.log("fun", "ready", event);
				game_config.logs.write("游戏在" + event.time + "毫秒后开始。");
				game_config.timers.ready.duration = event.time;
				game_config.timers.ready.residue = event.time;
				game_config.timers.ready.timer = window.setInterval(function(){
					game_config.logs.write("还剩" + game_config.timers.ready.residue + "毫秒。");
					game_config.timers.ready.residue -= game_config.timers.ready.interval;
					if(game_config.timers.ready.residue < 1){
						window.clearInterval(game_config.timers.ready.timer);
						game_config.timers.match.timer = window.setTimeout(function(){
							game_config.web_socket.instance.send(game_config.web_socket.method.request.shake, {
								gameId: game_config.scene_info.game_id,
								roomId: game_config.scene_info.room_id,
								userId: game_config.user.id,
								userNickname: game_config.user.nickname,
								userHeader: game_config.user.header,
								round: game_config.scene_info.round,
								distance: game_config.scene_info.distance,
								journey: game_config.scene_info.journey,
								speed: 0
							});
							game_config.user.speed = 0;
						}, game_config.timers.match.interval);
					}
				}, game_config.timers.ready.interval);
			},
			delay: function(event){// 延迟
				//console.log("fun", "delay", event);
				game_config.logs.write("延迟：" + event.time);
				game_config.timers.match.timer = window.setTimeout(function(){
					game_config.web_socket.instance.send(game_config.web_socket.method.request.shake, {
						gameId: game_config.scene_info.game_id,
						roomId: game_config.scene_info.room_id,
						userId: game_config.user.id,
						userNickname: game_config.user.nickname,
						userHeader: game_config.user.header,
						round: game_config.scene_info.round,
						distance: game_config.scene_info.distance,
						journey: game_config.scene_info.journey,
						speed: game_config.user.speed
					});
					game_config.user.speed = 0;
				}, event.time);
			},
			gameOver: function(event){// 游戏结束
				console.log("fun", "delay", event);
				window.clearInterval(game_config.timers.ready.timer);
				window.clearInterval(game_config.timers.match.timer);
				game_config.logs.write("游戏结束。当前名次：" + event.data.speed);
			},
			allSeatsTaken: function(event){// 房间满员
				game_config.logs.write("房间已经满员.");
			},
			sendResponse: function(event){// 发送消息结果
				console.info("fun", "sendResponse", event);
			},
			receive: function(event){// 接收消息
				console.info("fun", "error", event);
			},
			unknown: function(event){// 未知
				console.info("fun", "unknown", event);
			},
			error: function(event){// 错误
				console.info("fun", "error", event);
			}
		}
    });

    game_config.logs.panel.hide();
});