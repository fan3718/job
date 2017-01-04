import R from 'ramda'
const mapIndex = R.addIndex(R.map)
export const getQue = (page,index) => {
  const [a,b,c,d] = splitIndexAndParserNumber(index)
  if(typeof d ==='undefined'){
    return page.paperStructure[a].quesGroups[b].ques[c]
  }
  return page.paperStructure[a].quesGroups[b].ques[c].ques[d];
}
export const splitIndexAndParserNumber = R.compose(R.map(e=>e*1),R.split('-'))
export const addIndexForPageGen = ()=>{
  let index = 1
  return (x)=>{
    let aIndex = [];
    if(typeof x.paperStructure === 'undefined'){
      return x
    }
    const page = R.merge(
      x,
      {
        'paperStructure':mapIndex((y,idy)=>{
          return R.merge(y,{
            'quesGroups':mapIndex((z,idz)=>{
            return R.merge(z,{
                  'ques':mapIndex((w,idw)=>{
                    if(typeof w.id !=='undefined' && w.id!==null){
                      aIndex.push(idy+'-'+idz+'-'+idw)
                      return R.merge(w,{
                                          queNoInPage:index++,
                                          isFetching:false,
                                          isValid:false,
                                          answer:[]
                                        })
                    }else{
                      return R.merge(w,{
                        ques:mapIndex((o,ido)=>{
                        aIndex.push(idy+'-'+idz+'-'+idw+'-'+ido)
                        return R.merge(o,{
                            queNoInPage:index++,
                            isFetching:false,
                            isValid:false,
                            answer:[]
                          })
                        })(w.ques)
                      })
                    }
                  })(z.ques)
                })
            })(y.quesGroups)
          })
        })(x.paperStructure)
      }
    )
    page['totalNum']=index-1;
    return page;
  }
}
