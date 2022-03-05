jQuery(document).ready(function($) {
	"use strict";
	
	/* window */
	var window_width, window_height, scroll_top;
	
	/* admin bar */
	var adminbar = $('#wpadminbar');
	var adminbar_height = 0;
	if(adminbar.length==1){
		adminbar_height=adminbar.height();
		$('header#masthead').addClass('has_admin_bar');
	}
	var page_title=$('#page-title');
	if(page_title.length ==1){
		var page_title_height=$('#page-title').outerHeight();
		var page_title_top=$('#page-title').offset().top;
		var page_title_bottom = parseInt(page_title_height+page_title_top);
	}else{
		page_title_bottom =700;
	}
	/* header menu */
	var header = $('#cshero-header');
	var header_top = 0;
	/* scroll status */
	var scroll_status = '';
	
	/**
	 * window load event.
	 * 
	 * Bind an event handler to the "load" JavaScript event.
	 * @author Fox
	 */
	$(window).load(function() {
		
		/** current scroll */
		scroll_top = $(window).scrollTop();
		
		/** current window width */
		window_width = $(window).width();
		
		/** current window height */
		window_height = $(window).height();
		
		/* get admin bar height */
		adminbar_height = adminbar.length > 0 ? adminbar.outerHeight(true) : 0 ;
		
		/* get top header menu */
		header_top = adminbar_height;
		
		/* check sticky menu. */
		if(CMSOptions.menu_sticky == '1'){
			cms_stiky_menu(scroll_top);
		}
		
		/* check mobile menu */
		cms_mobile_menu();
		
		/* check back to top */
		if(CMSOptions.back_to_top == '1'){
			/* add html. */
			
			cms_back_to_top();
		}
		
		/* page loading. */
		cms_page_loading();
		
		/* check video size */
		cms_auto_video_width();

		/* on-scroll animations */
		cms_on_scroll_anims();

		/* fix height item fancybox single layout default */
		addHeightFancyboxItems();

		//product detail
		var product_details = $('.product-detail');
		var product_details_container = $('#product-details');
		var product_detail_triggers = $('.product-detail-trigger');
		
		for(var i=0, len=product_detail_triggers.length; i<len; i++) {
			productDetailHandler(product_detail_triggers.eq(i));
		}

		//product size radio
		var product_size_els = $('.product-size');
		for(var i=0, len=product_size_els.length; i<len; i++) {
			productSizeHandler(product_size_els.eq(i));
		}

		$('.widget_archive, .widget_categories').cmsReplaceCount();

		//scroll top

		var scroll_top_offset = 0-adminbar_height-87;	//because of fixed menu on one-page
		$('.scroll-to').on('click', function(e) {
			var section=$(this).attr('href');
			var offset=$(section).offset();
			if(offset.top > page_title_bottom){
 
				var scroll_offset_top = scroll_top_offset - $('#main-navigation-inner').height();
			}else{

				var scroll_offset_top=scroll_top_offset;
			}
			//if(offset.top)
			$.scrollTo($(this).attr('href'), 800, { axis: 'y', offset: scroll_offset_top });
		});

		//show mini cart
		ShowMiniCart();

		//change quantity value
		quantityCart();


		/**
		 * Auto width video iframe
		 */
		cms_auto_video_width();

		quantityMiniCart();

		/**
		 * CMS video
		 */
	    var tag = document.createElement('script');

	      tag.src = "https://www.youtube.com/player_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	        $('.cms-videos').each(function(){
	            var video_id=$(this).children('.cms-video-main').attr('id');
	            var video_player_id=$(this).children('.cms-video-main-play').attr('id');
	            var video_player=$('#'+video_player_id);
	            var video_main_el=$('#'+video_id);
	            var video_main_player;
	            if(video_main_el.length == 1) {
	                video_main_player = new YT.Player(video_id, {
	                    events: {
	                        // call this function when player is ready to use
	                        'onReady': function(){
	                            video_player.on('click', function(e) {
	                                
	                                e.preventDefault();
	                                video_main_el.addClass('active');
	                                video_main_player.playVideo();
	                            });
	                        }
	                    }
	                });
	            }
	        }) 	
	    /**
		 * Same height page blog
		 */
			sameHeightBlogs();

			sameHeightGridBlogs();

		/*one-page menu navigation */
		var one_page_nav = $('#menu-one-page');
		if(one_page_nav.length == 1) {
			one_page_nav.onePageNav({
				currentClass: 'active'
			});
		}

		
		/* check sticky menu. */
		if(CMSOptions.menu_sticky == '1'){
			cms_stiky_menu();
		}

		setMinHeightPageTitle();

		$('#menu-one-page').find('a').click(function(){
			$(this).parent().parent().parent().parent().removeClass('active');
		})

	});

	/**
	 * reload event.
	 * 
	 * Bind an event handler to the "navigate".
	 */
	window.onbeforeunload = function(){ cms_page_loading(); }
	
	/**
	 * resize event.
	 * 
	 * Bind an event handler to the "resize" JavaScript event, or trigger that event on an element.
	 * @author Fox
	 */
	$(window).resize(function(event, ui) {
		/** current window width */
		window_width = $(event.target).width();
		
		/** current window height */
		window_height = $(window).height();
		
		/** current scroll */
		scroll_top = $(window).scrollTop();
		
		/* check sticky menu. */
		if(CMSOptions.menu_sticky == '1'){
			cms_stiky_menu(scroll_top);
		}
		
		/* check mobile menu */
		cms_mobile_menu();
		
		/* check video size */
		cms_auto_video_width();

		/* fix height item fancybox single layout default */
		addHeightFancyboxItems();

		/**
		 * Auto width video iframe
		 */
		cms_auto_video_width();

		/**
		 * Same height page blog
		 */
		sameHeightBlogs();

		sameHeightGridBlogs();
		cms_stiky_menu();
		setMinHeightPageTitle();
	});
	
	/**
	 * scroll event.
	 * 
	 * Bind an event handler to the "scroll" JavaScript event, or trigger that event on an element.
	 * @author Fox
	 */
	var lastScrollTop = 0;
	
	$(window).scroll(function() {
		/** current scroll */
		scroll_top = $(window).scrollTop();
		/** check scroll up or down. */
		if(scroll_top < lastScrollTop) {
			/* scroll up. */
			scroll_status = 'up';
		} else {
			/* scroll down. */
			scroll_status = 'down';
		}
		
		lastScrollTop = scroll_top;
		
		
		
		/* check back to top */
		cms_back_to_top();
	});

	/**
	 * Stiky menu
	 * 
	 * Show or hide sticky menu.
	 * @author Fox
	 * @since 1.0.0
	 */
	function cms_stiky_menu() {
		//sticky menu
		var main_navigation_el = $('#cshero-header');
		var main_navigation_in_el = $('#main-navigation-inner');
		var main_nav_placeholder_el = $('#main-navigation-placeholder');
		var wpadminbar = $('#wpadminbar');
		if(main_navigation_el.length == 1) {
			if(wpadminbar.length==1){
				main_navigation_el.addClass('admin_bar');
			}else{
				main_navigation_el.removeClass('admin_bar');
			}
			var window_el = $(window);
			var main_nav_fixed = false;
			var page_title=$('#page-title');
			if(page_title.length ==1){
				var page_title_height=$('#page-title').outerHeight();
				var page_title_top=$('#page-title').offset().top;
				var page_title_bottom = parseInt(page_title_height+page_title_top);
			}else{
				page_title_bottom =700;
			}
			
			var header_height =$('.site-header ').outerHeight();
			//set menu placeholder when menu has fixed position
			main_nav_placeholder_el.height(main_navigation_el.outerHeight());
			
			window_el.on('scroll', function(e) {
				if(window_el.scrollTop() > page_title_bottom) {
					if(main_nav_fixed == false) {
						main_navigation_el.addClass('fixed-pos active');
						if(window_el.width() < 1601){
							main_navigation_el.parent().next().css('margin-top',main_navigation_el.outerHeight());
						}
						main_nav_fixed = true;
					}
				}else{
					if(main_nav_fixed == true) {
						if(Modernizr.csstransitions) {
							main_navigation_in_el.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
							main_navigation_el.removeClass('active');
							main_navigation_in_el.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
								main_navigation_el.removeClass('fixed-pos').parent().next().css('margin-top','0');
							});
							
						}
						main_nav_fixed = false;
					}
				}
			})
			
		}
	}
	
	/**
	 * Mobile menu
	 * 
	 * Show or hide mobile menu.
	 * @author Fox
	 * @since 1.0.0
	 */
	
	$('body').on('click', '#cshero-menu-mobile', function(){
		var navigation = $(this).parent().find('#cshero-header-navigation');
		if(!navigation.hasClass('collapse')){
			navigation.addClass('collapse');
		} else {
			navigation.removeClass('collapse');
		}
	});
	/* check mobile screen. */
	function cms_mobile_menu() {
		var menu = $('#cshero-header-navigation');
		
		/* active mobile menu. */
		switch (true) {
		case (window_width <= 992 && window_width >= 768):
			menu.removeClass('phones-nav').addClass('tablets-nav');
			/* */
			cms_mobile_menu_group(menu);
			break;
		case (window_width <= 768):
			menu.removeClass('tablets-nav').addClass('phones-nav');
			break;
		default:
			menu.removeClass('mobile-nav tablets-nav');
			menu.find('li').removeClass('mobile-group');
			break;
		}	
	}
	/* group sub menu. */
	function cms_mobile_menu_group(nav) {
		nav.each(function(){
			$(this).find('li').each(function(){
				if($(this).find('ul:first').length > 0){
					$(this).addClass('mobile-group');
				}
			});
		});
	}
	
	
	
	/**
	 * Parallax.
	 * 
	 * @author Fox
	 * @since 1.0.0
	 */
	var cms_parallax = $('.cms_parallax');
	if(cms_parallax.length > 0 && CMSOptions.paralax == '1'){
		cms_parallax.each(function() {
			"use strict";
			var speed = $(this).attr('data-speed');
			
			speed = (speed != undefined && speed != '') ? speed : 0.1 ;
			
			$(this).parallax("50%", speed);
		});
	}
	
	/**
	 * Page Loading.
	 */
	function cms_page_loading() {
		var page_loader_el = $('#page-loader');
		if(CMSOptions.page_loadding == 1){
			setTimeout(function(){
				page_loader_el.addClass('page-loaded'); 
				if(!Modernizr.csstransitions) {
					page_loader_el.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
						page_loader_el.addClass('page-loader-hidden');
					});
				}
				else
					page_loader_el.addClass('page-loader-hidden');
			}, 3000);
		}
	}
	
	/**
	 * Back To Top
	 * 
	 * @author Fox
	 * @since 1.0.0
	 */
	$('body').on('click', '#back_to_top', function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1500);
    });
	
	/* Show or hide buttom  */
	function cms_back_to_top(){
		/* back to top */
        if (scroll_top < window_height) {
        	$('#back_to_top').addClass('off').removeClass('on');
        } else {
        	$('#back_to_top').removeClass('off').addClass('on');
        }
	}
	
	function cms_on_scroll_anims(){
		var on_scroll_anims = $('.onscroll-animate');

		for (var i=0, len=on_scroll_anims.length; i<len; i++) {
			var element = on_scroll_anims.eq(i);
			element.one('inview', function (event, visible) {
				var el = $(this);
				var anim = (el.data("animation") !== undefined) ? el.data("animation") : "fadeIn";

				var delay = (el.data("delay") !== undefined ) ? el.data("delay") : 200;

				var timer = setTimeout(function() {
					el.addClass(anim);
					clearTimeout(timer);
				}, delay);
			});
		}
	};

	/* fix height item fancybox single layout default */
	function addHeightFancyboxItems(){
		$('.template-cms_fancybox_single').each(function(){
			$(this).find('.cms-fancyboxes-items').each(function(){
				var image_height=$(this).children('img').height();
				var image_width=$(this).children('img').width();
				var detail_height=$(this).find('.centered-columns').height()+40;
				var detail_width=$(this).find('.centered-columns').width()+40;
				if(detail_height > image_height ){
					$(this).height(detail_height);
					$(this).children('img').css({"min-width":"100%","width":"auto","max-width":"none"});
				}else{
					$(this).height('auto');
					$(this).children('img').css({"min-height":"none","min-width":"none","width":"100%","max-width":"100%"});
				}
			})
		})
	}
		//product detail
	function productDetailHandler(trigger_el) {

		var product_details = $('.product-detail');
		var product_details_container = $('#product-details');
		var product_detail_triggers = $('.product-detail-trigger');
		var product_detail_el = $(trigger_el.data('product-detail'));
		if(product_detail_el.length == 1) {
			if(!trigger_el.hasClass('active'))
				product_detail_el.hide();
			trigger_el.on('click', function(e) {
				product_detail_triggers.removeClass('active');
				$(this).addClass('active');
				product_details.stop().slideUp('slow', 'linear');
				product_detail_el.stop().slideDown('slow', 'linear');
				
				//if product details outside the screen slide to them
				if($(window).scrollTop() + $(window).height() - 200 < product_details_container.offset().top) {
					$.scrollTo(product_details_container.offset().top - 100, 800, { axis:'y' });
				}
			});
		}
	}


	//product size radio
	
	function productSizeHandler(el) {
		var product_size_els = $('.product-size');
		var input = el.find('input[type=radio]');
		if(input.is(':checked'))
			el.addClass('active');
		input.on('change', function(e) {
			product_size_els.removeClass('active');
			el.addClass('active');
		});
	}

	/**
	 * Edit the count on the categories widget
	 * @author LuanNguyen
     * @since 1.0.0
     * @param element parent
	 * */

    $.fn.extend({
        cmsReplaceCount: function(){
            this.each(function(){
        		$(this).addClass('cms-custom-widget');
        		$(this).find(' > ul > li').each(function() {
        			var cms_li = $(this);
        			
        			var small = $(this).html().replace('(','<div class="stats-num">(').replace(')',')</div>');
        			cms_li.html(small);
        			$(this).find(' .children li').each(function() {
        				var sm = $(this).html().replace('(','<div class="stats-num">(').replace(')',')</div>');
        				$(this).html(sm);
        				$(this).find(' .children li').each(function() {
	        				var s = $(this).html().replace('(','<div class="stats-num">(').replace(')',')</div>');
	        				$(this).html(s);
	        			})
        			})
        		});
            })
        }
    });

    function ShowMiniCart(){
    	//cart trigger
		var screen_cover = $('#screen-cover');
		var cart = $('#cms-mini-cart');
		$('.cms-cart-mini-button').on('click', function(e) {
			e.preventDefault();
			var cart_top_pos = $(window).scrollTop();
			if(cart_top_pos + cart.height() > $(document).height()) {
				$.scrollTo(0, 800, { axis:'y' });
				cart_top_pos = 0;
			}
			cart.css('top', cart_top_pos + 'px');
			if(!cart.hasClass('active')){
				cart.addClass('active');
				screen_cover.addClass('active');
			}
		});
		$('body').click(function(event){
			var target =$(event.target);
			if(target.hasClass('cart-close') || target.parents('.cart-close').length == 1){
				cart.removeClass('active');
				screen_cover.removeClass('active');
			}else{
				if(target.parents('.cart-content').length == 0) {
					if( target.parents('.cms-cart-mini-button').length != 1 || target.hasClass('cms-cart-mini-button')){
						cart.removeClass('active');
						screen_cover.removeClass('active');
					}
				}
			}
		})
		
		// screen_cover.on('click', function(e) {
		// 	cart.removeClass('active');
		// 	screen_cover.removeClass('active');
		// });
    }

    function quantityCart(){
		$('.wp-pizzeria-cart .quantity').each(function(){
			var quantity=$(this).children().val();
    		var min=parseInt($(this).children().attr('min'));
    		var max=parseInt($(this).children().attr('max'));

    		$(this).children().attr('type','hidden');
    		$(this).next().children('.quantity-second').val(quantity);

    		$(this).next().children('.quantity-second').change(function(){
    			var new_quantity=parseInt($(this).val());
    			if(max || max > 0){
    				if(new_quantity > max){
    					$(this).val(max);
    					$(this).parent().prev().children().val(max);
    				}else{

    					if(min || min >0  || min == 0){

    						if(new_quantity < min){
    							$(this).val(min);
    							$(this).parent().prev().children().val(min);
    						}else{
    							$(this).val(new_quantity);
    							$(this).parent().prev().children().val(new_quantity);
    						}
    					}else{
    						$(this).val(new_quantity);
    						$(this).parent().prev().children().val(new_quantity);
    					}
    					
    				}
    			}else{
    				if(min || min >0  || min == 0){

						if(new_quantity < min){
							$(this).val(min);
							$(this).parent().prev().children().val(min);
						}else{
							$(this).val(new_quantity);
							$(this).parent().prev().children().val(new_quantity);
						}
					}else{
						$(this).val(new_quantity);
						$(this).parent().prev().children().val(new_quantity);
					}
    			}
    			
    		})

			$(this).next().children('.product-pieces-up').click(function(){
    			var old_quantity=parseInt($(this).parent().prev().children().val());
    			var new_quantity=old_quantity+1;
    			if(max || max > 0){
    				if(new_quantity > max){
    					$(this).parent().children('.quantity-second').val(max);
    					$(this).parent().prev().children().val(max);
    				}else{

    					if(min || min >0  || min == 0){

    						if(new_quantity < min){
    							$(this).parent().children('.quantity-second').val(min);
    							$(this).parent().prev().children().val(min);
    						}else{
    							$(this).parent().children('.quantity-second').val(new_quantity);
    							$(this).parent().prev().children().val(new_quantity);
    						}
    					}else{
    						$(this).parent().children('.quantity-second').val(new_quantity);
    						$(this).parent().prev().children().val(new_quantity);
    					}
    					
    				}
    			}else{
    				if(min || min >0  || min == 0){

						if(new_quantity < min){
							$(this).parent().children('.quantity-second').val(min);
							$(this).parent().prev().children().val(min);
						}else{
							$(this).parent().children('.quantity-second').val(new_quantity);
							$(this).parent().prev().children().val(new_quantity);
						}
					}else{
						$(this).parent().children('.quantity-second').val(new_quantity);
						$(this).parent().prev().children().val(new_quantity);
					}
    			}
    			
    		})

			$(this).next().children('.product-pieces-down').click(function(){
    			var old_quantity=parseInt($(this).parent().prev().children().val());
    			var new_quantity=old_quantity-1;
    			if(max || max > 0){
    				if(new_quantity > max){
    					$(this).parent().children('.quantity-second').val(max);
    					$(this).parent().prev().children().val(max);
    				}else{

    					if(min || min >0  || min == 0){

    						if(new_quantity < min){
    							$(this).parent().children('.quantity-second').val(min);
    							$(this).parent().prev().children().val(min);
    						}else{
    							$(this).parent().children('.quantity-second').val(new_quantity);
    							$(this).parent().prev().children().val(new_quantity);
    						}
    					}else{
    						$(this).parent().children('.quantity-second').val(new_quantity);
    						$(this).parent().prev().children().val(new_quantity);
    					}
    					
    				}
    			}else{
    				if(min || min >0  || min == 0){

						if(new_quantity < min){
							$(this).parent().children('.quantity-second').val(min);
							$(this).parent().prev().children().val(min);
						}else{
							$(this).parent().children('.quantity-second').val(new_quantity);
							$(this).parent().prev().children().val(new_quantity);
						}
					}else{
						$(this).parent().children('.quantity-second').val(new_quantity);
						$(this).parent().prev().children().val(new_quantity);
					}
    			}
    			
    		})
		})
    }

    /**
	 * Auto width video iframe
	 * 
	 * Youtube Vimeo.
	 * @author Fox
	 */
	function cms_auto_video_width() {
		$('.entry-video iframe, .entry-video video, .entry-video .videopress-placeholder, .entry-video img.videopress-poster, .entry-video object, iframe.cms-video-main-default ').each(function(){
			var v_width = $(this).width();
			
			v_width = v_width / (16/9);
			$(this).attr('height',v_width);
		})
	}

 	function quantityMiniCart(){
 		$('.cms-mini-cart').find('.product-pieces').each(function(){
 			var quantity=$(this).find('.quantity').children().val();
    		$(this).find('.quantity').children().attr('type','hidden');
    		$(this).children('.quantity-second').val(quantity);
 		})
	}

	function sameHeightBlogs(){
		if( window_width > 991){
			$('.page-blogs').find('.row').each(function(){
				var same=0;
				$(this).find('article.post-preview').each(function(){
					if($(this).children('.post-content').height() > same){
						same = $(this).children('.post-content').height();
					}
				})
				if(same > 0){
					$(this).find('.post-content').height(same)
				}
			})
		}else{
			$('#page-blogs').find('.post-content').height('auto');
		}
			
	}

	function sameHeightGridBlogs(){
		
		$('.template-cms_grid .cms-grid').each(function(){
			var w_width = 0;
			var item =$(this).children('div:first-child');
			if(item.hasClass('col-md-12')){
				w_width= 1199;
			}else if(item.hasClass('col-sm-12')){
				w_width= 991;
			}else if(item.hasClass('col-xs-12')){
				w_width= 767;
			}
			if( w_width != 0 && window_width > w_width){
				var same = 0;
				$(this).find('article.post-preview').each(function(){
					if($(this).children('.post-content').height() > same){
						same = $(this).children('.post-content').height();
					}
				})
				if(same > 0){
					$(this).find('.post-content').height(same)
				}
			}else{
				$(this).find('.post-content').height('auto');
			}
		})
			
	}

	function setMinHeightPageTitle(){
		var height =$('.page-title').find('.page-title-wrap').height() + 20;
		$('.page-title').css('min-height',height);
		if(height > $('.page-title').find('img.img-full').height() ){
			$('.page-title').find('img.img-full').addClass('img-full-fixed').css({'max-height':height,'position':'absolute','left':'50%','transform':'translateX(-50%)'});
		}else{
			$('.page-title').find('img.img-full').removeClass('img-full-fixed').attr('style','');
		}
	}
});