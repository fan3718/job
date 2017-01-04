import {translateContext} from './translateContext'
import {translateFill} from './translateFill'
import {splitWords} from './translateWords'
import {translateAnalysisContext} from './translateAnalysisContext'
import R from 'ramda'
const translateFillAndContext = R.compose(translateContext,translateFill)
export{
  translateContext,
  translateFillAndContext,
  translateAnalysisContext,
  splitWords
}
