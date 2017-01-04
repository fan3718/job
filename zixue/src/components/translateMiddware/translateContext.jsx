require('./styles/translate.less')
import React,{Component} from 'react'
import R from 'ramda'
import $ from 'jquery'
import {Fill,Cloze} from '../widgets'
import {InputFill,InputCloze,InputJudge} from '../widgets'
export function translateContext(content,answer=[]){
  const Brack = (props) => {
    return <span className='xml-brack'>{translateContent(props.html)}</span>
  }
  const Blank = (props) => {
    return <span className='xml-blank'></span>
  }
  const UnderlineWave = (props) => {
    return <span className='xml-u-wave'>{translateContent(props.html)}</span>
  }
  const UnderlineStr = (props) => {
    return <span className='xml-u-str'>{translateContent(props.html)}</span>
  }
  const UnderlinePoint = (props) => {
    return <span className='xml-u-point'>{translateContent(props.html)}</span>
  }
  const Strong = (props) => {
    return <strong className='xml-strong'>{translateContent(props.html)}</strong>
  }
  const Italic = (props) => {
    return <i className='xml-itatic'>{translateContent(props.html)}</i>
  }
  const PCenter = (props) => {
    return <p className='xml-center'>{translateContent(props.html)}</p>
  }
  const LongFill = () => {
    return <span>{'__________'}</span>
  }
  const Tab = () => {
    return <span>{'    '}</span>
  }
  const UnderFill = ()=>{
    return <span>{'_____'}</span>
  }
  const Img = (props) => {
    return <img className='xml-img' src={props.src}/>
  }
  const fill = (answer=[]) => {
    let num = 0;
    return class extends Component {
      render(){
        return (
          <InputFill key={num} value={answer[num]} no={num++} />
        )
      }
    }
  }
  const cloze = (answer=[]) => {
    let num = 0;
    return class extends Component {
      render(){
        return (
          <InputCloze key={num} value={answer[num]} no={num++} />
        )
      }
    }
  }
  const FillIndensity = fill(answer)
  const ClozeIndensity = cloze(answer)
  const translateContent = function(content){
    const $oDom = $(content)
    if($(content).length<=0){
      return content;
    }
    let $aChildrenDom = $.makeArray($oDom.contents());
    return $aChildrenDom.map(function(item,index){
        item = $(item)
        index = Date.parse(new Date())+index
        if(item.is('longFill')){
          return <LongFill key={index}/>
        }else if(item.is('img')){
          return <Img src={item.attr('src')} key={index}/>
        }else if(item.is('fill')){
          return <FillIndensity key={index} />
        }else if(item.is('cloze')){
          return <ClozeIndensity key={index}/>
        }else if(item.is('tab')){
          return <Tab key={index}/>
        }else if(item.is('.brack')){
          return <Brack html={item.html()} key={index}/>
        }else if(item.is('strong')){
          return <Strong html={item.html()} key={index}/>
        }else if(item.is('i')){
          return <Italic html={item.html()} key={index}/>
        }else if(item.is('.underline')){
          return <UnderlineStr html={item.html()} key={index}/>
        }else if(item.is('.wave')){
          return <UnderlineWave html={item.html()} key={index}/>
        }else if(item.is('.point2')){
          return <UnderlinePoint html={item.html()} key={index} />
        }else if(item.is('.center')){
          return <PCenter html={item.html()} key={index}/>
        }else if(item.is('underfill')){
          return <UnderFill key={index} />
        }else if(item.is('blank')){
          return <Blank key={index} />
        }else if(item.is('br')){
          return <br key={index} />
        }else{
          const aDom = R.compose(R.addIndex(R.map)((e,i)=>{return <span key={index+i}
                                        style={{display:'inline-flex'}}>{e}
                                      </span>}),R.split(/\s+/))(item.text())
          return aDom
        }
    })
  }
  return (translateContent('<div>'+content+'</div>'));
}
