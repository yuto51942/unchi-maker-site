import React from 'react'
import CopyToClipBoard from 'react-copy-to-clipboard'
import {TwitterShareButton, TwitterIcon} from 'react-share'
import Image from 'next/image'

interface State {
  text: string
  error: Error
  isLoaded: boolean
  item: {formatted_text: string}
  copied: boolean,
  url: string
}

interface Props {
  url: string
}

export default class Unchi extends React.Component<Props, State>{
  constructor(props: Props){
    super(props)

    this.updateText = this.updateText.bind(this)
    this.convert = this.convert.bind(this)
    this.showText = this.showText.bind(this)

    this.state = {
      text: '',
      error: null,
      isLoaded: false,
      item: {formatted_text: ''},
      copied: false,
      url: props.url
    }
  }

  updateText(event: React.ChangeEvent<HTMLInputElement>){
    this.setState(() => ({
      text: event.target.value
    }))
  }

  convert() {
    this.setState({isLoaded: true}, () => {
      fetch(`https://unchi-maker-api.vercel.app/?text=${this.state.text}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState(()=>({
            isLoaded: false,
            item: result,
            copied: false
          }))
        },
        (error) => {
          this.setState(()=>({
            isLoaded: false,
            error: error
          }))
        }
      )
    })
  }

  showText() {
    if(this.state.isLoaded){
      return 'Loading...'
    }else{
      if(this.state.error){
        return `Error: ${this.state.error.message}`
      }else {
        return this.state.item.formatted_text
      }
    }
  }

  render() {
    return (
      <div className="unchi">
        <div className="inputForm">
        <input type="text" value={this.state.text} onChange={this.updateText} />
        <div className="convertButton">
          <button onClick={this.convert}>
            変換する
          </button>
        </div>
        </div>
        <div className="resultValue">
          {this.showText()}
        </div>
        <div className="share">
          <CopyToClipBoard text={this.state.item.formatted_text} onCopy={() => this.setState({copied: true})}>
            <button className="copyButton">
              <Image src="/Copy.svg" alt="Clipboard" width={50} height={50} />
              {this.state.copied ? <div className="copied">コピーした！</div> : <div>コピー</div>}
              </button>
          </CopyToClipBoard>
          <TwitterShareButton url={this.state.url} title={this.state.item.formatted_text} hashtags={["うんちメーカー"]}>
            <button className="twitterbutton">
              <Image src="/Twitter.svg" alt="TwitterShare" width={50} height={50} />
              ツイート
            </button>
          </TwitterShareButton>
        </div>
      </div>
    )
  }

}
