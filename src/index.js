import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { DB_CONFIG } from './Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class App extends Component {
  constructor() {
    super();
    this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
    this.database = this.app.database().ref().child('trek-noise/');
    this.state = {
      name: 'TrekNoise',
      entries: [],
    };
  }

  componentDidMount() {
		const itemsRef = firebase.database().ref('posts/');
		// TODO: Add user-specific database folders based on login
		// firebase.auth().onAuthStateChanged(function(user){
		// 	if (user) {
		// 		itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.displayName}`);
		// 	}
		// 	else {
		// 		itemsRef = firebase.database().ref('entries/default');
		// 	}
		// });
		itemsRef.on('value', (snapshot) => {
			let entries = snapshot.val();
			let newState = [];
			for (let entry in entries) {
				newState.push({
					id: entry,
					title: entries[entry].title,
					articleBody: entries[entry].articleBody
				});
			}
			this.setState({
				entries: newState
			});
		// });
		// this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
		// 	(user) => this.setState({isSignedIn: !!user})
		// );
	  })
  }

	removeItem(itemId) {
		const itemRef = firebase.database().ref(`/posts/${itemId}`);
		itemRef.remove();
	}

  render() {
    return (
      <div>
        <div className="hero is-medium is-centered" style={{padding: "15px"}}>
          <figure className="image">
						<img src="logo.png" alt="TrekNoise Logo" style={{width: "50%", height: "10%", position: "relative", left: "25%"}}></img>
					</figure>
          <div className="box">
          <div className="title">Noise</div>
          <br />
          <div className="tile is-ancestor">
            <div className="tile is-vertical is-parent">
              {this.state.entries.map((entry) => {
                return(
                  <div className="tile box is-child notification is-white">
                  <button className="delete" onClick={() => this.removeItem(entry.id)}></button>
                  <p className="title is-5">{entry.title}</p>
                  <div className="has-text-centered" style={{padding: "10px"}}></div>
                  {entry.articleBody}
                  </div>
                )
              })}
            </div>
          </div>
          </div>
        </div>
				<footer className="hero-foot" style={{position: "relative", bottom: 0}}>
				 <div className="content has-text-centered" style={{color: "white"}}>
					Made with <i className="fa fa-heart" style={{color: "rgb(235, 43, 86)"}}></i> & <i className="fa fa-coffee" style={{color: "grey"}}></i> in Orlando
				 <div className=" content has-text-centered">
					 <a href="https://bulma.io">
					 <img src="https://bulma.io/images/made-with-bulma--white.png" alt="Made with Bulma" width="128" height="24" />
					 </a>
				 </div>
				 </div>
				</footer>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
