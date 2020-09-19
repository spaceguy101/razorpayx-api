import request from "request";

class Contact {
  constructor(options = {}) {
    this.url = options.API_HOST;
    this.name = options.name; // string
    this.email = options.email; // string
    this.contact = options.contact; // string
    this.id = options.id || false;
    this.status = options.status;
    this.type = options.type || "customer"; // ['vendor','customer','employee','self']
    this.reference_id = options.reference_id; // string
    this.notes = options.notes || {}; // Object
  }

  getContacts(id) {
    const url = `${this.url}/contacts/${id || ""}`;
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

  createContact() {
    const options = {
      name: this.name,
      email: this.email,
      contact: this.contact,
      type: this.type,
      notes: this.notes || {},
      reference_id: this.reference_id || null,
    };
    const self = this;
    const validate = self.validate();
    return new Promise((resolve, reject) => {
      if (validate) {
        reject(validate);
      }
      request.post(
        `${self.url}/contacts`,
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

  updateContact() {
    const url = `${this.url}/contacts/${this.id || ""}`;
    const formValue = {
      name: this.name,
      email: this.email,
      contact: this.contact,
      type: this.type,
      notes: this.notes || {},
      reference_id: this.reference_id || null,
    };

    const self = this;
    const validate = self.validate();
    return new Promise((resolve, reject) => {
      if (!self.id)
        reject({
          error_code: "ID not found",
          message: "Contact id is required for updating the contact",
        });
      if (validate) {
        reject({ message: validate });
      }
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

  changeContactStatus() {
    const _this = this;

    const url = `${this.url}/contacts/${this.id || ""}`;
    const self = this;
    return new Promise((resolve, reject) => {
      if (!self.id)
        reject({
          error_code: "ID not found",
          message: "Contact id is required for updating the contact",
        });
      request.patch(
        url,
        { form: { active: _this.status } },
        (err, res, body) => {
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
        }
      );
    });
  }

  validate() {
    if (!this.name) return "Name is required";
    if (!this.type) return "Contact type is required";
  }
}

export { Contact };
