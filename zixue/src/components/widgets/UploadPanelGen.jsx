require('./styles/Upload.less')
import React from 'react'
import classnames from 'classnames'

/**
 * 上传面板
 * @method
 * @param  {boolean} type true:有border false:无border
 * @return {[type]}      [description]
 */
const UploadPanelGen = (type)=>{
    return (props) => {
      const {imgs = []} = props;
      return (
        <div className={classnames('upload-panel',{'upload-panel-border':type})}>
          {imgs.map((img,index)=><div key={img} className="upload-item"><img src={img}/>
            <span data-index={index} className="upload-delete-icon"></span></div>)}
          <div className="upload-item upload-button"></div>
        </div>
      )
    }
}
export const UploadPanelWithBorder = UploadPanelGen(true);
export const UploadPanelWithoutBorder = UploadPanelGen(false);

export const UploadPanelPure = (props)=>{
  const {imgs=[]} = props;
  let imgsHtml;
  let type;
      if(imgs.length!=0){
          type = false;
          imgsHtml = imgs.map(img=><div key={img} className="upload-item"><img src={img}/></div>)
      }else{
          type = true;
          imgsHtml="本题尚未解答,请直接查看答案解析";
      }
  return (
    <div className='upload-panel-pure-box'>
      <div className={classnames('upload-panel-pure',{'noAnswer':type})}>
        {imgsHtml}
      </div>
    </div>
  )
}
