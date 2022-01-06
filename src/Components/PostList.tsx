import axios from "axios";
import React from "react";
import Post from "./Post";

interface PostListProps { }

interface PostListState {
  posts: any;
  startDate: Date;
  endDate: Date;
}

export default class PostList extends React.Component<PostListProps, PostListState> {
  private apiKey: string = "iVkbfdJp1WxQGe0qOg7siRigvpvLAznewmZrf1dN";

  constructor(props: any) {
    super(props);

    this.state = {
      posts: [],
      startDate: new Date(),
      endDate: new Date(),
    };

    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount() {
    this.getPosts();
  }

  convertDateToFormat(date: Date): string {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0]
  }

  getPosts() {
    document.getElementById("spinningButton")?.classList.add("spinning-icon");

    const startDate = new Date(this.state.startDate);
    startDate.setDate(startDate.getDate() - 5);

    this.setState({ startDate: startDate });

    const query = 'https://api.nasa.gov/planetary/apod?api_key=' + this.apiKey +
                  '&start_date=' + this.convertDateToFormat(startDate) + '&end_date=' + this.convertDateToFormat(this.state.endDate);

    axios.get(query)
      .then((response) => {
        this.setState({
          posts: response.data.reverse(),
        });
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        document.getElementById("spinningButton")?.classList.remove("spinning-icon");
      });
  }

  render() {
    const posts =
      this.state.posts.map((post: any, i:number) => (
        <Post key={i} image={post["url"]} thumbs={post["thumbs"]} explanation={post["explanation"]} date={post["date"]} title={post["title"]}/>
      ));

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="grid grid-cols-1 gap-6 m-auto pt-6 pb-6">
          <h1 className="text-slate-800 text-2xl">Spacestagram</h1>
          <h2 className="text-slate-600 text-base">Brought to you by NASA's Astronomy Photo of the Day API</h2>
          {posts}
          <button id="spinningButton" onClick={() => this.getPosts()}>&#x21bb;</button>
        </div>
      </div>
    );
  }
}
