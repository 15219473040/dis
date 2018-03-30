(function (win, doc) {

    var l_ser = location.search;
    var longTime = new Date().getTime() - localStorage.getItem("myHistory")

    if (localStorage.getItem("myHistory") && longTime < 10 * 1000 * 60) {
        console.log(longTime - 1 * 1000 * 60)
        return;
    }

    console.log("start")

    history.replaceState(null, doc.title, location.pathname + "#/r");
    history.pushState(null, doc.title, location.pathname + l_ser);
    // oppo 在此需要用为其做兼容，可以用jq
    win.addEventListener("popstate", function () {
        if (location.hash == "#/r") {

            localStorage.setItem("myHistory", new Date().getTime());
            localStorage.setItem("beijingTIME", new Date());

            win.location.href = "http://www.baidu.com";
        }
    }, false);


})(window, document);