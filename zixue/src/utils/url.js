import R from 'ramda'
export const parseUrlSaveToGlobal = R.compose(R.map(R.compose(arr=>
                                    {window[arr[0]]=arr[1]},R.split('='))),R.split('&'))
