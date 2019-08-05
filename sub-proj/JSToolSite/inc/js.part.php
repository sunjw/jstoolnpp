<script type="text/javascript" src="../js/jquery-3.3.1.min.js"></script>
<script type="text/javascript">
//<![CDATA[
var headerLogo = 0;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "";
}

function getScrollTop() {
    return (window.pageYOffset ||
        document.body.scrollTop ||
        document.documentElement.scrollTop);
}

function smoothScrollToTop(topWhere) {
    $("html, body").animate({
        scrollTop: topWhere
    }, 333);
}

function scrollToElem(elem) {
    var elemTop = elem.offset().top;
    elemTop -= 64;
    smoothScrollToTop(elemTop);
}

function scrollFromLink(link) {
    var anchorName = $.attr(link, "href").substr(1);
    if (anchorName == "top") {
        smoothScrollToTop(0);
    } else {
        var scrollToAnchor = $("[name=\"" + anchorName + "\"]");
        scrollToElem(scrollToAnchor);
    }
    return false;
}

function onPageScroll() {
    var scrollTopPos = getScrollTop();

    if (scrollTopPos < 48) {
        headerLogo.hide();
    } else {
        headerLogo.fadeIn();
    }
}

$(function () {
    headerLogo = $("#navWrapper #navLeft #logo");

    $("#navWrapper a").click(function () {
        return scrollFromLink(this);
    });
    $("a.smoothAnchor").click(function () {
        return scrollFromLink(this);
    });

    var jqWindow = $(window);
    jqWindow.scroll(function () {
        onPageScroll();
    });
    jqWindow.resize(function () {
        onPageScroll();
    });
    onPageScroll();

    if (getQueryVariable("ver") != "") {
        // Check version
        var scrollToDownload = $("[name=\"download\"]");
        scrollToElem(scrollToDownload);
    }
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-5927560-3']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

//]]>
</script>
