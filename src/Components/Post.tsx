import React from 'react';
import 'animate.css';

interface PostProps {
  image: string;
  explanation: string;
  date: string;
  title: string;
  thumbs: string;
}

interface PostState { }

export default class Post extends React.Component<PostProps, PostState> {
  constructor(props: any) {
    super(props);

    this.clickLikeButton = this.clickLikeButton.bind(this);
  }

  clickLikeButton(event: any) {
    const likeButton = event.target;
    likeButton.classList.remove('animate__animated', 'animate__wobble');
    likeButton.classList.add('animate__animated', 'animate__tada');
    likeButton.classList.toggle('emoji-deactivated');
  }

  isImage(url: string) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  } 

  render() {
    return (
      <div>
        <div className="max-w-lg rounded overflow-hidden shadow-lg">
          { this.isImage(this.props.image) ? <img className="w-full" src={this.props.image} alt="Mountain" /> : <iframe className="w-full" src={this.props.image}></iframe> }
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{this.props.title}</div>
            <p className="text-gray-500 pb-2 text-base">
              {this.props.date}
            </p>
            <p className="text-gray-700 text-base">
              {this.props.explanation}
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <button className="inline-block rounded-full pr-3 py-1 text-sm mr-2 mb-2 emoji-deactivated like-post"
                  onClick={(e) => this.clickLikeButton(e)}>&#10084;&#65039;</button>
            <button className="inline-block rounded-full pr-3 py-1 text-sm mr-2 mb-2">&#128203;</button>
          </div>
        </div>
      </div>
    );
  }
}