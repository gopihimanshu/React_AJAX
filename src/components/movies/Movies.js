import React from 'react';
import axios from 'axios';
import PouchDB from 'pouchdb';

export default class Movies extends React.Component{
  constructor(props){
    super(props);
    this.db = new PouchDB("movies");
    this.state = {results : [],movies : []};
    this.search = this.search.bind(this);
    this.add = this.add.bind(this);
  }

  componentDidMount(){
        this.db.allDocs({
          include_docs: true,
          attachments: true
          }).then( (result) =>  {
              const movies = result.rows;
              this.setState({movies});
        }).catch(function (err) {
        console.log(err);
    });
  }

  add(event){
      const title = event.target.parentNode.parentNode.querySelector('.title').textContent;
      const year= event.target.parentNode.parentNode.querySelector('.year').textContent;
      const poster = event.target.parentNode.parentNode.querySelector('.poster').getAttribute("src");
      
      this.db.put({
      _id: title,
      year,
      poster
      }).then(rsp => {
        console.log('rsp', rsp);
      }).catch(function (err) {
        console.log(err);
     });
  }

  clear(){
      this.setState({results: []});
  }
  search(){
      const query = this.query.value;
      const url = `http://www.omdbapi.com/?s=${query}&page=1`;
      axios.get(url)
      .then(rsp => {
          const results = rsp.data.Search;
          this.setState({results});
      });
  }

  

  render(){
    return (
      <div>
        <h1>Movies</h1>
            <div className="panel panel-default">
                <div className="panel-body">
                    <label>Search</label>
                    <input ref={n => this.query = n} type="text" />
                    <button onClick={this.search} className="btn btn-primary btn" > Search </button>
                    <button onClick={this.clear} className="btn btn-danger" > Clear </button><br/><br/>
                    <table className ="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Year</th>
                                <th>Poster</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.results.map((r,i) => {
                                    return (
                                        <tr key={i}>
                                            <td><button onClick = {this.add} className = "btn btn-success btn-xs">Add</button></td>
                                            <td className = "title">{r.Title}</td>
                                            <td className = "year">{r.Year}</td>
                                            <td><img className = "poster" src={r.Poster}></img></td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  }
}