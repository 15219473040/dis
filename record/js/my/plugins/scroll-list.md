```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      .container {
        width: 380px;
        margin: auto;
      }
      .list {
        height: 400px;
        overflow: auto;
        border: 1px solid #ddd;
      }
      .list__item {
        height: 220px;
        border: 1px solid #00ff00;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="list">
        <div class="list__item" id="item1">item1</div>
        <div class="list__item" id="item2">item2</div>
        <div class="list__item" id="item3">item3</div>
        <div class="list__item" id="item4">item4</div>
        <div class="list__item" id="item5">item5</div>
        <div class="list__item" id="item6">item6</div>
        <div class="list__item" id="item7">item7</div>
      </div>
    </div>
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
    <script>
      let con = $('.container')
      $('.list').scroll(function() {
        var tarContainer = this
        var items = $('.list__item')

        for (var i = 0; i < items.length; i++) {
          var isvisible = $(items)
            .eq(i)
            .isOnScreen.call(items[i], tarContainer)
          console.log(isvisible)
          if (isvisible) {
            console.log(items[i].innerHTML + '=======time:' + Math.random())
            break
          } else {
            continue
          }
        }
      })

      $.fn.isOnScreen = function(tarContainer) {
        var win = $(tarContainer)
        console.log(this)
        var vBottom = win.height() + win.scrollTop()
        var curTop = this.offsetTop
        var curBottom = curTop + this.offsetHeight
        var scrollTop = win.scrollTop()
        return curBottom > scrollTop && vBottom > scrollTop
      }
    </script>
  </body>
</html>

```
