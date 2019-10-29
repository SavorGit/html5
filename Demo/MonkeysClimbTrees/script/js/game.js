(function(a, b){
	a.game_config = {
		scene_info: {
			game_id: null,
			room_id: null,
			rankTopTen: [],
			need_login: 1,
			win_count: 3
		},
		web_socket: {
			instance: null,
			url: null,
			method: {
				request: {}
			}
		},
		qrcode: {
			container: null
		},
		page: {
			shake_url: null
		},
		timers: {},
		load: function(option){
			//console.info("fun", "game_config.load", game_config, option);
			var config = a.game_config;
			b.extend(config, option);
			a.game_config = config;
			//console.info("var", "game_config", game_config);
		}
	};
	b(document).ready(function(e){
		if(game_config.qrcode.container){
			game_config.qrcode = new QRCode(game_config.qrcode.container, {
				width: 430,
				height: 430,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.H
			});
		}
		game_config.logs = {
			panel: $("#logs_panel"),
			console: $("#logs_console").bind('input propertychange','textarea', function(event){
				var scrollTop = $(this)[0].scrollHeight;
			 	$(this).scrollTop(scrollTop);
			}),
			button: {
				clear: $("#clear_logs").click(function(event){
	            	game_config.logs.console.val('');
	            }),
	            close: $("#close_logs_panel").click(function(event){
	            	game_config.logs.panel.hide();
	            })
			},
			write: function(msg){
				var message = game_config.logs.console.val().toString();
				if(message == "undefined"){
					message = "";
				} else {
					message += "\n";
				}
				game_config.logs.console.val(message + msg).trigger("input");
			}
		};
	});
})(window, jQuery);