
#### 日历组件的雏形
```
    (function(g, f) {
      g.Cal = f();
    })(this, function(params) {
      function Cal(ctn, options) {
        this.ctn = ctn;
        this.options = options || {};
        this.curTimeStr = this.options.selectedDate;
        this.init();
      }
      // init
      Cal.prototype.init = function() {
        this.setTime();
        this.render();
        // this.btns = document.querySelector(".calendar-header");
        this.ctn.addEventListener("click", this.eventHandle.bind(this), false);
      };
      // Cal.prototype.eventHandle
      Cal.prototype.eventHandle = function(e) {
        switch (e.target.id) {
          case "nextMonth":
            this.eventNextMonth();
            break;

          default:
            break;
        }
        this.render();
      };
      // Cal.prototype.eventNextMonth
      Cal.prototype.eventNextMonth = function(params) {
        this.setTime(this.year, this.month + 1, 1);
        console.log(this.month);
      };
      //   setTime
      Cal.prototype.setTime = function name(timeString) {
        timeString = timeString || Date.now();
        var nowT = new Date(...arguments);
        this.year = nowT.getFullYear();
        this.month = nowT.getMonth();
        this.date = nowT.getDate();
        this.mouth_0_day = new Date(this.year, this.month, 1).getDay();
        this.month_count = this.getMonth_count(this.month);
      };
      Cal.prototype.getMonth_count = function(month) {
        var monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        monthes[1] += isLeapYear(this.year) ? 1 : 0;
        return monthes[month];
      };
      //  render
      Cal.prototype.render = function(params) {
        var _html = `
                <div class="calendar">
                <div class="calendar-header">
                    <button>上年</button >
                    <button>上月</button >
                    <em class="selected-year">${this.year}</em>年
                    <em class="selected-month">${this.month + 1}</em>月
                    <em class="selected-day">${this.date}</em>日
                    <button id="nextMonth">下月</button>
                    <button>下年</button>
                </div>
                <div class="calendar-body">
                    <div class="calendar-week">
                        <span>星期一</span>
                        <span>星期二</span>
                        <span>星期三</span>
                        <span>星期四</span>
                        <span>星期五</span>
                        <span>星期六</span>
                        <span>星期日</span>
                    </div>
                <div class="calendar-list">`;

        for (let i = 0; i < this.mouth_0_day - 1; i++) {
          _html += ` <span class="not-allowed"></span>`;
        }

        for (let i = 0; i < this.month_count; i++) {
          const element = i;
          _html += ` <span class="">${element + 1}</span>`;
        }

        _html += `</div></div></div>`;

        this.ctn.innerHTML = _html;
      };

      function isLeapYear(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
      }

      return Cal;
    });


```
#### 样式代码：
```
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body{font-size: 14px;}
        .container {
            width: 500px;
            margin: auto;
        }

        .calendar {
            width: 4rem;
            margin: auto;
            border: 1px solid#333;
        }

        .calendar-header {
            text-align: center;
            padding: 1% 0;
        }

        .calendar-header em {
            margin-right: 5px;
            color: #333
        }

        .calendar-week {
            display: flex;
            justify-content: space-between
        }
        .calendar-week>span{
            width: 0.57rem;
            text-align: center;
            padding: 1% 0;
        }

        .calendar-list {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap
        }

        .calendar-list>span {
            width: 0.57rem;
            height: 0.57rem;
            line-height: 0.57rem;
            text-align: center;    
            border: 1px solid #eee;
        
            box-sizing: border-box;
        }
        .not-allowed{
            cursor: not-allowed;
            user-select: none;
        }
        .calendar-act{
            background:#de6b50
        }
    </style>

```
