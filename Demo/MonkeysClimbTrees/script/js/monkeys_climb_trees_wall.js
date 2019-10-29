game_config.load({
	scene_info: {
		game_id: "MonkeysClimbTrees",
		room_id: $.getUrlParam("box_mac"),
		rankTopTen: [],
		need_login: 1,
		win_count: 3
	},
	web_socket: {
		url: "ws://localhost:8989/ws",
		method: {
			request: {
    			create_room: "createRoom",
    			statement: "statement"
			}
		}
	},
	/*
	qrcode: {
		container: "qrcode"
	},
	*/
	page: {
		shake_url: "http://mobile.littlehotspot.com/Smallapp21/index/getTestBoxQr?box_mac=00226D5846EA&type=2"
	},
	timers: {
		ready: {
			timer: null,
			interval: 1000,
			duration: 0,
			residue: 0
		}
	}
});

$(document).ready(function(){
	game_config.web_socket.instance = $.websocket(game_config.web_socket.url, {
		open: function(event) {//连接打开的时候触发
			game_config.logs.write("建立连接");
			//console.info("ws.open", event);
			game_config.web_socket.instance.send(game_config.web_socket.method.request.create_room, {
				gameId: game_config.scene_info.game_id,
				roomId: game_config.scene_info.room_id
			});
		},
		close: function(event) {//连接关闭的时候触发
			game_config.logs.write("断开连接");
			console.info("ws.close", event);
			window.location.reload();
		},
		events: {
			init: function(event){// 初始化场地
				//console.info("fun", "init", event);
				var room = event.data;
				game_config.scene_info.room_id = room.roomId;
				game_config.scene_info.round = room.round;
				game_config.scene_info.distance = room.distance;
				//console.log("var", "game_config", game_config);
				//game_config.qrcode.makeCode(game_config.page.shake_url + "?game=" + game_config.scene_info.game_id + "&r_id" + game_config.scene_info.room_id);
				game_config.logs.write("初始化房间完成。");
			},
			signIn: function(event){// 用户签到
				//console.info("fun", "signIn", event);
				var user = event.data;
				game_config.logs.write("用户进入：" + JSON.stringify(user));
				game_config.web_socket.instance.send(game_config.web_socket.method.request.statement, {
					gameId: game_config.scene_info.game_id,
					roomId: game_config.scene_info.room_id,
					userId: user.userId,
					userNickname: user.userNickname,
					userHeader: user.userHeader,
					round: game_config.scene_info.round,
					distance: game_config.scene_info.distance,
					journey: 0,
					speed: 0
				});
			},
			register: function(event){// 登记入册
				//console.info("fun", "statemented", event);
				var user = event.data;
				
				$('.round-label2 span').html('<i>' + user.userCount + '</i>').find('i').toggleClass('animate-rotate2');
				Audio.play("#Audio_NewPlayer");
				var signInUser = '<div id="shake_user_' + user.userId + '" class="user-item"><div class="user-img"><img src="' + user.userHeader + '" /></div><p>' + user.userNickname + "</p></div>";
				if($('#shake_user_' + user.userId).length == 0){
					$(signInUser).appendTo(".users").animate({opacity: 0.7}, 500);
				}
			},
			newRound: function(event){// 接收新轮次
				//console.info("fun", "newRound", event);
				var room = event.data;
				game_config.scene_info.round = typeof(room.round) == "undefined" ? 0 : room.round;
				game_config.logs.write("获取新的轮次：" + game_config.scene_info.round);
			},
			ready: function(event){// 准备
				//console.info("fun", "ready", event);
				var users = event.data;
				game_config.logs.write("游戏在" + event.time + "毫秒后开始。");
				game_config.timers.ready.duration = event.time;
				game_config.timers.ready.residue = event.time;
				game_config.timers.ready.timer = window.setInterval(function(){
					game_config.logs.write("还剩" + game_config.timers.ready.residue + "毫秒。");
					game_config.timers.ready.residue -= game_config.timers.ready.interval;
					if(game_config.timers.ready.residue < 1){
						window.clearInterval(game_config.timers.ready.timer);
					}
				}, game_config.timers.ready.interval);
				$(".round-welcome").slideUp(function() {
					cutdown_start();
		        });
		        //game_config.scene_info.rankTopTen = users.slice(0,10);
				var dDivhouzi = $('.houzik').children('div');
				for (var index = 0; index < dDivhouzi.length; index++) {
					var actor = users[index];
					var actorPageNode = $(dDivhouzi[index]);
					if(actor){
						actorPageNode.attr("id", actor.userId);
						actorPageNode.find('.topk').find('span').text(actor.userNickname);
						actorPageNode.find('.mshakeuser_img').attr('src',actor.userHeader);
					}
				}
			},
			forward: function(event){// 前进
				//console.info("fun", "forward", event);
				var user = event.data;
				var userSpeed = typeof(user.speed) == "undefined" ? 0 : user.speed;
				game_config.logs.write("用户前进：" + userSpeed);
				var actorPageNode = $("#" + user.userId);
				var journey = typeof(user.journey) == "undefined" ? 0 : user.journey;
				var max_top = $('.pashuMain').height()  - 215;
				var now_top = (journey / game_config.scene_info.distance) * max_top;
				actorPageNode.css('bottom', now_top + 'px');
				actorPageNode.find('.bottomhz').find('img').attr('src', "./images/common/images_old/hz.gif");
			},
			gameOver: function(event){// 游戏结束
				//console.info("fun", "gameOver", event);
				var users = event.data;
				game_config.logs.write("游戏结束。");
				
				users = users.sort(function(a, b){
					return b.journey - a.journey;
				});
		        game_config.scene_info.rankTopTen = users.slice(0,10);
				
				for (var index = 0; index < users.length; index++) {
					var user = users[index];
					var actorPageNode = $("#" + user.userId);
					if(user.journey >= user.distance){
						var guoZiK = actorPageNode.find('.guozik');
						$(guoZiK).css('opacity', 1).css('top', $('.pashuMain').height());
					}
				}
				showGameResult();
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
	$(".round-welcome").show();
	
	var dDivhouzi = $('.houzik').children('div');
	for (var i=0; i<dDivhouzi.length; i++) {
		var num = i + 1;
		$(dDivhouzi[i]).find('.topk').find('span').text("虚位以待");
	}
	
	/*
	var docElm = document.documentElement;
	docElm.webkitRequestFullScreen();
	*/
});