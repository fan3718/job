import R from 'ramda'
export const translateFill = (string='')=>{
  return R.replace(/<fill\/>/g,'<underfill/>')(string) 
}





export const translateLongFill = (string = '')=>{
  return R.replace(/<longFill\/>/g,'<fill/>')(string)
}
