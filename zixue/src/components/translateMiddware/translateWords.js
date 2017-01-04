import $ from 'jquery'
import R from 'ramda'
export const splitWords = (string)=>{
  return R.compose(R.map(R.trim),R.split(','))($(string).text()?$(string).text():string)
}
