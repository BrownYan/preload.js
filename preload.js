/* *************************************************************
  PRELOAD IMAGE PLUGIN, 2015/2, Brown Yim, Oaidea.com
  LAST UPDATED: 2015/4/17
  NEED:jQuery

  VERSION 0.4
************************************************************* */
//PRELOAD IMAGE PLUGIN, VERSION 0.4, 2015/2, Brown Yim, Oaidea.com, LAST UPDATED: 2015/4/17, NEED:jQuery
/*
	<meta property="pl:images" content="img.jpg;img2.png">
	<meta property="pl:timeout" content="10000">
	<meta property="pl:duration" content="2000">
	<meta property="pl:callback" content="method()">
	<meta property="pl:autostart" content="1">
*/
(function() { 
	var args=arguments;
	var window=args[0]||window;
	var document=args[1]||document;
	var callback=args[2]||function(){};
	var imgs=[],timeout=10000,autostart=true,duration='0';

  var melememt='body > :not(.__preload_box)';

	var ss='',sh='';

	ss+='<style>';
	ss+='body.__preload{background:;overflow:hidden;margin:0;padding:0;}';
	ss+='@-webkit-keyframes rotate{0%{-webkit-transform:rotate(0deg)} 100%{-webkit-transform:rotate(360deg)}} ';
  ss+='@keyframes rotate{0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)}}'
	ss+='.__preload_box svg,.__preload_box img{-webkit-animation: rotate .8s linear 0s infinite;animation: rotate .8s linear 0s infinite}';
	ss+='.__preload_box{background:#666;position:fixed;top:0;left:0;right:0;bottom:0;text-align:center;z-index:100}';
ss+='.__preload_box svg {width:64px;height:64px;display:inline-block;vertical-align:middle}.__preload_box svg path,.__preload_box svg rect{fill:#fff;}';

	ss+='</style>';
	sh+='<div class="__preload_box"><img src="images/_preload_icon.png"></div>';
sh='<div class="__preload_box"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><!--animateTransform ttributeType="xml"  attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.8s" repeatCount="indefinite"--></path></svg></div>';

	var init=function(){

		var pl_imgs=$('meta[property=pl\\:images]').attr('content')||'';
		if(pl_imgs)imgs=imgs.concat(pl_imgs.split(/[,;]/));
		var pl_timeout=($('meta[property=pl\\:timeout]').attr('content'));
		if(pl_timeout)timeout=Math.floor(pl_timeout)||timeout;
		var pl_callback=($('meta[property=pl\\:callback]').attr('content'));
		callback=pl_callback;
		autostart=$('meta[property=pl\\:autostart]').attr('content');
    if(autostart.toLowerCase()=='true'&&Math.floor(autostart)!=0){autostart=true;} else {autostart=false;}

		duration=Math.floor($('meta[property=pl\\:duration]').attr('content'))||0;


	},show=function(){
		$('head').append(ss);
		$('body').append(sh);
		$('body').addClass('__preload');
		repaint();
		$(window).on('resize', repaint);

	},repaint=function(){
		var vh = window.innerHeight || document.documentElement.clientHeight;
		$(melememt).hide();	
		$('.__preload_box').css('line-height',vh+'px');

	},hide=function(){

		$(melememt).fadeIn(500);

		$('.__preload_box > *').fadeOut(250,function(){
			$('.__preload_box').fadeOut(250,function(){
				$('.__preload_box').remove();
				$('body').removeClass('__preload');
				$(window).off('resize', repaint);
        try{eval(callback);}catch(x){}
			});
		});
	},done=function(){
		hide();
		
  },imgload=function(){
    var can_done=false;

    var duration_timer=window.setTimeout(function(){
			duration_timer=undefined;
      if(can_done) {
        can_done=false;
			  done();
      }
		},duration);
		var need_load_num=0;
		var loaded_num=0;
    var timer=window.setTimeout(function(){
			timer=undefined;
			duration_timer=undefined;
      can_done=false;
			done();
		},timeout);

		$('img').each(function(){
      var src=$(this).attr('src');
      if($.inArray(src,imgs)<0) imgs.push(src);
    });
    
		need_load_num=imgs.length;
		if(need_load_num>0) show();
		for(i=0;i<imgs.length;i++){
			var src=$.trim(imgs[i]);
      if(src=='') {
        loaded_num++;
        continue;
      }
			var img=new Image();
			img.onload=function(){
				loaded_num++;
				if(loaded_num>=need_load_num){
					window.clearTimeout(timer);
          if(can_done) {
					  window.clearTimeout(duration_timer);
            can_done=false;
            done();
          }else{
            can_done=true;
          }
				}
			};
			img.src=src;
		}

  };
	
	
 

	
	
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

  init();
	$(function($) {
    if(autostart){
      show();
      imgload();
    }
	});
	
})(window,document);
