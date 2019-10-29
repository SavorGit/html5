/**
 *
 * jQuery Web Sockets Plugin v0.0.1
 * http://code.google.com/p/jquery-websocket/
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2010 by shootaroo (Shotaro Tsubouchi).
 *
 var ws;
 function connectSocketServer(msgBord) {
		var messageBoard = $('#' + msgBord);
		ws = $.websocket('ws://{0}'.format(websocketserver), {
			open: function () {
				messageBoard.append('* 已连接<br />');
			},
			close: function () {
				messageBoard.append('* 连接已断开<br />');
			},
			events: {
				log: function (e) {
					var session = e.data.sessionid;
					$.post('getcuruser', function (data) {
						accecpResult(data, function () {
							ws.send('log', { username: data.data.name, realname: data.data.realname });
							ws.send('listuser', { });
						})
					});
				},
				userlist: function (e) {
					console.log(e);
				}
			}
		});
	}
 */
(function ($) {
    $.extend({
        websocketSettings: {
            open: function () {
            },
            close: function () {
            },
            message: function () {
            },
            options: {},
            events: {}
        },
        websocket: function (url, settings) {
            var ws = WebSocket ? new WebSocket(url) : {
                send: function (msg) {
                    return false
                },
                close: function () {
                }
            };
            ws._settings = $.extend($.websocketSettings, settings);
            $(ws)
                .bind('open', $.websocketSettings.open)
                .bind('close', $.websocketSettings.close)
                .bind('message', $.websocketSettings.message)
                .bind('message', function (e) {
                    var msgObject = $.evalJSON(e.originalEvent.data);
                    // var msgObject = eval("(" + (e.originalEvent.data) + ")");
                    var h = $.websocketSettings.events[msgObject.type];
                    if (h) {
                        h.call(this, msgObject);
                    }
                });
            //ws._settings = $.extend($.websocketSettings, s);
            ws._send = ws.send;
            ws.send = function (type, data) {
                var msgObject = {type: type};
                msgObject = $.extend(true, msgObject, $.extend(true, {}, $.websocketSettings.options, msgObject));
                if (data) {
                    msgObject['data'] = data;
                }
                return this._send($.toJSON(msgObject));
                // return this._send(JSON.stringify(msgObject));
            }
            $(window).unload(function () {
                ws.close();
                ws = null
            });
            return ws;
        }
    });
})(jQuery);