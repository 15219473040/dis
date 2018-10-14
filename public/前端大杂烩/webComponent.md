### 对shadowDom原型抽离

 ```
 var XX_Tag = (function() {
  var __C__ = {
    register: function(tagName, options) {
      if (!tagName) {
        throw new Error("parameter <tagName> is required");
      }
      var __root__;
      var __opt__ = options || {};
      var __lc__ = __opt__.lifeCycle || {};
      var __ms__ = __opt__.methods || {};

      var globalDoc = document; //上下文document对象
      var currentDoc = globalDoc.currentScript.ownerDocument; //当前文档
      var templ = currentDoc.querySelector("template"); //模板对象
      var xnTagProto = Object.create(HTMLElement.prototype);

      xnTagProto.createdCallback = function() {
        __root__ = this.createShadowRoot();
        __root__.appendChild(globalDoc.importNode(templ.content, true));
        __C__.extend.call(this, __ms__);
        __lc__.created && __lc__.created.call(this, __root__);
      };
      xnTagProto.attachedCallback = function() {
        __lc__.attached && __lc__.attached.call(this, arguments);
      };
      xnTagProto.detachedCallback = function() {
        __lc__.detached && __lc__.detached.call(this, arguments);
      };
      xnTagProto.attributeChangedCallback = function() {
        __lc__.attributeChanged &&
          __lc__.attributeChanged.call(this, arguments);
      };

      globalDoc.registerElement(tagName, { prototype: xnTagProto });
    },

    extend: function(target) {
      for (const prop in target) {
        if (target.hasOwnProperty(prop)) {
          this[prop] = target[prop];
        }
      }
    }
  };

  return __C__;
})();

 
 ```
 ### 组件中的使用
 
```
<template>
    <style>
        button {
            color: #f00;
        }
    </style>
    <button id="btn"></button>
</template>
<script src="./core/core.js"></script>
<script>
    XX_Tag.register("my-button", {
        lifeCycle: {
            created: function (root) {

                this.render(root)
            },
            attached: function () {
                console.log("attachedCallback", arguments);
            },
            detached: function () {
                console.log("detachedCallback", arguments);
            },
            attributeChanged: function (n, ov, nv) {
                console.log("dnTag某个属性被改变了", n, ov, nv);
            }
        },
        methods: {
            render: function (root) {
                root.getElementById("btn").innerHTML = this.getAttribute("text");
            }
        }
    })
</script>

```
