import R from 'ramda'
import moment from 'moment'
export const formateTimeMMSS = (time)=>{
  return moment(time).format('mm:ss')
}
export const getTimeGen = ()=>{
  let usetime = 0;
  let expecttime = 0;
  return (ques) =>{
    R.map(que=>{
      if(typeof que.id ==='undefined' || que.id === null){
        R.map(que=>{
          usetime+=que.usetime;
          expecttime+=que.time
        })(que.ques)
      }else{
        usetime+=que.usetime;
        expecttime+=que.time;
      }
    })(ques)
    return {usetime,expecttime}
  }
}
