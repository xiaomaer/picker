### 基于react的picker组件
该picker组件是一款移动端组件，通过touch事件实现上下滚动选择项目；但其他事件实现原理与touch一致，您可以根据自己的需要进行扩展。
1. picker props介绍

属性名称 | 属性类型 | 默认值 | 描述
---|---|---|---
items |Array|[] |picker所有选项列表
show| Boolean|false| 控制是否显示picker组件
defaultIndex | Number| -1 | picker显示时，默认选中项的index
onCancel| Function| | 点击“取消”按钮触发，隐藏picker组件
onChange| Function| | 点击“确认”按钮触发，获取选中项目的值和index


2. picker组件使用
在父组件中引入picker组件即可，父组件代码如下：  

 ```
import React, { PureComponent } from 'react';
import Picker from '../picker/picker';

export default class Page extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pickerValue: '',
            defaultIndex: -1,
            show: false
        }
        this.showPicker=this.showPicker.bind(this);
        this.hidePicker=this.hidePicker.bind(this);
        this.changeItem=this.changeItem.bind(this);
    }
    //显示picker
    showPicker(){
        this.setState({
            show:true
        })
    }
    //隐藏picker
    hidePicker() {
        this.setState({
            show: false
        });
    }
    //获取选中picker项的值和index
    changeItem(itemValue, itemIndex) {
        this.setState({
            pickerValue: itemValue,
            defaultIndex: itemIndex,
            show: false
        });
    }
    render() {
        const { pickerValue, defaultIndex, show } = this.state;
        const items = ["item1", "item2", "item3", "item4", "item5"];
        return (
            <div className="page">
                <div className="label_name">picker选择器：</div>
                <input type="text" value={pickerValue} placeholder="请选择值..." className="picker_input" onFocus={this.showPicker}/>
                <Picker items={items} show={show} defaultIndex={defaultIndex} onCancel={this.hidePicker} onChange={this.changeItem}/>
            </div>
        )
    }
}
```

3. demo
[点击这里查看demo](http://y.dobit.top/upload/demo/20170714154224582362/)  

4. 项目运行

```
git clone
npm install
npm start
```

即可在浏览器中，输入“http://localhost:8100/” 查看picker组件使用了。  
`注意：`
- 如在浏览器中查看，请在移动调试模式下查看哦
- 该picker组件目前仅支持单项选择哦。