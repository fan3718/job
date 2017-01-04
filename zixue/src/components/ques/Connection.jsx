require('./styles/Connection.less')
import React , {Component} from 'react'
import {AnswerCartMain} from '../widgets/'
import {addSingleAnswer} from 'actions/Syncactions'
import R from 'ramda'
import {AddTime,SubmitQue} from '../decorator'
@SubmitQue
@AddTime
export const Connection = class extends Component {
  hasDispatched:false
  constructor(props){
    super(props)
    const {que} = this.props;
    const {title,answer} = que;
    this.state = {
      answerWords:transferAnswer(answer[0]),
      quesWords:transferTitle(filterTag(title),answer[0])
    }
  }
  _handleTap(e){
    const index = e.target.dataset.index;
    const {que,dispatch} = this.props;
    const {answerWords,quesWords} = this.state;
    if(e.target.className.includes('connection-word-box-item')){
      const content = quesWords[index];
      quesWords.splice(index,1)
      answerWords.push(content)
      this.setState({
        answerWords:answerWords,
        quesWords:quesWords
      })
    }else if(e.target.className.includes('connection-answer-item')){
      const content = answerWords[index];
      answerWords.splice(index,1)
      quesWords.push(content)
      this.setState({
        answerWords:answerWords,
        quesWords:quesWords
      })
    }
    dispatch(addSingleAnswer(que.index,R.join(' ')(answerWords)))
  }
  componentWillUnmount(){
    const {que,dispatch} = this.props;
    const {answerWords} = this.state;
    dispatch(addSingleAnswer(que.index,R.join(' ')(answerWords)))
  }
  render(){
    const {que,totalNum} = this.props
    const {queNoInPage} = que
    const {answerWords,quesWords} = this.state;
    return (
      <AnswerCartMain  className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <div className="flex-columm" onTouchTap={this._handleTap.bind(this)}>
          <ConnectionTemplate  answerWords={answerWords} quesWords={quesWords}/>
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
      <ConnectionWordsBox words={quesWords}/>
    </div>
  )
}

const ConnectionAnswerBox = (props) => {
  const {words} = props
  return (
    <div className="connection-answer-box">
      {mapIndex((item,idx)=>{return <span key={idx} data-index={idx} className="connection-answer-item">{item}</span>})(words)}
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
        {mapIndex((item,idx)=>{return <span key={idx} data-index={idx} className="connection-word-box-item">{item}</span>})(words)}
      </div>
    </div>
  )
}
