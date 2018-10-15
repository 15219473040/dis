## [js 核心概念，及解析](http://www.cnblogs.com/TomXu/archive/2012/01/12/2308594.html)

1.原型链
  + 概念
  > A prototype chain is a finite chain of objects which is used to implemented inheritance and shared properties.
原型链是一个由对象组成的有限对象链由于实现继承和共享属性。
  + 举例概述
  > 类似于类”A”，”B”，”C”，在ECMAScript中尼创建对象类”a”，”b”，”c”，相应地， 对象“a” 拥有对象“b”和”c”的共同部分。同时对象“b”和”c”只包含它们自己的附加属性或方法。
  ```
      var a = {
      x: 10,
      calculate: function (z) {
        return this.x + this.y + z
      }
    };

    var b = {
      y: 20,
      __proto__: a
    };

    var c = {
      y: 30,
      __proto__: a
    };

    // 调用继承过来的方法
    b.calculate(30); // 60
    c.calculate(40); // 80
  
  ```
  > 除了创建对象，构造函数(constructor) 还做了另一件有用的事情—自动为创建的新对象设置了原型对象(prototype object) 。原型对象存放于 ConstructorFunction.prototype 属性中。
  ```
      // 构造函数
    function Foo(y) {
      // 构造函数将会以特定模式创建对象：被创建的对象都会有"y"属性
      this.y = y;
    }

    // "Foo.prototype"存放了新建对象的原型引用
    // 所以我们可以将之用于定义继承和共享属性或方法
    // 所以，和上例一样，我们有了如下代码：

    // 继承属性"x"
    Foo.prototype.x = 10;

    // 继承方法"calculate"
    Foo.prototype.calculate = function (z) {
      return this.x + this.y + z;
    };

    // 使用foo模式创建 "b" and "c"
    var b = new Foo(20);
    var c = new Foo(30);

    // 调用继承的方法
    b.calculate(30); // 60
    c.calculate(40); // 80

    // 让我们看看是否使用了预期的属性

    console.log(

      b.__proto__ === Foo.prototype, // true
      c.__proto__ === Foo.prototype, // true

      // "Foo.prototype"自动创建了一个特殊的属性"constructor"
      // 指向a的构造函数本身
      // 实例"b"和"c"可以通过授权找到它并用以检测自己的构造函数

      b.constructor === Foo, // true
      c.constructor === Foo, // true
      Foo.prototype.constructor === Foo // true

      b.calculate === b.__proto__.calculate, // true
      b.__proto__.calculate === Foo.prototype.calculate // true

    );
  
  ```
2. 执行上下文
>  一个执行上下文可以激活另一个上下文，就好比一个函数调用了另一个函数(或者全局的上下文调用了一个全局函数)，然后一层一层调用下去。逻辑上来说，这种实现方式是栈，我们可以称之为上下文堆栈。

> 激活其它上下文的某个上下文被称为 调用者(caller) 。被激活的上下文被称为被调用者(callee) 。被调用者同时也可能是调用者(比如一个在全局上下文中被调用的函数调用某些自身的内部方法)。
> 当一个caller激活了一个callee，那么这个caller就会暂停它自身的执行，然后将控制权交给这个callee. 于是这个callee被放入堆栈，称为进行中的上下文[running/active execution context]. 当这个callee的上下文结束之后，会把控制权再次交给它的caller，然后caller会在刚才暂停的地方继续执行。在这个caller结束之后，会继续触发其他的上下文。一个callee可以用返回（return）或者抛出异常（exception）来结束自身的上下文。

  
2. 作用域链
  + 概念
  > A scope chain is a list of objects that are searched for identifiers appear in the code of the context.
作用域链是一个 对象列表(list of objects) ，用以检索上下文代码中出现的 标识符(identifiers) 。
