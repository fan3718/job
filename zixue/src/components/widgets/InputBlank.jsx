require('./styles/InputBlank.less')
import React from 'react'
/**
 * 生成完型填空和选词填空的样式
 * @method
 * @param  {Number} type (1-可读写空，2-只读的空)
 * @return {React Stateless Component}      填空样式
 */
const InputBlankGen = (type) => {
  return (props) => {
    const {no, value} = props;
    if(type===1){
      return (
        <div className="fill-blank fill">
          <input className="input fill-input" type="text" data-index={no} placeholder={no+1}
            value={value} data-value={value} readOnly={true}/>
        </div>
      )
    }else if(type===2){
      return (
        <div className="fill-blank cloze">
          <input className="input" type="text" autoCapitalize="off"
					 	placeholder={no+1} defaultValue={value} data-value={value} data-index={no}/>
          <div className="clear-button" data-index={no} ></div>
			</div>
      )
    }else if(type===3){
      return (
        <div className="fill-blank judge">
          <input className="input" type="text" autoCapitalize="off"
					 	placeholder={no+1} defaultValue={value} data-value={value} data-index={no}/>
          <div className="clear-button" data-index={no} ></div>
        </div>
      )
    }
  }
}
export const Fill = InputBlankGen(2);
export const Cloze = InputBlankGen(1);
