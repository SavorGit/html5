!function(){var a=layer.cache||{},b=function(c){return(a.skin?(" "+a.skin+" "+a.skin+"-"+c):"")};layer.preview=function(c){var h=c.dict||{};c=c||{};if(!c.photos){return}var g=c.photos,d=g.data||[];var f=g.start||0;h.imgIndex=(f|0)+1;c.img=c.img||"img";if(d.length===0){console.log("没有图片显示");return}h.imgprev=function(){h.imgIndex--;if(h.imgIndex<1){if(!c.loop){c.last();return}else{h.imgIndex=d.length}}h.tabimg()};h.imgnext=function(){h.imgIndex++;if(h.imgIndex>d.length){if(!c.loop){c.last();return}else{h.imgIndex=1}}else{}h.tabimg()};h.tabimg=function(){if(d.length<=1){return}g.start=h.imgIndex-1;layer.close(h.index);c.dict=h;layer.preview(c)};h.event=function(i,j){$(".layui-layer-shade").click(function(){c.previewClose()})};function e(k,l,j){var i=new Image();i.src=k;if(i.complete){return l(i)}i.onload=function(){i.onload=null;l(i)};i.onerror=function(m){i.onerror=null;j(m)}}e(d[f].src,function(i){var j=null;if(c.customArea){j=c.customArea(i)}else{j=(function(m){var n=m.width,k=m.height;var o=c.limitArea;if(o&&(n>o[0]||k>o[1])){var l=o[0]/o[1];var p=n/k;if(l<p){n=o[0];k=n/p}else{k=o[1];n=k*p}}return[n+"px",k+"px"]})(i)}h.index=layer.open($.extend({type:1,area:j,title:false,shade:0.3,zIndex:8,shadeClose:true,closeBtn:true,move:false,cancel:function(){c.previewClose()},shift:Math.random()*5|0,skin:"layui-layer-photos"+b("photos"),content:'<div class="layui-layer-phimg"><img src="'+d[f].src+'" alt="'+(d[f].alt||"")+'" layer-pid="'+d[f].pid+'"><div class="layui-layer-imgsee">'+(d.length>1?'<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>':"")+'<div class="layui-layer-imgbar" style="display:none;"><span class="layui-layer-imgtit"><a href="javascript:;">'+(d[f].alt||"")+"</a><em>"+h.imgIndex+"/"+d.length+"</em></span></div></div></div>",success:function(k,l){h.bigimg=k.find(".layui-layer-phimg");h.imgsee=k.find(".layui-layer-imguide");h.event(k,l);c.tab&&c.tab(d[f],k,l)},end:function(){h.end=true}},c))},function(){if(d.length>1){h.imgnext()}else{c.last()}});return h}}();