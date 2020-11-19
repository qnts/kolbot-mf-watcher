import $ from 'jquery';

export const Server = {
  base: '/api/',
  request(url, method, data) {
    return new Promise((ok, fail) => {
      const config = {
        url: `${Server.base}${url}`,
        contentType: 'application/json',
        method,
        data: method !== 'get' ? JSON.stringify(data) : data,
        success: ok,
        error: fail,
      };
      $.ajax(config);
    });
  },
  get(url, data) {
    return Server.request(url, 'get', data);
  },
  post(url, data) {
    return Server.request(url, 'post', data);
  },
  put(url, data) {
    return Server.request(url, 'put', data);
  },
};

export const Channel = {
  register(name, password) {
    return Server.post('channels/register', { name, password });
  },
  join(name, password) {
    return Server.post('channels/join', { name, password });
  },
  quit() {
    return Server.post('channels/quit');
  },
  changePassword(name, oldPassword, newPassword) {
    return Server.put('channels/change-password', { name, oldPassword, newPassword });
  },
};

export const Item = {
  all(date, page, limit) {
    return Server.get('items', { date, page, limit });
  },
};

export const ErrorHandler = {
  getMessage: err => err.responseJSON ? err.responseJSON.message : err.statusText,
  getStatusCode: err => err.status,
};
