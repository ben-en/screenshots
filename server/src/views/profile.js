/* jshint browser:true */

const React = require("react");
const events = require("../events");

exports.ProfileButton = class ProfileButton extends React.Component {
  constructor(props) {
    super(props);
    this.onWindowClick = this.dismiss.bind(this);
    this.state = { isExpanded: props.initialExpanded };
  }

  signIn() {
    events.signIn();
    this.setState({ isExpanded: false });
  }

  signUp() {
    events.signUp();
    this.setState({ isExpanded: false });
  }

  componentDidMount() {
    window.addEventListener("click", this.onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  dismiss(e) {
    if (this.state.isExpanded) {
      let panel = React.findDOMNode(this.refs.panel);
      if (!panel.contains(e.target)) {
        this.setState({ isExpanded: false });
      }
    }
  }

  hideProfile() {
    this.setState({ isExpanded: false });
  }

  showProfile() {
    this.setState({ isExpanded: true });
  }

  onClickProfile(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    let { avatarurl } = this.props;
    if (! avatarurl) {
      avatarurl = this.props.staticLink("img/profile-anonymous.svg");
    }
    if (this.state.isExpanded) {
      return (
        <span className="toolbar-button">
          <img src={ this.props.staticLink("img/profile-open.png") } onClick={ this.onClickProfile.bind(this) } />
          <exports.Profile
            ref="panel"
            signUp={ this.signUp.bind(this) }
            signIn={ this.signIn.bind(this) }
            avatarurl={ avatarurl }
            nickname={ this.props.nickname }
            email={ this.props.email }
          />
        </span>
      );
    }
    return (
      <span className="toolbar-button">
        <img src={ this.props.staticLink("img/profile.png") } onClick={ this.onClickProfile.bind(this) } />
      </span>
    );
  }
};

exports.Profile = class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nickname: this.props.nickname };
  }

  onClickSignUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.signUp();
  }

  onClickSignIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.signIn();
  }

  onKeyPressName(e) {
    let input = React.findDOMNode(this.refs.nickname);
    if (e.which == 13) {
      input.blur();
      events.setProfileState({ nickname: this.state.nickname });
    }
  }

  onChangeName(e) {
    this.setState({ nickname: e.target.value });
  }

  renderSignedIn() {
    // TODO: Maybe show a list of connected devices with PageShot here?
    // This could also be the "send to mobile" UI...
    return (
      <div className="sync-status">
        <p>You are signed in as {this.props.email}.</p>
      </div>
    );
  }

  renderSignedOut() {
    return (
      <div className="sync-status">
        <p>Access your snapshot history wherever you use Firefox.</p>
        <ul className="sync-buttons">
          <li><a href="#" onClick={ this.onClickSignUp.bind(this) }>Create Account</a></li>
          <li><a href="#" onClick={ this.onClickSignIn.bind(this) }>Sign In</a></li>
        </ul>
      </div>
    );
  }

  render() {
    let syncStatus = this.props.email ? this.renderSignedIn() : this.renderSignedOut();
    return (
      <div id="profile" className="panel">
        <div className="avatar-container">
          <img className="avatar" src={ this.props.avatarurl } />
        </div>
        <div className="label"><label for="nickname">Name</label></div>
        <div>
          <input type="text" ref="nickname" id="nickname" defaultValue={ this.state.nickname }
            onChange={ this.onChangeName.bind(this )}
            onKeyPress={ this.onKeyPressName.bind(this) }
            placeholder="Pick a name for yourself" />
        </div>
        <div className="label">Sync</div>
        {syncStatus}
      </div>
    );
  }
};
