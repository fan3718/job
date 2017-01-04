require('./styles/Connection.less')
import React , {Component} from 'react'
import {AnswerCartMain,StandardAnalysis} from '../widgets/'
import R from 'ramda'
export const Connection = class extends Component{
  constructor(props){
    super(props)
    const {que} = this.props;
    const {title,userAnswer=''} = que;
    this.state = {
      answerWords:transferAnswer(userAnswer),
      quesWords:transferTitle(filterTag(title),'')
    }
  }
  render(){
    const {que,totalNum} = this.props
    const {queNoInPage} = que
    const {answerWords,quesWords} = this.state;
    return (
      <AnswerCartMain  className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <div className="flex-columm">
          <ConnectionTemplate  answerWords={answerWords} quesWords={quesWords}/>
          <hr/>
          <div className="margin-lr">
            <StandardAnalysis que={que}/>
          </div>
        </div>
      </AnswerCartMain>
    )
  }
}
const mapIndex = R.addIndex(R.map);
const filterTag = R.replace(/<\w+\/>/g,'')
const transferTitle = (sOrigin = '',sDelete = '') => {
  const aDelete = sDelete.match(/(\b\w+\b)|[\.|\?|\,]/g)?sDelete.match(/(\b\w+\b)|[\.|\?|\,]/g):[]
  const aOrigin = sOrigin.match(/(\b\w+\b)|.(?=\))/g)?sOrigin.match(/(\b\w+\b)|.(?=\))/g):[]
  return R.difference(aOrigin,aDelete);
}
const transferAnswer = (str = '') => {
  if(str === ''){
    return [];
  }
  return str.match(/(\b\w+\b)|[\.|\?|\,]/g)
}
const ConnectionTemplate = (props) => {
  const {answerWords,quesWords} = props
  return (
    <div className='flex-columm'>
      <div className='template-title'>
        <span className='template-icon'>
        </span>
        请将下列单词连成一句话
      </div>
      <ConnectionAnswerBox words={answerWords}/>
      <ConnectionWordsBox  words={quesWords}/>
    </div>
  )
}
const ConnectionAnswerBox = (props) => {
  const {words} = props
  return (
    <div className="connection-answer-box">
      {mapIndex((item,idx)=>{return <span key={idx} data-index={idx}
                                    className="connection-answer-item">
                                    {item}</span>})(words)}
    </div>
  )
}
const ConnectionWordsBox = (props) => {
  const {words} = props;
  return (
    <div className="connection-word-box">
      <div className="connection-word-box-info">
        <span className="connection-info-icon"></span>按照顺序点选
      </div>
      <div className="connection-word-box-wordlist">
        {mapIndex((item,idx)=>{return <span key={idx} data-index={idx}
          className="connection-word-box-item">{item}</span>})(words)}
      </div>
    </div>
  )
}
