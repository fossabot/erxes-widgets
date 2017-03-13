/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import client, { createStore } from './apollo-client';

const widgetConnect = ({ connectMutation, connectCallback, AppContainer, reducers }) => {
  // listen for widget toggle
  window.addEventListener('message', (event) => {
    // connect to api using passed settings
    if (event.data.fromPublisher) {
      // call connect mutation
      connectMutation(event)

      .then(({ data }) => {
        console.log('connected ...'); // eslint-disable-line

        // save connection info
        connectCallback(data);

        // render root react component
        ReactDOM.render(
          <ApolloProvider store={createStore(reducers)} client={client}>
            <AppContainer />
          </ApolloProvider>,
          document.getElementById('root'),
        );
      })

      .catch((error) => {
        console.log(error); // eslint-disable-line
        console.log('Integration not found'); // eslint-disable-line
      });
    }
  });
};

export default widgetConnect;