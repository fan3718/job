require('./styles/video.less')
import React ,{Component} from 'react'
import $ from 'jquery'
import moment from 'moment'
class Video extends Component {
	constructor(prop){
		super(prop);
		this.state = {
			isPlaying:false,
			duration:0,
			currentTime:0
		}
	}
	_handleLoadedMetadata(){
		const audio = this.refs.audio;
		this.setState({
			duration:audio.duration
		})
	}
	_handleClick(e){
		const audio = this.refs.audio;
		if(e.target.className.includes('video-bar-play-icon')){
			if(this.state.isPlaying){
				audio.pause();
			}else{
				audio.play();
			}
			this.setState({
				isPlaying:!this.state.isPlaying
			})
		}
	}
	_handlePlaying(){
		const audio = this.refs.audio;
		this.setState({
			currentTime:audio.currentTime
		})
	}
	_handleEnd(){
		this.setState({
			isPlaying:false
		})
	}
	componentDidMount(){
		$('video-bar-progressbar').width($('video-bar-progressbar').width());
	}
	render(){
		const width = parseInt((this.state.currentTime/this.state.duration)*100)+'%'
		return(
			<div className="video-bar">
				<div className="video-bar-play-icon" onTouchTap={e=>this._handleClick(e)}></div>
				<div className="video-bar-progressbar">
    			<div className="video-bar-progressbar-complete" style={{width:width}}></div>
    		</div>
				<div className="video-bar-time-info">{moment(parseInt(this.state.currentTime)*1000).format('mm:ss')}</div>
				<audio ref="audio" style={{display:'none'}} onEnded={this._handleEnd.bind(this)} onTimeUpdate={this._handlePlaying.bind(this)} onLoadedMetadata={this._handleLoadedMetadata.bind(this)}>
	   			<source src={this.props.src}/>
	   		</audio>
			</div>
		)
	}
}


export default Video
