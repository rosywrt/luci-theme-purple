/**
 *  Purple is a theme for LuCI. It is based on luci-theme-bootstrap
 *
 *  luci-theme-purple
 *     Copyright 2018 Rosy Song <rosysong@rosinson.com>
 *     Copyright 2018 Yan Lan Shen <yanlan.shen@rosinson.com>
 *
 *   Have a bug? Please create an issue here on GitHub!
 *       https://github.com/rosywrt/luci-theme-purple/issues
 *
 *  luci-theme-bootstrap:
 *      Copyright 2008 Steven Barth <steven@midlink.org>
 *      Copyright 2008 Jo-Philipp Wich <jow@openwrt.org>
 *      Copyright 2012 David Menting <david@nut-bolt.nl>
 *
 *  Licensed to the public under the Apache License 2.0
 */
$(".main > .loading").fadeIn('fast');
(function ($) {
    $(".main > .loading").fadeOut('fast');

    /**
     * trim text, Remove spaces, wrap
     * @param text
     * @returns {string}
     */
    function trimText(text) {
        return text.replace(/[ \t\n\r]+/g, " ");
    }


    var lastNode = undefined;
    var mainNodeName = undefined;

    var nodeUrl = "";
    (function (node) {
        var luciLocation;
        if (node[0] == "admin") {
            luciLocation = [node[1], node[2]];
        } else {
            luciLocation = node;
        }

        for (var i in luciLocation) {
            nodeUrl += luciLocation[i];
            if (i != luciLocation.length - 1) {
                nodeUrl += "/";
            }
        }
    })(luciLocation);

    /**
     * get the current node by Burl (primary)
     * @returns {boolean} success?
     */
    function getCurrentNodeByUrl() {
        var ret = false;
        if (!$('body').hasClass('logged-in')) {
            luciLocation = ["Main", "Login"];
            return true;
        }

        $(".main > .main-left .nav > .slide > .menu").each(function () {
            var ulNode = $(this);
            ulNode.next().find("a").each(function () {
                var that = $(this);
                var href = that.attr("href");

                if (href.indexOf(nodeUrl) != -1) {
                    ulNode.click();
                    ulNode.next(".slide-menu").stop(true, true);
                    lastNode = that.parent();
                    lastNode.addClass("active");
                    ret = true;
                    return true;
                }
            });
        });

        return ret;
    }


    /**
     * hook menu click and add the hash
     */
    $(".main > .main-left .nav > .slide > .slide-menu > li > a").click(function () {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).parent().addClass("active");
        $(".main > .loading").fadeIn("fast");
        return true;
    });

    /**
     * fix menu click
     */
    $(".main > .main-left .nav > .slide > .slide-menu > li").click(function () {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).addClass("active");
        $(".main > .loading").fadeIn("fast");
        window.location = $($(this).find("a")[0]).attr("href");
        return false;
    });

    /**
     * get current node and open it
     */
    if (getCurrentNodeByUrl()) {
        mainNodeName = "node-" + luciLocation[0] + "-" + luciLocation[1];
        mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, "_").toLowerCase();
        $("body").addClass(mainNodeName);
    }
    $(".cbi-button-up").val("");
    $(".cbi-button-down").val("");


    /**
     * hook other "A Label" and add hash to it.
     */
    $("#maincontent > .container").find("a").each(function () {
        var that = $(this);
        var onclick = that.attr("onclick");
        if (onclick == undefined || onclick == "") {
            that.click(function () {
                var href = that.attr("href");
                if (href.indexOf("#") == -1) {
                    $(".main > .loading").fadeIn("fast");
                    return true;
                }
            });
        }
    });

    /**
     * fix legend position
     */
    $("legend").each(function () {
        var that = $(this);
        that.after("<span class='panel-title'>" + that.text() + "</span>");
    });

    $(".cbi-section-table-titles, .cbi-section-table-descr, .cbi-section-descr").each(function () {
        var that = $(this);
        if (that.text().trim() == "") {
            that.css("display", "none");
        }
    });


    $(".main-right").focus();
    $(".main-right").blur();
    $("input").attr("size", "0");

    if (mainNodeName != undefined) {
        console.log(mainNodeName);
        switch (mainNodeName) {
            case "node-status-system_log":
            case "node-status-kernel_log":
                $("#syslog").focus(function () {
                    $("#syslog").blur();
                    $(".main-right").focus();
                    $(".main-right").blur();
                });
                break;
            case "node-status-firewall":
                var button = $(".node-status-firewall > .main fieldset li > a");
                button.addClass("cbi-button cbi-button-reset a-to-btn");
                break;
            case "node-system-reboot":
                var button = $(".node-system-reboot > .main > .main-right p > a");
                button.addClass("cbi-button cbi-input-reset a-to-btn");
                break;
        }
    }

    /*
     * Empty the login button value
     */
    if ($('.node-main-login>.main form .cbi-button-apply')[0]) {
        $('.node-main-login>.main form .cbi-button-apply')[0].value = '';
    }

    /*
     * Make navigation first character bigger.
     */
    $('.main .nav-shell > .nav .slide-menu a').each(function (i, e) {
        var elemFir = $(this).text();
        var b = `<span>${elemFir[0]}</span>`;
        var small = elemFir.substr(1, elemFir.length);
        small = `<samll>${small}</samll>`;
        $(this).html(b + small);
    });

    /*
     * Remove the class name on the right level of navigation.
     */
    $('.main .main-left .top-menu .nav .slide a').removeClass('col-xs-1');

    /*
     * Add the class name on the right level of navigation.
     */
    var shell = '';
    $('.nav-shell .nav .slide-menu li').each(function (i, e) {
        if ($(this).attr('class')) {
            var domClass = $(this).attr('class').indexOf('active');
        }

        if (domClass > -1) {
            shell = $(this).parent().prev().text();
        }
    });

    $('.main .main-left .top-menu .nav .slide').each(function () {
        if ($(this).text() == shell) {
            $(this).addClass('active');
        }
    });

    /*
     * Menu button event
     */
    $('.main .sidebar .close').click(function () {
        $('.main-left').fadeOut('fast');
        $(this).fadeOut('fast');
        $('.main .sidebar .root-btn').fadeIn('fast');
        $('.main .sidebar .open').fadeIn('fast');
    });
    $('.main .sidebar .open').click(function () {
        $('.main-left').fadeIn('fast');
        $('.main .sidebar .close').fadeIn('fast');
        $(this).fadeOut('fast');
        $('.main .sidebar .root-btn').fadeOut('fast');
    });
    $('header .close').click(function () {
        $('.main-left').fadeOut('fast');
        $(this).css('display', 'none');
        $('header .open').css('display', 'inline-block');
    });
    $('header .open').click(function () {
        $('.main-left').fadeIn('fast');
        $(this).css('display', 'none');
        $('header .close').css('display', 'inline-block');
    });

    var waringL = $('.node-main-login .alert-message.warning').length;
    var inp = $('.node-main-login>.main form .cbi-button-apply');
    var top = parseInt($('.node-main-login>.main form .cbi-button-apply').css('top'));
    if(waringL > 0){
        inp.css('top', 48 + top);
    }

    /*
     * auto refresh on / off
     */
    $('.main .sidebar #xhr_poll_status_on').click(function () {
        $(this).css('display', 'none');
        $('.main .sidebar #xhr_poll_status_off').fadeIn();
    });
    $('.main .sidebar #xhr_poll_status_off').click(function () {
        $(this).css('display', 'none');
        $('.main .sidebar #xhr_poll_status_on').fadeIn();
    });

    $('.logged-in .container').css('min-height', $(window).height());
    $('.node-main-login').height($(window).height());
    $(window).resize(function(){
        $('.logged-in .container').css('min-height', $(window).height());
        $('.node-main-login').height($(window).height());
    });

    $('.table').wrap('<div class="table-container"></div>');

})(jQuery);
