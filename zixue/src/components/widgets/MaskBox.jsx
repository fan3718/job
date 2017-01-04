require('./styles/maskBox.less')
import React,{Component} from 'react'
import classnames from 'classnames'
export class MaskBox extends Component {
  render(){
    const {isShowAlert} = this.props
    return(
      <div className={classnames({'alert-bg':true,'alert-show':!isShowAlert})}>
        <div className="alert-box">
          <div className="alert-title">本题尚未解答，是否跳过?</div>
          <div className="alert-btn">
            <span className="confirm alert-skip-answer">跳过</span>
            <span className="cancel alert-continue-answer">答题</span>
          </div>
        </div>
      </div>
    )
  }
}
