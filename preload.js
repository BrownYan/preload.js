/* *************************************************************
	PRELOAD IMAGE PLUGIN, 2015/2, Brown Yim, Oaidea.com

  LAST UPDATED: 2015/4/16
  
  NEED:jQuery
	
	VERSION 0.2
************************************************************* */

(function() { 
	var args=arguments;
	var window=args[0]||window;
	var document=args[1]||document;
	var callback=args[2]||function(){};
	var imgs=[],timeout=10000;

  var melememt='#page';

	var ss='',sh='';

	ss+='<style>';
	ss+='body.__preload{background:;overflow:hidden;margin:0;padding:0;}';
	ss+='@-webkit-keyframes rotate{0%{-webkit-transform:rotate(0deg)} 100%{-webkit-transform:rotate(360deg)}}';
	ss+='.__preload_box img{-webkit-animation: rotate 3s linear 0s infinite}';
	ss+='.__preload_box{background:#666;position:fixed;top:0;left:0;right:0;bottom:0;text-align:center;}';
	ss+='</style>';
	sh+='<div class="__preload_box"><img src="images/_preload_icon.png" /></div>';

	var init=function(){

		var pl_imgs=$('meta[property=pl\\:images]').attr('content');
		if(pl_imgs)imgs=imgs.concat(pl_imgs.split(/[,;]/));
		var pl_timeout=($('meta[property=pl\\:timeout]').attr('content'));
		if(pl_timeout)timeout=Math.floor(pl_timeout);	
    
		var pl_callback=($('meta[property=pl\\:callback]').attr('content'));
    callback=pl_callback;

		$('head').append(ss);

	},show=function(){
		$('body').append(sh);
		$('body').addClass('__preload');
    $("body > :not(.__preload_box)").hide();
		repaint();
		$(window).on('resize', repaint);
	},repaint=function(){
		var vh = window.innerHeight || document.documentElement.clientHeight;
		$('.__preload_box').css('line-height',vh+'px');

	},hide=function(){
    $("body > :not(.__preload_box)").fadeIn(500);	
		$('.__preload_box img').fadeOut(250,function(){
			$('.__preload_box').fadeOut(250,function(){
				$('.__preload_box').remove();
				$('body').removeClass('__preload');
				$(window).off('resize', repaint);
        try{eval(callback);}catch(x){}
			});
		});
	},done=function(){
		hide();
		
	};
	
	

	$(function($) {
		var need_load_num=0;
		var loaded_num=0;
		init();

		var timer=window.setTimeout(function(){
			timer=undefined;
			done();
		},timeout);

		var $imgs=$('img');


		need_load_num=$imgs.length+imgs.length;


		if(need_load_num>0) show();

		for(i=0;i<imgs.length;i++){
			var src=imgs[i];
			var img=new Image();
			img.onload=function(){
				loaded_num++;
				if(loaded_num>=need_load_num){
					window.clearTimeout(timer);
					done();
				}
			};
			img.src=$.trim(src);
		}


		$imgs.load(function(){
			loaded_num++;
			if(timer==undefined)return;
			if(loaded_num>=need_load_num){
				window.clearTimeout(timer);
				done();

			}
		});
	});
	
	
	$.extend({
		loader:{
			show:function(){
				show();
				return this;
			},
			hide:function(){
				hide();
				return this;
			},
			duration:function(t){
				window.setTimeout(function(){
					hide();
				},t);
			}
		}
		
	});


	
})(window,document);
