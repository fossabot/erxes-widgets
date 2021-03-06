/* eslint-disable react/jsx-filename-extension */

import gql from 'graphql-tag';
import client, { wsLink } from '../apollo-client';
import widgetConnect from '../widgetConnect';
import {
  connection,
  getLocalStorageItem,
  setLocalStorageItem,
} from './connection';
import { setLocale } from '../utils';
import { App } from './containers';
import graphqTypes from './graphql';
import './sass/style.scss';

widgetConnect({
  connectMutation: (event) => {
    const setting = event.data.setting;

    connection.setting = setting;

    return client.mutate({
      mutation: gql(graphqTypes.connect),
      variables: {
        brandCode: setting.brand_id,
        email: setting.email,
        phone: setting.phone,

        cachedCustomerId: getLocalStorageItem('customerId'),

        // if client passed email automatically then consider this as user
        isUser: Boolean(setting.email),

        name: setting.name,
        data: setting.data,
        companyData: setting.companyData,
      },
    });
  },

  connectCallback: (data) => {
    const messengerData = data.messengerConnect;

    if (!messengerData.integrationId) {
      throw new Error('Integration not found');
    }

    // save connection info
    connection.data = messengerData;

    // set language
    setLocale(messengerData.languageCode);

    // save customer id to identify visitor next time
    setLocalStorageItem('customerId', messengerData.customerId);

    // send connected message to ws server and server will save given
    // data to connection. So when connection closed, we will use
    // customerId to mark customer as not active
    wsLink.subscriptionClient.sendMessage({ type: 'messengerConnected', value: messengerData });
  },

  AppContainer: App,
});
