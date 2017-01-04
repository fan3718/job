require('./styles/WordPanel.less')
import React from 'react'
export const WordPanel = (props)=>{
  const {title} = props
  return (
    <div className='word-panel' dangerouslySetInnerHTML={{__html:title}}>
    </div>
  )
}
