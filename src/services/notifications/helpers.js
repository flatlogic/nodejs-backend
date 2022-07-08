import _get from 'lodash/get.js';
import { errors } from './list.js';

function format(message, args) {
  if (!message) {
    return null;
  }

  return message.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

export const isNotification = key => {
  const message = _get(errors, key);
  return !!message;
};

export const getNotification = (key, ...args) => {
  const message = _get(errors, key);

  if (!message) {
    return key;
  }

  return format(message, args);
};
