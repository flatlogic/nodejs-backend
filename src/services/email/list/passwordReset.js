import { getNotification } from '../../notifications/helpers.js';

export class PasswordResetEmail {
  constructor(to, link) {
    this.to = to;
    this.link = link;
  }

  get subject() {
    return getNotification('emails.passwordReset.subject', getNotification('app.title'));
  }

  get html() {
    return getNotification(
      'emails.passwordReset.body',
      getNotification('app.title'),
      this.to,
      this.link,
    );
  }
}
