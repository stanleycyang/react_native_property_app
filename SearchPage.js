'use strict';

let React = require('react-native');
let SearchResults = require('./SearchResults');

let {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

let styles = StyleSheet.create({
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  image: {
    width: 217,
    height: 138
  }
});

function urlForQueryAndPage(key, value, pageNumber) {
  let data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };
  data[key] = value;
  let querystring = Object.keys(data)
                          .map(key => key + '=' + encodeURIComponent(data[key]))
                          .join('&');
  return 'http://api.nestoria.co.uk/api?' + querystring;
}

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    }
  }
  // underscore denotes private method
  _executeQuery(query) {
    console.log(query);
    this.setState({
      isLoading: true
    });
    fetch(query)
      .then(res => res.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => {
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        });
      });

  }
  _handleResponse(res) {
    this.setState({
      isLoading: false,
      message: ''
    })
    if(res.application_response_code.substr(0,1) === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: res.listings}
      });
    } else {
      this.setState({
        message: 'Location not recognized; Please try again.'
      });
    }
  }
  onSearchPressed() {
    let query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        let search = location.coords.latitude + ',' + location.coords.longitude;
        this.setState({
          searchString: search
        });
        let query = urlForQueryAndPage('centre_point', search, 1);
        this._executeQuery(query);
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your location: ' + error
        });
      });
  }

  render() {
    let spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large' />) :
      ( <View /> );
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy
        </Text>
        <Text style={styles.description}>
          Search by place name, postcode, or search near your location
        </Text>
        <View style={styles.flowRight}>
          <TextInput style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search via name or postcode' />
          <TouchableHighlight style={styles.button}
            onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button}
          onPress={this.onLocationPressed.bind(this)}
          underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={require('image!house')} style={styles.image} />
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({
      searchString: event.nativeEvent.text
    });
    console.log(this.state.searchString);
  }
}

module.exports = SearchPage;
