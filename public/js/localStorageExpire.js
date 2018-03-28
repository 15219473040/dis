(function (win, doc) {


    var longTime = new Date().getTime() - localStorage.getItem("myHistory")

    if (localStorage.getItem("myHistory") && longTime < 10 * 1000 * 60) {
        console.log(longTime - 1 * 1000 * 60)
        return;
    }

    console.log("start")

    history.replaceState(null, doc.title, location.pathname + "#/r");
    history.pushState(null, doc.title, location.pathname);
    win.addEventListener("popstate", function () {
        if (loc.hash == "#/r") {

            localStorage.setItem("myHistory", new Date().getTime());
            localStorage.setItem("bei", new Date());

            win.location.href = "http://www.baidu.com";
        }
    }, false);


})(window, document);