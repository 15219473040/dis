## JSX语法

JSX本身就和XML语法类似，可以定义属性以及子元素。唯一特殊的是可以用大括号来加入JavaScript表达式，例如

```
  class HelloMessage extends React.Component {
      render() {
          return <div>Hello {this.props.name}</div>;
      }
  }
  ReactDOM.render(
          <HelloMessage name="hellow World"/>,
      document.getElementById('root')
  );

```
HelloMessage 继承自 React.Component

1. Component 源码如下
```
    /**
     * Base class helpers for the updating state of a component.
     */
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      // If a component has string refs, we will assign a different object later.
      this.refs = emptyObject;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue;
    }

```
2. render的操作是 将 render（<App />）中的 App转为 ReactElement.具体操作如下：
 + 通过 createElement(type, config, children) 
 ```
   function createElement(type, config, children) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;
   ...
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
 
 ```
 + 以上调用了ReactElement。具体见源码
 ```
   var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };
    ...
    return element;
 
 ```
 + 以上生成的elment 就是reactElement，也就是一个组件
 ## 判断一个元素是否是 reactElement 元素可以通过 isValidElement 方法判断，其代码如下：
 ```
 function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
 
 ```
 由此可以，它的类型取决于REACT_ELEMENT_TYPE
 
