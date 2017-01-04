import R from 'ramda'
export const splitIndexAndParserNumber = R.compose(R.map(e=>e*1),R.split('-'))
export const getNode = (index,page) =>{
  if(typeof page.paperStructure ==='undefined'){
    return false;
  }
  const [a,b,c,d] = splitIndexAndParserNumber(index)
  if(typeof d ==='undefined'){
    if(typeof c ==='undefined'){
      if(typeof b==='undefined'){
        if(typeof a ==='undefined'){
          throw 'index is invalid'
        }else{
          try {
            return page.paperStructure[a]
          }catch(e) {
            return {}
          }
        }
      }else{
        return page.paperStructure[a].quesGroups[b]
      }
    }else{
      return page.paperStructure[a].quesGroups[b].ques[c]
    }
  }else{
    return page.paperStructure[a].quesGroups[b].ques[c].ques[d];
  }
}
export const isQueNode = (index,page) => {
  const [a,b,c,d] = splitIndexAndParserNumber(index)
  if(typeof page.paperStructure ==='undefined'){
    return false;
  }
  if(typeof d !=='undefined'){
    return true
  }
  if(typeof c !=='undefined'){
    const que = page.paperStructure[a].quesGroups[b].ques[c];
    if(typeof que.id !=='undefined'){
      return true
    }
  }
  return false;
}
