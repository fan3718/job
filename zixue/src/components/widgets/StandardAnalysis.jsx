require('./styles/Common.less')
require('./styles/StandardAnalysis.less')
import React from 'react'
import R from 'ramda'
const mapIndex = R.addIndex(R.map)
export const StandardAnalysis = (props) =>{
  const {que,knowledges:pKnowledges,usetime=null} = props
  const {knowledges,analysis=''} = que;
  const aKnowledges = R.map(R.compose((e)=><span key={e} className="knowledge-item">{e}</span>
                      ,R.prop('name')))(knowledges||pKnowledges)
  return (
    <div className="stardard-analysis">
      <SingleAnswerAnslysis que={que} usetime={usetime}/>
      <div className="analysis analysis-list-item">
          <div className="title">
            <div className="title-icon"></div>解析
          </div>
          <div className="content" dangerouslySetInnerHTML={{__html: analysis}}></div>
      </div>
      <div className="knowledge analysis-list-item">
        <div className="title">
          <div className="title-icon"></div>知识点
        </div>
        <div className="content">{aKnowledges}</div>
      </div>

    </div>
  )
}

const SingleAnswerAnslysis = (props) => {
  const {usetime:pUseTime} = props;
  const {id=0,correctAnswer=[],correctResult=[],usetime=pUseTime,userAnswer=[]} = props.que;
  return (
    <div className='analysis-judge'>
      <div className="judge-item" >本题用时{parseInt(usetime/60000)===0?null:parseInt(usetime/60000)+'min'}{usetime%60000/1000}s</div>
      {
        correctAnswer.length===0?
                      null:
                      correctAnswer.length===1?
                        <JudgeItem id={id} key={id}
                        correctAnswer={correctAnswer[0]}
                        userAnswer = {userAnswer[0]}
                        correctResult={correctResult[0]} />:
                      mapIndex((e,idx)=><JudgeItem idx={idx} id={id} key={id+idx}
                      correctAnswer={e}
                      userAnswer = {userAnswer[idx]}
                      correctResult={correctResult[idx]}/>)(correctAnswer)
      }
    </div>
  )
}

const JudgeItem = (props) => {
  const {id=0,result,correctAnswer=[],userAnswer,idx=null} = props;
  const sIndex = idx!==null?'第'+(idx+1)+'空':'回答';
  const keyIndex = idx!==null?(idx+1):0;
  const judgeNode = result=='1'?
                    <span>
                      <span className="right">
                        正确
                      </span>
                    </span>:
                    <span>
                      <span className="wrong">
                        错误
                      </span>
                      ,正确答案是{correctAnswer.map((e)=><span key={id+idx} dangerouslySetInnerHTML={{__html: e}}></span>)}
                      {typeof userAnswer==='undefined'?'':',你的答案是'}{userAnswer}
                    </span>
  return (
    <div className="judge-item">
      {sIndex}{judgeNode}
    </div>
  )
}
