### js部分
```
;(function(g, f) {
    g.Lazy = f()
})(this, function(params) {
    var Lazy = function Lazy(params) {
        this.container =
            document.querySelector(params.container) || document.body
        this.itemBoxClass = params.itemBoxClass || 'img-wraper'
        this.init()
    }
    Lazy.prototype.init = function init() {
        // this.container.onscroll = debounce(
        //     this.events.onscroll.bind(this),

        //     300
        // )
        this.container.onscroll = throttle(
            this.events.onscroll.bind(this),
            100,
            100
        )
        // this.container.onscroll = this.events.onscroll.bind(this)
    }

    Lazy.prototype.events = {
        onscroll: function() {
            var ocon = this.container
            var maxScrool = ocon.scrollHeight - ocon.clientHeight

            if (maxScrool - ocon.scrollTop < 10) {
                _wrapHtml = this.creageHTMLIner(ocon.children.length + 1, 1)
                ocon.appendChild(_wrapHtml)
            }

            _wrapHtml = document.querySelectorAll(
                '.' + this.itemBoxClass + '[data-loaded="unLoaded"]'
            )

            for (var i = 0; i < _wrapHtml.length; i++) {
                var el = _wrapHtml[i]
                var elH = el.offsetHeight
                var offH = ocon.clientHeight - el.getBoundingClientRect().top

                if (offH - elH / 2 > 0 && ocon.clientHeight > offH - elH / 2) {
                    var img = el.querySelector('img')
                    el.dataset.loaded = 'loaded'
                    img.style.display = 'block'
                    img.src = img.dataset.src
                }
            }
        }
    }

    Lazy.prototype.creageHTMLIner = function(start, num) {
        var fragMent = document.createDocumentFragment()

        for (var i = start; i < start + num; i++) {
            var wrap = document.createElement('div')
            wrap.className = 'img-wraper'
            wrap.setAttribute('data-num', i)
            wrap.setAttribute('data-loaded', 'unLoaded')

            wrap.innerHTML +=
                '<img  style="display:none" data-src="./img/t (' +
                ((i % 37) + 1) +
                ').jpg" alt=""><span>img ' +
                i +
                '</span>'

            fragMent.appendChild(wrap)
        }

        return fragMent
    }

    var throttle = function(func, wait, mustRun) {
        var timeout,
            startTime = new Date()
        return function() {
            var context = this,
                args = arguments,
                curTime = new Date()
            clearTimeout(timeout)
            if (curTime > startTime > mustRun) {
                func.apply(context, args)
                startTime = curTime
            } else {
                timeout = setTimeout(func, wait)
            }
        }
    }
    function debounce(fn, delay) {
        var delay = delay || 200
        var timer
        return function() {
            var th = this
            var args = arguments
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(function() {
                timer = null
                fn.apply(th, args)
            }, delay)
        }
    }

    return Lazy
})

new Lazy({
    container: '.cont',
    itemBoxClass: 'img-wraper'
})


```
### html，，css部分
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>lazyLoad</title>
        <style>
            .cont {
                width: 330px;
                height: 500px;
                border: 1px solid #eee;
                margin: auto;
                overflow-y: scroll;
            }
            .img-wraper {
                height: 100px;
                overflow: hidden;
                border-bottom: 1px solid #f7f7f7;
                display: flex;
                align-items: center;
                color: #444;
                font-size: 12px
            }
            .img-wraper img{width:100px;border: 1px solid #eee;box-sizing: border-box;transition: all 1s;}
            .img-wraper span{padding-left: 1em;}
        </style>
    </head>
    <body>
        <div class="cont">
            <div class="img-wraper">
                <img src="./img/t (1).jpg" alt="">
                <span>img 1</span>
            </div>
            <div class="img-wraper">
                <img src="./img/t (2).jpg" alt="">
                <span>img 2</span>
            </div>
            <div class="img-wraper">
                <img src="./img/t (3).jpg" alt="">
                <span>img 3</span>
            </div>
            <div class="img-wraper">
                <img src="./img/t (4).jpg" alt="">
                <span>img 4</span>
            </div>
            <div class="img-wraper">
                <img src="./img/t (5).jpg" alt="">
                <span>img 5</span>
            </div>
        </div>
        <script>
            // var ocon = document.querySelector('.cont')
            // ocon.onscroll = function() {
            //     var maxScrool = ocon.scrollHeight - ocon.clientHeight

            //     if (maxScrool - ocon.scrollTop < 10) {

            //         _wrapHtml = creageHTMLIner(ocon.children.length + 1, 5);
                
            //         ocon.appendChild(_wrapHtml)               
            //     }
            //               _wrapHtml = document.querySelectorAll(".img-wraper")

            //     for (var i = 0; i < _wrapHtml.length; i++) {
            //         var el = _wrapHtml[i];
            //         var elH = el.offsetHeight
            //         var offH = ocon.clientHeight - el.getBoundingClientRect().top;
            //         console.log(offH)
            //         if (offH - elH / 2 > 0) {
            //            var img= el.querySelector("img");
            //                img.style.display = "block"
            //                img.src=img.dataset.src;
            //         }
            //     }
            // }

            // function creageHTMLIner(start, num) {
            //     var fragMent = document.createDocumentFragment()

            //     for (var i = start; i < start + num; i++) {
            //         var wrap = document.createElement('div')
            //         wrap.className = 'img-wraper'
            //         wrap.setAttribute("data-num",i);

            //         wrap.innerHTML += '<img  style="display:none" data-src="./img/t ('+i%37+').jpg" alt=""><span>img ' + i + '</span>'

            //         fragMent.appendChild(wrap)
            //     }

            //     return fragMent
            // }
        </script>
        <script src="./js/customLazyLoader.js"></script>
    </body>
</html>


```
