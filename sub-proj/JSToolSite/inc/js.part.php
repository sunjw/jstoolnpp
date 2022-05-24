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
//]]>
</script>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6G05WHKSZ6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6G05WHKSZ6');
</script>
