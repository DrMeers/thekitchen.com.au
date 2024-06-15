var FEATURE_FADE_DELAY = 200;
tkcm = window.tkcm || {
    get_cookie: function(name){
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                    break;
                }
            }
        }
        return cookieValue;
    },
    inner_dimensions: function(){
        var e = window, a = 'inner';
        if ( !( 'innerWidth' in window ) ) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
    },
    PX_PER_EM: 16,
    column_count: function(){
        var width = tkcm.inner_dimensions().width;
        if(width < 40*tkcm.PX_PER_EM){
            return 1;
        }
        else if(width < 60*tkcm.PX_PER_EM){
            return 2;
        }
        else if(width < 80*tkcm.PX_PER_EM){
            return 3;
        }
        else{
            return 4;
        }
    },
    reset_gallery_opacity: function(){
        $('.gallery').css('opacity', 1);
    },
    feature_image: function(item){
        $('body').addClass('feature-shown');
        // $('.feature .loading').show();
        $('.gallery .content .item').removeClass('featured');
        $(item).addClass('featured');
        var img = $(item).find('img');
        $('.feature .feature-image').addClass('fade-out').fadeTo($('.feature .feature-image').hasClass('srcless') ? 0 : FEATURE_FADE_DELAY, 0.1);
        $('<img class="feature-image fade-in" src="'+img.data('large')+'" />').css('opacity', 0.1).insertBefore($('.feature .feature-image.fade-out').first());

        $('.feature img.feature-image.fade-in').one('load', function() {
            // $('.feature .loading').fadeOut();
            var aspect_ratio = parseFloat(img.data('aspect-ratio'));
            $('.feature').removeClass('portrait').removeClass('landscape').removeClass('long-landscape');
            $('.feature').addClass(aspect_ratio < 1 ? 'portrait' : 'landscape');
            if(aspect_ratio > 1.25) {
              $('.feature').addClass('long-landscape');
            }
            var caption = (
                '<span class="artist">' + img.data('artist') + '</span>' +
                '<span class="portfolio">' + img.data('portfolio') + '</span>'
            );
            if(img.attr('title')){
                caption += (
                    '<span class="title">' + img.attr('title') + '</span>'
                );
            };
            $('.feature .caption').html(caption);
            $('.feature').attr('data-sort-index', $(item).data('sort-index') + '.5');
            $('.feature img.feature-image.fade-in').fadeTo($('.feature .feature-image').hasClass('srcless') ? 0 : FEATURE_FADE_DELAY, 1, function(){
                $('.feature .fade-in').removeClass('fade-in');
                $('.feature .fade-out').remove();
            });
        }).attr('src', img.data('large')).each(
            function() {
                // Cache fix for browsers that don't trigger .load()
                if(this.complete) $(this).trigger('load');
            }
        );
    },
    feature_prev: function(){
        var prev = $('.gallery .content .featured.item').prevAll('.item');
        if(prev.length){
            prev = prev[0];
        }
        else{
            prev = $('.gallery .content .item').last();
        }
        tkcm.feature_image(prev);
    },
    feature_next: function(){
        var next = $('.gallery .content .featured.item').nextAll('.item');
        if(next.length){
            next = next[0];
        }
        else{
            next = $('.gallery .content .item').first();
        }
        tkcm.feature_image(next);
    },
    feature_close: function(){
        $('body').removeClass('feature-shown');
        $('.gallery .content .featured.item').removeClass('featured');
        $('.feature .feature-image').addClass('srcless').attr('src', '');
        $('body').removeClass('feature-shown');
    },
    bind_feature_buttons: function(){
        $(document).on('keydown', '.feature-shown', function(e){
          if(e.which == 37) {
            tkcm.feature_prev();
          }
          if(e.which == 39) {
            tkcm.feature_next();
          }
          if(e.which == 27) {
            tkcm.feature_close();
          }
        });
        document.addEventListener('swiped-left', function(e) {
          tkcm.feature_prev();
        });
        document.addEventListener('swiped-right', function(e) {
          tkcm.feature_next();
        });
        document.addEventListener('swiped-down', function(e) {
          tkcm.feature_close();
        });
        document.addEventListener('swiped-up', function(e) {
          tkcm.feature_close();
        });
        $(document).on('click', 'img.feature-image', function(e){
            var offX  = (e.offsetX || e.pageX - $(e.target).offset().left);
            var offY  = (e.offsetY || e.pageY - $(e.target).offset().top);
            if(offX < ($(this).width()/3.0)){
                tkcm.feature_prev();
            }
            else if(offX > ($(this).width()/3.0)*2){
                if(offY < ($(this).height()*0.2)){
                    tkcm.feature_close();
                }
                else{
                    tkcm.feature_next();
                }
            }
        });
        $(document).on('click', '.feature-shown button.close', function(e){
            tkcm.feature_close();
        });
        $(document).on('click', '.feature .button.previous', function(){
            tkcm.feature_prev();
        });
        $(document).on('click', '.feature .button.next', function(){
            tkcm.feature_next();
        });
        // capture clicks on RHS of images
        $(document).on('click', 'section.feature', function(e){
            if(e.target.tagName.toUpperCase() == 'SECTION'){
                tkcm.feature_next();
            }
        });
    },
    artist_categories_menu: function(){
        $('nav .artists a').on('mouseenter', function(e){
            var category_list = $('nav .specialty');
            category_list.addClass('highlighted');
            $('a', category_list).removeClass('highlight');
            if($(this).data('categories')){
                $($(this).data('categories').split(' ')).each(function(){
                    $('#category-'+this).addClass('highlight');
                });
            }
        }).on('mouseleave', function(e){
            var category_list = $('nav .specialty');
            category_list.removeClass('highlighted');
            $('a', category_list).removeClass('highlight');
        });
        $('nav .specialty a').on('mouseenter', function(e){
            var artist_list = $('nav .artists');
            artist_list.addClass('highlighted');
            $('a', artist_list).removeClass('highlight');
            if($(this).data('artists')){
                $($(this).data('artists').split(' ')).each(function(){
                    $('#artist-'+this).addClass('highlight');
                });
            }
        }).on('mouseleave', function(e){
            var artist_list = $('nav .artists');
            artist_list.removeClass('highlighted');
            $('a', artist_list).removeClass('highlight');
        });
    },
    dt_hover: function(){
        $('dl:not(.credits) a').on('mouseenter', function(e){
            var dd = $(this).closest('dd');
            if (dd.nextUntil('dt').length || dd.prevUntil('dt').length) {
              dd.nextUntil('dt').addClass('lowlight');
              dd.prevUntil('dt').addClass('lowlight');
              dd.addClass('highlight');
            }
        }).on('mouseleave', function(e){
            var dd = $(this).closest('dd');
            if (dd.nextUntil('dt').length || dd.prevUntil('dt').length) {
              dd.nextUntil('dt').removeClass('lowlight');
              dd.prevUntil('dt').removeClass('lowlight');
              dd.removeClass('highlight');
            }
        });
        $('.menu .info a').on('mouseenter', function(e){
          $('.menu .info a').addClass('lowlight');
          $(this).addClass('highlight');
        }).on('mouseleave', function(e){
          $('.menu .info a').removeClass('lowlight');
          $(this).removeClass('highlight');
        });
    },
    initVideos: function(){
        if($('#director-feature-iframe').length == 1){
            tkcm.player = new Vimeo.Player('director-feature-iframe');
        }
        $(document).on(
            'click', '.show-player .player.modal', function(event){
                tkcm.close_player();
            }
        );
        $(document).on(
            'click', (
                '.show-player .player.modal .caption a, ' +
                '.show-player .player.modal .caption span '
            ),
            function(event){
                event.stopPropagation();
            }
        );
        $(document).on(
            'click', '.hide-player a[data-modal-vimeo-id]', function(event){
                event.preventDefault();
                tkcm.show_video(this);
            }
        );
        $(document).on(
            'click', '.show-player .close-player', function(event){
                event.preventDefault();
                tkcm.close_player();
            }
        );
        $(document).on('click', '.show-player button.close', function(e){
            tkcm.close_player();
        });
        $(document).on('keydown', '.show-player', function(e){
          if(e.which == 37) {
            $('.player.modal .button.previous').click();
          }
          if(e.which == 39) {
            $('.player.modal .button.next').click();
          }
          if(e.which == 27) {
            tkcm.close_player();
          }
        });
    },
    show_video: function(link){
        if(tkcm.player){
            tkcm.player.pause();
        }
        var iframe = $('<iframe>');
        var vimeo_id = $(link).data('modal-vimeo-id');
        var video_slug = $(link).data('video-slug');
        $('#modal-player').empty().append(iframe);
        iframe.attr(
            'src',
            'https://player.vimeo.com/video/'+ vimeo_id+ '?autoplay=1'
        );
        tkcm.modal_player = new Vimeo.Player(iframe);
        $('.player.modal .caption').html(
            $(link).find('.caption').html()
        );
        $(link).next('.credits').clone().appendTo(
            $('.player.modal .caption')
        );
        window.location.hash = $(link).data('video-slug');
        var artist_name = $('.player.modal .caption .artist-name');
        if(artist_name.length === 0 && $(link).data('artist-name')){
          $('<a href="'+$(link).data('artist-url')+'">'+$(link).data('artist-name')+'</a>').prependTo($('.player.modal .caption'));
        }
        else if(artist_name.length == 1 && $(link).data('artist-url')){
            artist_name.replaceWith(
                '<a href="'+$(link).data('artist-url')+'">'+artist_name.html()+'</a>'
            )
        }
        var video_slugs = [];
        $('a[data-video-slug]').each(
            function(i, a){
                video_slugs.push($(a).data('video-slug'))
            }
        )
        var video_index = video_slugs.indexOf(video_slug);
        if(video_slugs.length > 0){
            $('.player.modal .button.previous').off('click').on(
                'click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    tkcm.show_video(
                        $('[data-video-slug='+video_slugs[video_index > 0 ? (video_index - 1) : (video_slugs.length - 1)]+']')
                    )
                }
            );
            $('.player.modal .button.next').off('click').on(
                'click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    tkcm.show_video(
                        $('[data-video-slug='+video_slugs[video_index < (video_slugs.length - 1) ? (video_index + 1) : 0]+']')
                    )
                }
            );
        }
        else{
            $('.player.modal .button.previous').hide()
            $('.player.modal .button.next').hide()
        }
        $('body').removeClass('hide-player').addClass('show-player');
    },
    close_player: function(){
        if(tkcm.modal_player){
            tkcm.modal_player.destroy();
        }
        $('.player.modal .caption').empty();
        $('body').removeClass('show-player').addClass('hide-player');
        window.location.hash = '';
    },
    initMenu: function() {
      var delay = 200;
      $(document).on('click', 'header button.menu', function(e){
        $('body').addClass('menu-shown').removeClass('menu-hidden');
        $('body > .main').fadeOut(delay, function() {
          window.scrollTo(0,0);
          $('body > nav.menu').fadeIn(delay);
        });
      });
      $(document).on('click', '.menu-shown header button.close', function(e){
        $('body').addClass('menu-hidden-again').removeClass('menu-shown');
        $('body > nav.menu').fadeOut(
          delay,
          function(){
            $('body > .main').fadeIn(delay);
          }
        );
      });
      $(document).on('click', '.menu-tabs span', function(e){
        $('nav.menu section').removeClass('show-mobile');
        $('nav.menu section.' + $(this).attr('class')).addClass('show-mobile');
      });
    },
    initNewsFilter: function() {
      $(document).on('click', '.filter-collapsed .expand-filter', function(e){
        $('body').addClass('filter-expanded').removeClass('filter-collapsed');
      });
      $(document).on('click', '.filter-expanded .collapse-filter', function(e){
        $('body').addClass('filter-collapsed').removeClass('filter-expanded');
      });
    },
    initMobileArtistNav: function() {
      $(document).on('click', '.mobile-artist-nav a.bio', function(e){
        $('body').addClass('show-bio').removeClass('show-portfolio-list show-contact-links');
      });
      $(document).on('click', '.mobile-artist-nav a.portfolios', function(e){
        $('body').addClass('show-portfolio-list').removeClass('show-bio show-contact-links');
      });
      $(document).on('click', '.mobile-artist-nav a.contact', function(e){
        $('body').addClass('show-contact-links').removeClass('show-bio show-portfolio-list');
      });
    },
    initShareLinks: function(){
        $(document).on('click', 'a.share', function(e){
            var sharable = $(this).closest('.sharable');
            if(sharable.length != 1){
                return;
            }
            var url = sharable.data('share-url');
            var title = sharable.data('share-title');
            var width = 600;
            var height = 600;
            if($(this).hasClass('google')){
                var href = 'https://plus.google.com/share?url=' + escape(url);
            }
            else if($(this).hasClass('facebook')){
                var href = 'https://www.facebook.com/sharer.php?u=' +
                    escape(url);
            }
            else if($(this).hasClass('twitter')){
                var href = 'https://twitter.com/share?url=' +
                    escape(url) + '&text=' + escape(title);
            }
            else if($(this).hasClass('email')){
                href = 'mailto:?subject=' +
                    escape(title) +
                    '&body=Check this out: %0D%0A%0D%0A' +
                    escape(url);
            }
            else{
                return;
            }
            e.preventDefault();
            window.open(
                href,
                '',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' +
                    height + ',width=' + width
            );
        });
    },
    initScrollObserver: function() {
      // TBC: ES6 OK?
      const debounce = (fn) => {
        let frame;
        return (...params) => {
          if (frame) { cancelAnimationFrame(frame); }
          frame = requestAnimationFrame(() => { fn(...params); });
        }
      };
      const threshold = 150;
      const storeScroll = () => {
        document.documentElement.dataset.scroll = Math.max(
          window.scrollY,
          threshold
        ) - threshold;
      }
      document.addEventListener(
        'scroll',
        debounce(storeScroll), {
          passive: true,
        }
      );
      storeScroll();
    },
    nop: function(){}
};

$(document).ready(function(){
    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false,
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader(
                    "X-CSRFToken", tkcm.get_cookie('csrftoken')
                );
            }
        }
    });
    tkcm.initScrollObserver();
    tkcm.artist_categories_menu();
    tkcm.dt_hover();
    tkcm.bind_feature_buttons();
    tkcm.initMenu();
    tkcm.initNewsFilter();
    tkcm.initMobileArtistNav();
    tkcm.initShareLinks();
    tkcm.initVideos();
    $(document).on('click', '.portfolio-detail:not(.sortable) .content .item:not(.featured)', function(e){
        if(e.target.tagName.toLowerCase() == 'img'){
            tkcm.feature_image(this);
        }
    });
    if(window.location.hash){
      var video = $('[data-video-slug='+window.location.hash.replace('#', '')+']');
      if(video.length){
        tkcm.show_video(video);
      }
    }
});
