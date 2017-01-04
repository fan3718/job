require('./styles/Cart.less');
import React from 'react'
import classnames from 'classnames'
import R from 'ramda'
import {getTimeGen,formateTimeMMSS} from '../../utils'
export const Cart = (props) => {
  const {canSubmit} = props;
  const {name,paperStructure,doneCount=0} = props.page;
  return (
    <div className="cart">
      <div className="cart-title">
        {name}
      </div>
      <Catalog paperStructure={paperStructure}/>
      <div className="cart-submit">
        <div className={classnames({'cart-submit-button':true,
                                'cart-submit-button-start':doneCount==0,
                                'cart-submit-button-active':canSubmit})}>
        </div>
      </div>
    </div>
  )
}
const Catalog =  (props) => {
  const {paperStructure=[]} = props;
  return (
    <div className="cart-catalog">
      {R.map(e=>{
        return <Paper key={e.shortName} paper={e}/>
      })(paperStructure)}
    </div>
  )
}
const Paper = (props) => {
  const {paper} = props;
  const {shortName, quesGroups} = paper;
  return (
    <div className="cart-paper">
      {typeof shortName === 'undefined'?
      '':<div className="cart-paper-title">
        {paper.shortName}
      </div>}
      {R.map(quesGroup=>{
        return <QuesGroup  key={quesGroup.shortName} quesGroup={quesGroup}/>
      })(quesGroups)}
    </div>
  )
}
const QuesGroup = (props) =>{
  const {quesGroup} = props;
  const {ques,shortName} = quesGroup;
  const quesDom = R.compose(R.unnest,R.map(
    que=>{
      if(typeof que.id !=='undefined' && que.id !==null){
        const {doneCount,answer=[],ques} = que
        let aQuesanswer = []
        if(typeof ques !=='undefined'){
          aQuesanswer = R.compose(R.flatten,R.map(R.prop('answer')))(ques)
        }
        let answered;
        if(typeof que.quesType==='undefined'){
          answered = doneCount>0
        }else{
          answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
                                ||!R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
        }
        // const answered = doneCount>0||!R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
        //                       ||!R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
        return [<div key={que.id} data-id={que.id} data-index={que.index}
                className={classnames({'cart-ques-group-item':true,'cart-ques-group-item-answered':answered})}>{que.queNoInPage}</div>]
      }
      else{
        return R.map(que=>{
          const {doneCount,answer=[],ques} = que
          let aQuesanswer = []
          if(typeof ques !=='undefined'){
            aQuesanswer = R.compose(R.flatten,R.map(R.prop('answer')))(ques)
          }
          let answered;
          if(typeof que.quesType==='undefined'){
            answered = doneCount>0
          }else{
            answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
                                  ||!R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
          }
          // const answered = doneCount>0||!R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
          //                       ||!R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
          return <div key={que.id} data-id={que.id} data-index={que.index}
              className={classnames({'cart-ques-group-item':true,'cart-ques-group-item-answered':answered})}>{que.queNoInPage}</div>
        })(que.ques)
      }
    }
  ))(ques)
  const oTime = getTimeGen()(ques)
  return (
    <div className="cart-ques-group">
      <div className="cart-ques-group-title">
        <span className="cart-ques-group-title-name">
          <span className="cart-ques-group-title-icon">
  				</span>
          {shortName}
        </span>
      </div>
      <span className="cart-ques-group-title-time">
        耗时:{formateTimeMMSS(oTime.usetime)}
      </span>
      <ul className="cart-ques-group-list">
        {quesDom}
      </ul>

    </div>
  )

}
