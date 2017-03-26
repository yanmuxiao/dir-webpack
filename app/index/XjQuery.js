/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-23 14:49:58
 * @version XjQuery 20150523
 */

var XjQuery = (function(){

	// 常用共用变量
	var oBody = $('body').eq(0);

	// removeMask
	var removeMask = function(){
		if($("#mask-div").length > 0) {
			$("#mask-div").hide().remove();
		}
	};
	// mask
	var mask = function(config){
		var defaults = {
			hideAuto : false,
			timeout : 1200,
			loading : false,
			style : ''
		};
		var option = $.extend(defaults, config);
		var loadCSS = '';
		if(option.loading) {
			loadCSS = 'loading';
		}
		var maskHtml = "<div id='mask-div' class='mask-div "+
		loadCSS
		+ "' style='" + option.style + "'></div>";
		oBody.append(maskHtml);
		// 禁止点击和滑动冒泡==> 原生方法，注意和toucher的区别，toucher直接return  false;
		$("#mask-div").on('touchmove',function(event) {
			event.stopPropagation();
			event.preventDefault(); 
		}, false);  
		if(option.hideAuto){
			setTimeout(removeMask,option.timeout); 
		} 
	};


	//自动隐藏的tips
	var tips = function(oText, timeout){
	    var tipHtml = "<div class='tips-info'>"+ oText + "</div>";
	    oBody.append(tipHtml);
	    setTimeout(function(){
	        $('.tips-info').hide().remove();
	    },timeout);
	    return false;
	};


	// 验证表单的函数
	// 参数：focusArg==>验证不通过是是否获取焦点，默认不获取
	var validate = function(validataArr){
		var  oBoolean = true;
		var  validate = $('.validate');
		if(validate.length > 0){
			$('.validate').each(function(){
				var dataPattern = $(this).attr('data-pattern');
				if( dataPattern != undefined){
					var reg = new RegExp(validataArr[dataPattern][0],'g')
					if(!reg.test($(this).val())){
						var oText = validataArr[dataPattern][1];
						if(oText == undefined){
							oText = '验证不通过！';
						}
						XjQuery.mask({
							hideAuto : true,
							style : 'background-color: rgba(0,0,0,0);'
						});
						tips(oText, 1200);
						if(validataArr.focusArg){
							$(this).focus();
						}
						oBoolean = false;
						return false;//跳出each循环
					}
				}
			})/*each*/
		}
		return oBoolean;//验证通过了就返回true，不通过返回false
	};



	// actionSheet begin
	// 参数：asID==>弹出actionSheet按钮的ID，config==>对应的执行方法
	var actionMask = function(asID, config){
		var defaults = {
			asList : ['提交', '保存'],
			asFn1 : function(){
        		console.log('提交');
        	},
        	asFn2 : function(){
        		console.log('保存');
        	}
		};
		var option = $.extend(defaults, config);
		var asulliHTML = '';
		for(var i=0;i<option.asList.length;i++){
			asulliHTML += '<li class="as-li" data-num="' + (i+1) +'">' + option.asList[i] + '</li>';
		}
		var asHTML = 	'<div class="RUI-mask"></div>' +
						'<div class="as-wrap">' +
						    '<ul class="as-ul as-ul-main slim-border">' +
						    asulliHTML +
						    '</ul>' +
						    '<ul class="as-ul slim-border">' +
						        '<li class="as-li as-cancle" data-num="-1">取消</li>' +
						    '</ul>' +
						'</div>';
		oBody.append(asHTML);
		// 禁止点击和滑动冒泡
		$(".RUI-mask").on('touchmove',function(event) { 
			event.stopPropagation();
			event.preventDefault(); 
		}, false); 
		function actionSheet(){
            $('.RUI-mask').show();
            $('.as-wrap').css({
            	'-webkit-transition-duration' : '500ms',
                '-webkit-transform' : 'translateY(-100%)'
            });
        }
        function hideActionSheet() {
            $('.RUI-mask').hide();
            $('.as-wrap').css({
            	'-webkit-transition-duration' : '500ms',
                '-webkit-transform' : 'translateY(0)'
            });
        }
        // .each(function(){})
    	util.toucher($(asID)[0]).on('singleTap', function(){
    		if(!option.validateFn || option.validateFn()){
        		actionSheet();
        	}
    	})
        // 取消
        $('.RUI-mask,.as-cancle').each(function(){
        	util.toucher(this).on('singleTap', function(){
        		hideActionSheet();
        	})
        })
        // 事件绑定
        $('.as-ul-main li').each(function(){
        	util.toucher(this).on('singleTap', function(){
        		option['asFn' + $(this).attr('data-num')]();
        		hideActionSheet();
        	})
        })
	};
	// actionSheet end


	// input输入删除
	var inputDelete = function(inputDeleteCalss){
		$(inputDeleteCalss).each(function(){
			$(this).keyup(function(){
				if($(this).val().length > 0){
					$(this).next('.delete-btn')[0].style.display = 'block';
				}else{
					$(this).next('.delete-btn')[0].style.display = 'none';
				}
			})
			$(this).focus(function(){
				if($(this).val().length > 0){
					$(this).next('.delete-btn')[0].style.display = 'block';
				}else{
					$(this).next('.delete-btn')[0].style.display = 'none';
				}
			})
			$(this).blur(function(){
				var _this = $(this);
				setTimeout(function(){
					 _this.next('.delete-btn')[0].style.display = 'none';
				},90);
			})
		})
		$('.delete-btn').each(function(){
			util.toucher(this).on('singleTap', function(){
				$(this).prev(inputDeleteCalss).val('').focus();
				this.style.display = 'none';
			})
		})
	};





	// popverMenu
	var popverMenu = function(config){
		var defaults = {
			popoverCID : '#popover',
			popoverStyle : 'top : 44px; right: 0;margin: .2rem .2rem 0 0;',
			triangleStyle : 'top : -.2rem; right: 0.5rem;border-width: 0 .2rem .2rem;border-color: transparent transparent rgba(67,71,74,0.7) ;',
			// 向下的三角形
			// popoverStyle : 'bottom : 50px; right: 0;margin: 0 .2rem .2rem 0;',
			// triangleStyle : 'top : 100%; right: 0.5rem;border-width: .2rem .2rem 0;border-color: rgba(67,71,74,0.7) transparent transparent;',
			menuList : ['消息', '购物车', '卡券', '首页'],
			menuIcon : ['icon-comment', 'icon-cart', 'icon-coupon', 'icon-home'],
			menu1 : function(){
        		console.log('消息');
        	},
        	menu2 : function(){
        		console.log('购物车');
        	},
        	menu3 : function(){
        		console.log('卡券');
        	},
        	menu4 : function(){
        		console.log('首页');
        	}
		};
		var option = $.extend(defaults, config);
		var asulliHTML = '';
		for(var i=0;i<option.menuList.length;i++){
			asulliHTML +='<li data-num="' + (i+1) +'"><i class="iconfont '+ option.menuIcon[i] +'"></i><span>' + option.menuList[i] + '</span></li>'
		}
		var popoverHTML =	'<div class="RUI-mask" style="background-color: rgba(0,0,0,0);"></div>' +
							'<div class="RUI-popover" style="' + option.popoverStyle + '">' + 
								'<div class="triangle_border_up" style="' + option.triangleStyle + '"></div>' + 
								'<ul class="RUI-popover-ul">' +
								asulliHTML +
								'</ul>' + 
							'</div>';
		oBody.append(popoverHTML);
		var  popoverObj = $('.RUI-popover');
		var  maskObj = $(".RUI-mask");
		var  pageContent = $('.page-content');
		// 禁止点击和滑动冒泡
		util.toucher(maskObj[0]).on('swipeStart',function() { 
			popoverObj.hide();
			maskObj.hide();
			setTimeout(function(){
				pageContent.removeClass('pointer-event-none');	
			},500);
		}, false); 
		popoverObj.on('touchmove',function(event) {
			event.stopPropagation();
			event.preventDefault(); 
		}, false); 
		 //显示 
		util.toucher($(option.popoverCID)[0]).on('singleTap', function(){
			popoverObj.show();
			maskObj.show();
			pageContent.addClass('pointer-event-none');	
		});
		// 隐藏
		util.toucher(maskObj[0]).on('singleTap', function(){
			popoverObj.hide();
			$(this).hide();
			setTimeout(function(){
				//css阻止点透到input上，必须延时
				pageContent.removeClass('pointer-event-none');	
			},500);
		})
		// 事件绑定
		$('.RUI-popover-ul li').each(function(){
			util.toucher(this).on('singleTap', function(){
				option['menu' + $(this).attr('data-num')]();
				popoverObj.hide();
				maskObj.hide();
				setTimeout(function(){
					pageContent.removeClass('pointer-event-none');	
				},500);
			})
		})
	}


	// 滚动条位置
	var scrollTop = function(){
		return document.documentElement.scrollTop || document.body.scrollTop;
	};


	// 垂直方向弹性下拉
	var swipeFixedVertical = function(wrapID, contentClass){
		var start_top;
		var wrapIDObj = document.getElementById(wrapID);
		util.toucher(wrapIDObj)
		.on('swipeStart',contentClass,function(){
			start_top = parseFloat($(this).css('-webkit-transform').substring(22).replace(')',''));
			if(start_top > 0){
				$(this).css({
					'-webkit-transition-duration' : '0ms',
					'-webkit-transform' : 'translateY(' + start_top + 'px)'
				})
			}
		}).on('swipe',contentClass,function(e){
			if($(wrapIDObj).scrollTop() == 0 && e.moveY > 0){
				$(this).css({
					'-webkit-transition-duration' : '0ms',
					'-webkit-transform' : 'translateY(' + start_top + e.moveY * 0.35  + 'px)'
				})
				return false;
			}
		}).on('swipeEnd',contentClass,function(e){
			if(parseFloat($(this).css('-webkit-transform').substring(22).replace(')','')) > 0){
				$(this).css({
					'-webkit-transition-duration' : '600ms',
					'-webkit-transform' : 'translateY(0)'
				})
				return false;
			}
		});
	};
	// 垂直方向弹性下拉



	// 水平方向拖动
	var swipeFixedHorizon = function(wrapID, contentClass){
		var start_left,oProgressA = document.getElementById(wrapID);
		var leftNum = 0;
		util.toucher(oProgressA)
		.on('swipeStart', contentClass, function(){
			start_left = parseInt($(this).css("left")) || 0;
		}).on('swipe', contentClass, function(e){
			$(this).css({
				"left" : start_left + e.moveX * 0.75 + "px"
			});
			return false;
		}).on('swipeEnd', contentClass, function(e){
			if(start_left + e.moveX * 0.75 > 0){
				$(this).css({
					"left" : 0
				});
			}else if(start_left + e.moveX * 0.75 < oProgressA.clientWidth - this.clientWidth){
				$(this).css({
					"left" : oProgressA.clientWidth - this.clientWidth + 'px'
				});
			}
			return false;	
		});
	}


	return {
		validate : validate,
		inputDelete : inputDelete,
		tips : tips,
		mask : mask,
		removeMask : removeMask,
		actionMask : actionMask,
		popverMenu : popverMenu,
		swipeFixedVertical : swipeFixedVertical,
		swipeFixedHorizon : swipeFixedHorizon
	}

})();










