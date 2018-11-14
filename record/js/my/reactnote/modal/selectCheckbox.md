### select + checkbox 组合多选
```
/**
 * Created by Wagnxx on 2018/11/15.
 */
import React from 'react';
import {Checkbox, Form, Row, Col, Icon, Tag} from 'antd';

const CheckboxGroup = Checkbox.Group


export default class SelectCheckbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      checkVal: [],
      returnVal: [],
    }
  }

  changeState = () => {
    this.setState({
      open: this.state.open === false
    }, af => {
      console.log(this.state)
    })
  }
  optionChange = (v, e) => {
    console.log(e)
    this.setState({
      checkVal: v
    })
  }

  render() {
    const options = [
      {id: '001', val: 'value1'},
      {id: '002', val: 'value2'},
      {id: '003', val: 'value3'},
    ];
    return (
      <div>
        <div className="ant-select ant-select-enabled" onClick={this.changeState}>
          <div className="ant-select-selection" aria-autocomplete="list" tabIndex="0">
            <div className="ant-select-selection__rendered" style={{overflow: "hidden"}}>{
              this.state.checkVal && this.state.checkVal.length > 0 ? this.state.checkVal.map(item => {
                return <Tag key={`tagKey_${item}`}>{item}</Tag>
              }) : null

            }</div>
            <span className="ant-select-arrow" unselectable="on" style={{userSelect: "none;"}}>
                     <Icon type={'down'}
                           style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.25)"}}/>
                    </span></div>
        </div>
        <CheckboxGroup
          style={{width: '100%', border: "1px solid #d9d9d9"}}
          className={this.state.open ? "show" : "hide"}
          onChange={this.optionChange}
        >
          <Row>
            {
              options.map((item, ind) => {
                return <Col span={24} offset={1}>
                  <Checkbox
                    value={item.val}
                    key={item.val}
                    data-key={item.id}
                    onClick={a => {
                      console.log(a.target.dataset.key)
                    }}>
                    {item.val}
                  </Checkbox>
                </Col>
              })
            }

          </Row>
        </CheckboxGroup>
        <style>
          {`
                .show{
                  opacity: 1;
                  transition: all .3s ease-in ;
                  }
                .hide{
                  opacity: 0;
                  transition: all 0.3s ease-in ;
                  }
                `}
        </style>
      </div>
    );
  }
}



```
