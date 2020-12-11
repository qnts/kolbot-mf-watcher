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
  all({ date, page, limit, qualities }) {
    return Server.get('items', { date, page, limit, qualities });
  },
};

export const ErrorHandler = {
  getMessage: err => err.responseJSON ? err.responseJSON.message : err.statusText,
  getStatusCode: err => err.status,
};


export const socket = io();
export const goLive = (onNewItems, onJoinFail) => {
  socket.emit('room join');
  socket.on('room join', joined => {
    console.log('room status', joined);
    $('#icon-live').removeClass('text-danger').addClass('rotate');
    if (!joined && onJoinFail) {
      onJoinFail();
    }
  });
  socket.on('new items', items => {
    console.log(new Date(), 'new items', items.length);
    onNewItems(items);
  });
  socket.on('disconnect', function () {
    $('#icon-live').removeClass('rotate').addClass('text-danger');
  });
  socket.on('connect_error', function () {
    $('#icon-live').removeClass('rotate').addClass('text-danger');
  });
};
export const stopLive = () => {
  socket.off('new items');
};
