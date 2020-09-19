import { Contact } from "./razorpayx-entities/contact";
import { Funds } from "./razorpayx-entities/funds";
import { Payouts } from "./razorpayx-entities/payouts";

class RazorPayXClient {
  constructor(options) {
    this.key = options.key;
    this.secret = options.secret;
    this.API_HOST = `https://${this.key}:${this.secret}@api.razorpay.com/v1`;
  }

  getContacts({ id }) {
    options.API_HOST = this.API_HOST;
    const newContact = new Contact(options);
    return newContact.getContacts(id);
  }

  createContact(options) {
    options.API_HOST = this.API_HOST;
    const newContact = new Contact(options);
    return newContact.createContact();
  }

  updateContact(options) {
    options.API_HOST = this.API_HOST;
    const newContact = new Contact(options);
    return newContact.updateContact();
  }

  enableContact(options) {
    options.API_HOST = this.API_HOST;
    options.status = 1;
    const newContact = new Contact(options);
    return newContact.changeContactStatus();
  }

  disableContact(options) {
    options.API_HOST = this.API_HOST;
    options.status = 0;
    const newContact = new Contact(options);
    return newContact.changeContactStatus();
  }

  // Funds Accounts

  getAccounts(options) {
    options.API_HOST = this.API_HOST;
    const newFund = new Funds(options);
    return newFund.getAccounts(options);
  }

  getSingleAccount(options) {
    options.API_HOST = this.API_HOST;
    const newFund = new Funds(options);
    return newFund.getSingleAccount(options);
  }

  createAccount(options) {
    options.API_HOST = this.API_HOST;
    const newFunds = new Funds(options);
    return newFunds.createFundsAccount();
  }

  enableAccount(options) {
    options.API_HOST = this.API_HOST;
    options.status = 1;
    const newFunds = new Funds(options);
    return newFunds.changeAccountStatus(options);
  }

  disableAccount(options) {
    options.API_HOST = this.API_HOST;
    options.status = 0;
    const newFunds = new Funds(options);
    return newFunds.changeAccountStatus(options);
  }

  // Payouts

  getPayouts(options) {
    options.API_HOST = this.API_HOST;
    const newPayouts = new Payouts(options);
    return newPayouts.getPayouts();
  }

  getSinglePayout(options) {
    options.API_HOST = this.API_HOST;
    const newPayouts = new Payouts(options);
    return newPayouts.getSinglePayout();
  }

  cancelPayout(options) {
    options.API_HOST = this.API_HOST;
    const newPayouts = new Payouts(options);
    return newPayouts.cancelPayout();
  }

  createPayout(options) {
    options.API_HOST = this.API_HOST;
    const newPayouts = new Payouts(options);
    return newPayouts.createPayout();
  }
}

function configPayout(options) {
  return new RazorPayXClient(options);
}

export default {
  configPayout,
};
