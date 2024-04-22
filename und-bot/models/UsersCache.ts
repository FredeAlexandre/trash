import { UserModel } from "./UserModel";

class UsersCache {
  users: Map<string, UserModel> = new Map();

  get(id: string) {
    let user = this.users.get(id);
    if (user) return user;
    user = new UserModel(id);
    this.users.set(id, user);
    return user;
  }
}

const cache = new UsersCache();

export default cache;
