'use strict';

let React = require('react-native');
let SearchPage = require('./SearchPage');
// destructuring assignment, which allow you to assign variables using a single statement. As a result, the rest of the code can drop the React prefix.
let {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  Component,
} = React;

// React component
class PropertyFinderApp extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage
        }}/>
    );
  }
}

// Defines style which will be applied to Hello World text
let styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

// Defines the entry point to the application and provides the root component
React.AppRegistry.registerComponent('PropertyFinder', function() {
  return PropertyFinderApp
});
