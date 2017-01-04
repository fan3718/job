require('./styles/AnswerCart.less')
import React,{cloneElement} from 'react'

export const AnswerCartMain = (props) => {
  const {queIndex, quesNum} = props
  return (
    <div className="answer-cart-main">
      <div className="answer-cart-main-title">
        <span>{queIndex}</span>/{quesNum}小题
      </div>
      <div className="answer-cart-main-panel">
        {props.children}
      </div>
    </div>
  )
}
export const DescriptionCart = (props) => {
  const {shortName} = props;
  return (
    <div className="answer-cart-main">
      <div className="answer-cart-main-title">
      </div>
      <div className="answer-cart-main-panel flex-columm flex-middle" >
        {/* <div className="answer-cart-main-panel-title">
          <span className="answer-cart-main-panel-title-icon"></span>{shortName}
        </div> */}

        {/* <div className="answer-cart-main-panel-content">
          {desc}
        </div> */}
        <div className="answer-cart-main-panel-content ">
          <span className="answer-cart-main-panel-title-icon "></span>{shortName}
        </div>
      </div>
    </div>
  )
}

const AnswerCartSubGen = (type) => {
  return (props) => {
      const {queIndex,quesNum,subQueIndex,subQuesNum} = props
      return (
        <div className="answer-cart-sub" id="sub-answer-cart">
          <div className="answer-cart-sub-title">
            <span><span className="answer-cart-title-bold">{queIndex}</span>/{quesNum}小题</span>
            <div className="drop-button"
              style={{'display':type===false?'none':'block'}}></div>
            <span className="answer-cart-sub-info">
                本大题第<span className="answer-cart-title-bold">{subQueIndex+1}</span>/{subQuesNum}小题
            </span>
          </div>
          <div className="answer-cart-sub-panel">
            {props.children}
          </div>
        </div>
      )
  }
}
export const AnswerCartSub = AnswerCartSubGen(false);
export const AnswerCartSubDraggable = AnswerCartSubGen(true);


export const AnswerCartSubDraggableWithoutSubInfo = (props)=>{
  const {queIndex,quesNum} = props
  return (
    <div className="answer-cart-sub" id="sub-answer-cart">
      <div className="answer-cart-sub-title">
        <span><span className="answer-cart-title-bold">{queIndex}</span>/{quesNum}小题</span>
        <div className="drop-button"
          style={{'display':true===false?'none':'block'}}></div>
      </div>
      <div className="answer-cart-sub-panel">
        {props.children}
      </div>
    </div>
  )
}
