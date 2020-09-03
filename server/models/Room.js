class Room {
  constructor() {
    this.list = []
  }

  createUser(id, name, room){
    this.list.push({id, name, room})
  }

  getUserById(id){
    return this.list.find(user => user.id === id)
  }

  removeUser(id){
    const index = this.list.findIndex(user => user.id === id);
    const user = this.list[index]
    this.list.splice(index, 1);
    return user;
  }
  getUserByRoom(room){
    return this.list.filter(user => user.room === room)
  }
}

module.exports = Room;

