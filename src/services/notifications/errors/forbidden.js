import { getNotification, isNotification } from '../helpers.js';

export class ForbiddenError extends Error {
  constructor(messageCode) {
    let message;

    if (messageCode && isNotification(messageCode)) {
      message = getNotification(messageCode);
    }

    message = message || getNotification('errors.forbidden.message');

    super(message);
    this.code = 403;
  }
}
