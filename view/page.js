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