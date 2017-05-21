function get() {
  return JSON.parse(localStorage.getItem('authUser'));
}

function save(authUser) {
  localStorage.setItem('authUser', JSON.stringify(authUser));
}

function remove() {
  localStorage.removeItem('authUser');
}

const authStorage = {
  get, save, remove
};

export { authStorage };
