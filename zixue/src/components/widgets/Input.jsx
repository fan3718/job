import React,{Component} from 'react'
import { findDOMNode } from 'react-dom';
import classnames from 'classnames'
import $ from 'jquery'
require('./styles/Input.less')

const adjustWidth = (Comp)=>class extends Component{
  componentDidMount(){
    const InputDom = findDOMNode(this);
    const InputBlank = $(InputDom).find('input');
    const length = InputBlank.val().length;
    const lengthRem = 0.285*length<1.7?1.7:(0.285*length>6?6:0.285*length)
    InputBlank.width(lengthRem+'rem')
  }
  componentDidUpdate(){
    const InputDom = findDOMNode(this);
    const InputBlank = $(InputDom).find('input');
    const length = InputBlank.val().length;
    const lengthRem = 0.285*length<1.7?1.7:(0.285*length>6?6:0.285*length)
    InputBlank.width(lengthRem+'rem')
  }
  _handleKeyDown(){
    const InputDom = findDOMNode(this);
    const InputBlank = $(InputDom).find('input');
    const length = InputBlank.val().length;
    const lengthRem = 0.285*length<1.7?1.7:(0.285*length>6?6:0.285*length)
    InputBlank.width(lengthRem+'rem')
  }
  render(){
    return (
      <Comp onKeyDown={this._handleKeyDown.bind(this)} {...this.props}/>
    )
  }
}

const InputFactory = (type)=>{
  return (props) => {
    const {no, value} = props;
    if(type==='cloze'){
      return (
        <div className="input cloze">
          <input  type="text" data-index={no} placeholder={no+1} autoCapitalize="off"
            value={value}  readOnly={true}/>
        </div>
      )
    }else if(type==='fill'){
      const {onKeyDown} = props;
      return (
        <div className="input fill">
          <input onKeyDown={onKeyDown} type="text" autoCapitalize="off"
					 	placeholder={no+1} defaultValue={value} data-value={value} data-index={no}/>
          <div className="clear-button" data-index={no}></div>
			</div>
      )
    }else if(type==='judge'){
      const {userAnswer,correctResult} = props;
      return (
        <div className="input judge">
          <input className={classnames({'right':correctResult==1},
                            {'wrong':!correctResult||correctResult==0})}
                            type="text" autoCapitalize="off"
					 	placeholder={no+1} value={userAnswer}  readOnly={true}/>
        </div>
      )
    }
  }
}


export const InputFill  = adjustWidth(InputFactory('fill'));
export const InputCloze = InputFactory('cloze');
export const InputJudge = InputFactory('judge');
