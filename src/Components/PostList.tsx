import axios from "axios";
import React from "react";
import Post from "./Post";

interface PostListProps { }

interface PostListState {
  posts: any;
  startDate: Date;
  endDate: Date;
  errorMessage: string;
}

export default class PostList extends React.Component<PostListProps, PostListState> {
  private apiKey: string = "iVkbfdJp1WxQGe0qOg7siRigvpvLAznewmZrf1dN";

  constructor(props: any) {
    super(props);

    this.state = {
      posts: [],
      startDate: new Date(),
      endDate: new Date(),
      errorMessage: "",
    };

    this.getPosts = this.getPosts.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.getPosts(true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // Checks if we are at the bottom of the page, and if so, loads more posts
  handleScroll() {
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight;

    if (scrolledToBottom && !document.getElementById("spinningButton")?.classList.contains("spinning-icon"))
      this.getPosts();
  }

  // Converts date to YYYY-MM-DD format
  convertDateToFormat(date: Date): string {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0]
  }

  // Gets posts from NASA API
  getPosts(isInitialRequest: boolean = false, numberOfPosts: number = 5) {
    if (document.getElementById("spinningButton")?.classList.contains("spinning-icon"))
      return;

    document.getElementById("spinningButton")?.classList.add("spinning-icon");

    const startDate: Date = new Date(this.state.startDate);
    startDate.setDate(startDate.getDate() - numberOfPosts);

    const endDate: Date = new Date(this.state.startDate);
    const endDateOffset: number = isInitialRequest ? 0 : -1;

    endDate.setDate(endDate.getDate() + endDateOffset);

    this.setState({ startDate: startDate, endDate: endDate });

    const query: string = 'https://api.nasa.gov/planetary/apod?api_key=' + this.apiKey +
                  '&start_date=' + this.convertDateToFormat(startDate) + '&end_date=' + this.convertDateToFormat(endDate);

    axios.get(query)
      .then((response) => {
        const posts = this.state.posts;

        response.data.reverse().forEach((e: any) => posts.push(e));

        this.setState({
          posts: posts,
        });
      }).catch((error) => {
        this.setState({
          errorMessage: "An error occurred while fetching posts. Please try again later.",
        });
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
          {this.state.errorMessage !== "" ? <h3 className="text-red-400 text-base">{this.state.errorMessage}</h3> : ""}
          {posts}
          <button id="spinningButton" onClick={() => this.getPosts()}>&#x21bb;</button>
        </div>
      </div>
    );
  }
}
