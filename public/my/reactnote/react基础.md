## 一，jsx
React DOM 在渲染之前默认会 过滤 所有传入的值。它可以确保你的应用不会被注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS(跨站脚本) 攻击。
### JSX 代表 Objects

Babel 转译器会把 JSX 转换成一个名为 React.createElement() 的方法调用。

下面两种代码的作用是完全相同的：

```
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

```

## 元素渲染

要将React元素渲染到根DOM节点中，我们通过把它们都传递给 ReactDOM.render() 的方法来将其渲染到页面上：
```

const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

以上react元素是dom，它还可以是函数，类；所有的React组件必须像纯函数那样使用它们的props。

## State & 生命周期
state是react中很重要的一个成员，相当于开关，在组件内部使用很方便，它可以接收服务端数据，也可以接受父级组件传来的props数据。更新state通过setState便可实现
，setState是异步执行，state有以下特点：
1. setState不会立刻改变React组件中state的值
2. setState通过引发一次组件的更新过程来引发重新绘制，重绘指的就是引起React的更新生命周期函数4个函数：
    * shouldComponentUpdate（被调用时this.state没有更新；如果返回了false，生命周期被中断，虽然不调用之后的函数了，但是state仍然会被更新）
    * componentWillUpdate（被调用时this.state没有更新）
    * render（被调用时this.state得到更新）
    * componentDidUpdate
3. 多次setState函数调用产生的效果会合并。
    ```
      this.setState({name: 'Pororo'})
      this.setState({age: 20})
      this.setState({name: 'Pororo'，age: 20})
    ```
    上面两块代码的效果是一样的。如果每次调用都引发一次生命周期更新，那性能就会消耗很大了。所以，React会将多个this.setState产生的修改放进一个队列里，等差不多的时候就会引发一次生命周期更新。
### setState 的流程图为
<img src="https://note.youdao.com/yws/public/resource/779aae439a4b988a0a535e3b02ef9eb5/xmlnote/69F576BA52CA40229768CC678D2BDAD2/5489" style="width:80%;margin 2% auto">
> 每次setState产生新的state会依次被存入一个队列，然后会根据isBacthingUpdates变量判断是直接更新this.state还是放进dirtyComponent里回头再说。isBatchingUpdates默认是false，也就表示setState会同步更新this.state。但是，当React在调用事件处理函数之前就会调用batchedUpdates，这个函数会把isBatchingUpdates修改为true，造成的后果就是由React控制的事件处理过程setState不会同步更新this.state。    

### 同步更新state的办法
1. callback
    ```
          this.setState({  
      count: this.state.count + 1
    }, () => {
      this.setState({
        count: this.state.count + 1
      });
    });
    ```
    可以用promise封装下
    
    ```
            function setStateAsync(nextState){  
          return new Promise(resolve => {
            this.setState(nextState, resolve);
          });
        }
        
    ```
2. 函数方式   
nextState也可以是一个function，称为状态计算函数，结构为function(state, props) => newState。这个函数会将每次更新加入队列中，执行时通过当前的state和props来获取新的state。那么上面的例子就可以这样写
```
  this.setState((state, props) => {
    return {count: state.count + 1};
})
console.log(this.state.count) // 第一次输出
this.setState((state, props) => {
    return {count: state.count + 1};
})

```
3. 将setState放在定时器里面

## 事件处理
### 向事件处理程序传递参数

```
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>

```
上面两个例子中，参数 e 作为 React 事件对象将会被作为第二个参数进行传递。通过箭头函数的方式，事件对象必须显式的进行传递，但是通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。

值得注意的是，通过 bind 方式向监听函数传参，在类组件中定义的监听函数，事件对象 e 要排在所传递参数的后面，例如:
```
    class Popper extends React.Component{
    constructor(){
        super();
        this.state = {name:'Hello world!'};
    }
    
    preventPop(name, e){    //事件对象e要放在最后
        e.preventDefault();
        alert(name);
    }
    
    render(){
        return (
            <div>
                <p>hello</p>
                {/* Pass params via bind() method. */}
                <a href="https://reactjs.org" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>
            </div>
        );
    }
}

```


## 表单之select 标签

在HTML当中，<select>会创建一个下拉列表，selected属性是被选中的一项，在React中，并不使用之前的selected属性，而在根select标签上用value属性来
表示选中项。这在受控组件中更为方便，因为你只需要在一个地方来更新组件 
 
  ```
 <select value={this.state.value} onChange={this.handleChange}>
 
  ```


















