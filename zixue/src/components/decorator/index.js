import React,{Component} from 'react'
import {addTime} from 'actions/Syncactions'
import R from 'ramda'
import $ from 'jquery'
const filterAnswerJson = (que) =>{
  if(typeof que.ques !=='undefined'&&que.ques.length!==0){
    const ques = R.map(R.pick(['id','answer']))(que.ques)
    const id = que.id
    return {id,ques}
  }else{
    return R.pick(['id','answer'])(que)
  }
}
export const AddTime = (Comp) =>class extends Component {
  constructor(props){
    super(props)
    this.usetime = this.props.que.usetime
  }
  componentDidMount(){
    const {dispatch,que,isShowCart} = this.props;
    const {index} = que;
     if(typeof index !=='undefined'){
      this.addTime = window.setInterval(()=>{
        if(!isShowCart){
          this.usetime+=1000;
          dispatch(addTime(index,this.usetime))
        }else{
          window.clearInterval(this.addTime)
        }
      },1000)
    }
  }
  componentDidUpdate(){
    window.clearInterval(this.addTime)
    const {dispatch,que,isShowCart} = this.props;
    const {index} = que;
     if(typeof index !=='undefined'){
      this.addTime = window.setInterval(()=>{
        if(!isShowCart){
          this.usetime+=1000;
          dispatch(addTime(index,this.usetime))
        }else{
          window.clearInterval(this.addTime)
        }
      },1000)
    }
  }
  shouldComponentUpdate(nextProps){
    return nextProps.que.usetime ===this.props.que.usetime
  }

  componentWillUnmount(){
    window.clearInterval(this.addTime)
  }
  render(){
    return <Comp {...this.props}/>
  }
}
export const SubmitQue = (Comp) => class extends Component {
  componentWillUnmount(){
    const {que} = this.props
    const postParams = {
      uid:window.uid,
      examId:window.examId,
      exerId:window.exerId,
      quesId:que.id,
      answerJson:JSON.stringify(filterAnswerJson(que)),
      duration:que.usetime,
      key:window.key,
      sign:window.sign,
      subject:window.subject
    }
    $.post('/selfstudy/exam/ques/commit',postParams)
  }
  render(){
    return <Comp {...this.props}/>
  }
}
