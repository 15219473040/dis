### match方法
>   match 方法是最常用的String正则表达式方法，它的参数是唯一的，就是一个正则表达式（可以是字面量，也可以由new RegExp()产生）；返回值有以下两种情况：
1. 带修饰符g的情况，返回一个包含所有匹配项的数组，
```
  var s="1err2jjj4"

  s.match(/\d/g)

  (3) ["1", "2", "4"]

```
2. 不带修饰符g的情况，返回一个数组，数组第一项为匹配项,第二个为与第一个用圆括号括起来的表达式相匹配的子串 a[n]--> $n
```
  var s="1err2jjj4"

  s.match(/\d/)
  ["1", index: 0, input: "1err2jjj4", groups: undefined]
  
  s.match(/[a-z]+(\d)/)
  (2) ["err2", "2", index: 1, input: "1err2jjj4", groups: undefined]
  
```
