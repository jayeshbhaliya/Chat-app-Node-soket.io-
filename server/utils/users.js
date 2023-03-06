// var users = [];

// var addUser = (id,name,room) => {
//     users.push({});
// }

// var removeUser = (id) => {

// }

// var getUser = (id) => {

// }

// var getUserList = (room) => {

// }

// module.exports = {addUser, removeUser, getUser , getUserList}

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser(id) {
    return this.users.filter((u) => u.id === id)[0];
  }
  getUserList(room) {
    var users = this.users.filter((user) => {
      return (user.room = room);
    });
    var namesArray = users.map((user) => {
      return user.name;
    });

    return namesArray;
  }
}

module.exports = { Users };
