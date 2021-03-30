import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePage from './components/ProfilePage';
import GeoUser from './components/GeoUser';
import TopBar from './components/TopBar';
import GeoCitiesSearch from './components/GeoCitiesSearch';
import NotificationsComponent from './components/NotificationsComponent';
import Followers from './components/Followers';
import Following from './components/Following';
import GeouserFollowers from './components/GeouserFollowers';
import GeoUserFollowing from './components/GeoUserFollowing';
import BuildCommunity from './components/BuildCommunity';
import Community from './components/Community'
import CommunityChat from './components/CommunityChat';
import UserSettings from './components/UserSettings';
import MessagesComponent from './components/MessagesComponent.js';
import ThreadComponent from './components/ThreadComponent';
import EventBuilder from './components/EventBuilder';
import Events from './components/Events';

function App(props) {
  const theme = createMuiTheme({
    palette: {
      type: props.mode,
      primary: {
        main: props.primary, //The primary state color
      },
      secondary: {
        main: 'rgb(255, 255, 255)',
      },
    },
  });

  return (
    <Router>
      <ThemeProvider 
        theme={theme} 
      >
        <CssBaseline />
        <TopBar />
        <Switch>
          <Route 
            component={Login}
            path='/'
            exact 
          />
          <Route 
            component={Signup}
            path='/signup'
            exact 
          />
          <Route 
            component={ProfilePage} 
            path='/profile'
            exact 
          />
          <Route 
            component={GeoUser} 
            path='/geouser/:uniqueUserId'
            exact 
          />
          <Route 
            component={GeoCitiesSearch}
            path='/geocities/search'
            exact 
          />
          <Route 
            component={NotificationsComponent}
            path='/notifications'
            exact 
          />
          <Route 
            component={Followers} 
            path='/followers' 
            exact 
          />
          <Route 
            component={Following} 
            path='/following'
            exact 
          />
          <Route 
            component={GeouserFollowers}
            path='/geouser/followers/:uniqueUserId'
            exact 
          />
          <Route 
            component={GeoUserFollowing}
            path='/geouser/following/:uniqueUserId'
            exact 
          />
          <Route 
            component={BuildCommunity}
            path='/build/community'
            exact 
          />
          <Route 
            component={Community}
            path='/community/:communityName'
            exact 
          />
          <Route 
            component={CommunityChat}
            path='/community/chat/:communityName'
            exact
          />
          <Route 
            component={UserSettings} 
            path='/settings'
            exact 
          />
          <Route 
            component={MessagesComponent}
            path='/messages'
            exact 
          />
          <Route 
            component={ThreadComponent} 
            path='/thread/:uniqueThreadId'
            exact 
          />
          <Route 
            component={EventBuilder} 
            path='/build/event' 
            exact 
          />
          <Route 
            component={Events} 
            path='/geocities/events'
            exact 
          />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

function mapStateToProps(state) {
  return {
    primary: state.userThemeReducer.primary,
    mode: state.themeReducer.theme,
    user: state.userReducer.user,
  };
}

export default connect(mapStateToProps)(App);