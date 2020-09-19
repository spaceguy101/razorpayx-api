import request from "request";

class Funds {
  constructor(options = {}) {
    this.url = options.API_HOST;
    this.contact_id = options.contact_id; // string
    this.querry = options.querry;
    this.account_type = options.account_type; // string
    if (options.details) {
      this.name = options.details.accountHolderName; // string
      this.ifsc = options.details.ifsc; // string
      this.account_number = options.details.account_number; // string

      this.vpaAddress = options.details.vpaAddress;

      this.cardHolderName = options.details.cardHolderName;
      this.cardNumber = options.details.cardNumber;
    }
    this.id = options.id || false;
    this.status = options.status;
  }

  getAccounts({ active }) {
    //if id is present fetch a perticular account or fetch all the accounts,
    const queryString = `?contact_id=${this.contact_id}&account_type=${this.account_type}`;
    const url = `${this.url}/fund_accounts${queryString}`;
    const self = this;
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
        if (body.count) {
          const data = body.items;
          // var accounts = {
          //         "bank_account":{
          //         "name": options.accountHolderName,
          //         "ifsc": options.ifsc,
          //         "account_number": options.account_number,
          // },
          //     "vpa":{
          //         "address":options.vpaAddress
          //     },
          //     "card":{
          //         "name":options.cardHolderName,
          //         "number":options.cardNumber
          //     }
          // }
          // let obj = accounts[this.account_type]
          // let querry = {};
          //     Object.keys(obj).forEach((prop) => {
          //         obj[prop]?querry[prop] = obj[prop]:null
          //     })
          //     if(Object.keys(querry).length){
          //         console.log('enterd');
          //         querry = {[this.account_type]:querry}
          //         body.items = data.find(fid=>{
          //             return querry
          //         })
          //     }
          if (active)
            body.items = data.filter(({ active }) => {
              return active == true;
            });
          body.count = body.items.length;
        }
        resolve(body);
      });
    });
  }

  getSingleAccount({ id }) {
    //if id is present fetch a perticular account or fetch all the accounts,
    const url = `${this.url}/fund_accounts/${id || ""}`;
    const self = this;
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

  createFundsAccount() {
    const accounts = {
      bank_account: {
        name: this.name,
        ifsc: this.ifsc,
        account_number: this.account_number,
      },
      vpa: {
        address: this.vpaAddress,
      },
      card: {
        name: this.cardHolderName,
        number: this.cardNumber,
      },
    };
    const options = _defineProperty(
      {
        contact_id: this.contact_id,
        account_type: this.account_type,
      },
      this.account_type,
      accounts[this.account_type]
    );

    const self = this;
    return new Promise((resolve, reject) => {
      const validate = self.validate();
      if (validate) {
        reject(validate);
      }
      request.post(
        `${self.url}/fund_accounts`,
        { form: options },
        (err, res, body) => {
          if (err) {
            reject("server error");
          }
          body = JSON.parse(body);
          if (body.error) {
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

  changeAccountStatus() {
    const url = `${this.url}/fund_accounts/${this.id || ""}`;
    const self = this;
    const formValue = {
      active: this.status,
    };
    return new Promise((resolve, reject) => {
      if (!self.id)
        reject({
          error_code: "ID not found",
          message: "Fund account id is required for updating Account",
        });
      request.patch(url, { form: formValue }, (err, res, body) => {
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

  validate() {
    const account_types = ["bank_account", "vpa", "card"];
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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

export { Funds };
