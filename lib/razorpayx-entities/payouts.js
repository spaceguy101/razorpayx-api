import request from "request";

class Payouts {
  constructor(options = {}) {
    this.url = options.API_HOST;
    this.account_number = options.account_number; // This is the business account from which the payout is to be
    this.details = options.details;
    this.id = options.id || false;
    this.status = options.status;
  }

  getPayouts() {
    //if id is present fetch a perticular account or fetch all the accounts,
    const url = `${this.url}/payouts?account_number=${this.account_number}`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, res, body) => {
        if (err) {
          reject("server error");
        }
        body = JSON.parse(body);
        if (body.error) {
          return reject({
            err_code: body.error.code,
            message: body.error.description,
          });
        }
        resolve(body);
      });
    });
  }

  getSinglePayout() {
    const _this = this;

    //if id is present fetch a perticular account or fetch all the accounts,
    const url = `${this.url}/payouts/${this.id}`;
    return new Promise((resolve, reject) => {
      if (!_this.id) reject("Payout id is required");
      request.get(url, (err, res, body) => {
        if (err) {
          reject("server error");
        }
        body = JSON.parse(body);
        if (body.error) {
          return reject({
            err_code: body.error.code,
            message: body.error.description,
          });
        }
        resolve(body);
      });
    });
  }

  cancelPayout() {
    const _this2 = this;

    //if id is present fetch a perticular account or fetch all the accounts,
    const url = `${this.url}/payouts/${this.id}/cancel`;
    return new Promise((resolve, reject) => {
      if (!_this2.id) reject("Payout id is required");
      request.post(url, { form: {} }, (err, res, body) => {
        if (err) {
          reject("server error");
        }
        body = JSON.parse(body);
        if (body.error) {
          return reject({
            err_code: body.error.code,
            message: body.error.description,
          });
        }
        resolve(body);
      });
    });
  }

  createPayout() {
    const self = this;
    this.details["queue_if_low_balance"] = this.details["queue_if_low_balance"]
      ? 1
      : 0;
    this.details["account_number"] = self.account_number;
    return new Promise((resolve, reject) => {
      request.post(
        `${self.url}/payouts`,
        { form: self.details },
        (err, res, body) => {
          if (err) {
            reject("server error");
          }
          body = JSON.parse(body);
          if (body.error) {
            body.error.description.includes("No db records found.")
              ? (body.error.description = "The account number is invalid")
              : "";
            reject({
              err_code: body.error.code,
              message: body.error.description,
            });
          }
          resolve(body);
        }
      );
    });
  }

  validate() {
    const payout_mode = ["NEFT", "RTGS", "IMPS", "IFT", "UPI"];
    const payout_purpose = [
      "refund",
      "cashback",
      "payout",
      "salary",
      "utility bill",
      "vendor bill",
    ];
    const manditory_fields = [
      "account_number",
      "fund_account_id",
      "amount",
      "currency",
      "mode",
      "purpose",
    ];
    let _iteratorNormalCompletion = true;
    let _didIteratorError = false;
    let _iteratorError = undefined;

    try {
      for (
        var _iterator = manditory[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        const field = _step.value;

        if (!this[field]) {
          return `${this[field]} is required`;
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!this.account_type) return "Account type is required";
    if (!account_types.includes(this.account_type))
      return "Enter the valid account type";
    if (this.account_type && !this.contact_id) return "Contect id is required";
    if (this.account_type == "bank_account") {
      if (!this.name || !this.ifsc || !this.account_number)
        return "name, ifsc, account_numner is required";
    } else if (this.account_type == "vpa") {
      if (!this.vpaAddress) return "vpa address is required";
    } else if (this.account_type == "card") {
      if (!this.cardHolderName || !this.cardNumber)
        return "card holder name or card number is required";
    }
  }
}

export { Payouts };
