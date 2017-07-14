// 单列选择组件
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Picker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            touchID: undefined,//一次触摸的唯一标识符，一次触摸动作，该标识符不变
            touching: false,//是否触发了touch事件
            totalHeight: 0,//所有选项总高度（34*选项个数）
            selected: 0,//显示的选项
            translate: 0,//picker_items区域上/下移动的距离
            ogY: 0,//触摸开始时（touchstart），距离页面顶部实际的距离
            ogTranslate: 0,//触摸开始时（touchstart），picker_items区域已上/下移动的距离
            animating: this.props.animation//滚动是否有动画
        }
        this.bindFunctions();
    }
    componentDidMount() {
        this.adjustPosition(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.adjustPosition(nextProps);
    }

    adjustPosition(props) {
        const { items, itemHeight, displayTop, defaultIndex } = props;
        const totalHeight = items.length * itemHeight;
        let translate = totalHeight <= displayTop ? displayTop : 0;

        if (defaultIndex > -1) {
            if (translate === 0) {
                //显示区域上面可以显示几个选项
                let upperCount = Math.floor(displayTop / itemHeight);
                if (defaultIndex > upperCount) {
                    //over
                    let overCount = defaultIndex - upperCount;
                    translate -= overCount * itemHeight;
                } else if (defaultIndex === upperCount) {
                    translate = 0;
                } else {
                    //less
                    translate += (Math.abs(upperCount - defaultIndex) * itemHeight);
                }
            } else {
                //total item less than indicator height
                translate -= itemHeight * defaultIndex;
            }
        }

        this.setState({
            selected: defaultIndex,
            ogTranslate: translate,
            totalHeight,
            translate,
        }, function () {
            this.changeSelectedItem();
        });
    }
    bindFunctions() {
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.hanldeTouchEnd = this.hanldeTouchEnd.bind(this);
        this.changeSelectedItem = this.changeSelectedItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleTouchStart(e) {
        if (this.state.touching || this.props.items.length <= 1) return;
        const touch = e.targetTouches[0],
            pageY = touch.pageY,
            translate = this.state.translate;
        this.setState({
            touchID: touch.identifier,
            touching: true,
            ogY: translate === 0 ? pageY : pageY - translate,
            ogTranslate: translate,
            animating: false
        })
    }
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.state.touching || this.props.items.length <= 1) return;
        const touch = e.targetTouches[0];
        if (touch.identifier !== this.state.touchID) return;
        this.setState({
            translate: touch.pageY - this.state.ogY
        })
    }
    hanldeTouchEnd(e) {
        if (!this.state.touching || this.props.items.length <= 1) return;
        const { itemHeight, displayTop, displayHeight } = this.props;
        let translate = this.state.translate,
            ogTranslate = this.state.ogTranslate;
        //如果上/下移动距离小于单个选项高度的一半，这时picker_items区域移动的距离不变，等于touchstart时移动的距离
        if (Math.abs(translate - ogTranslate) < itemHeight * 0.51) {
            translate = ogTranslate;
        } else if (translate > displayTop) {//如果向下移动的距离大于显示选中项区域距离顶部的距离，显示选中第一项
            translate = displayTop;
        } else if (translate + this.state.totalHeight < displayTop + displayHeight) {//向上移动，当移动到最后一项后，再往下移仍会显示最后一项
            translate = displayTop + displayHeight - this.state.totalHeight;
        } else {
            let distance = translate - ogTranslate,//移动的距离
                count = distance / itemHeight,//移动选项卡的个数
                step = 0;//处理后移动的选项卡的个数
            if (Math.abs(count) < 1) {
                step = count < 0 ? -1 : 1;
            } else {
                let adjust = Math.abs((count % 1) * 100) > 50 ? 1 : 0;//移动距离大于选项卡高度的一半，当作移动一个选项卡处理
                step = count > 0 ? Math.floor(count) + adjust : Math.ceil(count) - adjust;
            }
            translate = ogTranslate + step * itemHeight;
        }
        this.setState({
            touchID: undefined,
            touching: false,
            ogY: 0,
            ogTranslate: 0,
            animating: true,
            translate
        }, function () {
            this.changeSelectedItem();
        })
    }
    changeSelectedItem() {
        const { itemHeight, displayTop, displayHeight, items } = this.props;
        let selectedIndex = 0;
        items&&items.map((item, index) => {
            if ((this.state.translate + index * itemHeight) >= displayTop && (this.state.translate + (index + 1) * itemHeight) <= (displayTop + displayHeight)) {
                selectedIndex = index;
            }
        });
        this.setState({
            selected: selectedIndex
        })
    }
    handleChange() {
        const { items, onChange } = this.props,
            selectedIndex = this.state.selected;
        onChange && onChange(items[selectedIndex], selectedIndex);
    }
    render() {
        const { items, show, onCancel } = this.props;
        const showClass = show ? ' picker_show' : '';
        const styles = {
            'transform': `translate(0, ${this.state.translate}px)`,
            'transition': this.state.animating ? 'transform .3s' : 'none'
        };
        const itemsList = items.map((item, index) => {
            return (<li className="picker_item" key={index}>{item}</li>)
        })
        return (
            <div className="picker">
                <div className={"picker_mask" + showClass} onClick={onCancel}></div>
                <div className={"picker_dialog" + showClass}>
                    <div className="picker_btns">
                        <a className="picker_btn_cancel" onClick={onCancel}>取消</a>
                        <a className="picker_btn_ok" onClick={this.handleChange}>确定</a>
                    </div>
                    <div className="picker_container" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.hanldeTouchEnd}>
                        <div className="picker_content_mask"></div>
                        <div className="picker_item_active"></div>
                        <ul className="picker_items" style={styles}>
                            {itemsList}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
Picker.propTypes = {
    height: PropTypes.number,//选项显示区域高度
    itemHeight: PropTypes.number,//单个选项高度
    displayTop: PropTypes.number,//显示选中项区域距离区域顶部的距离
    displayHeight: PropTypes.number,//显示选中项区域的高度
    defaultIndex: PropTypes.number,//picker默认选中选项
    aniamtion: PropTypes.bool//上下移动是否有动画
};
Picker.defaultProps = {
    height: 238,
    itemHeight: 34,
    displayTop: 102,
    displayHeight: 34,
    defaultIndex: -1,
    aniamtion: true
};