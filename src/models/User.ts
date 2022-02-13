import { Model } from "./Model";
import { Attributes } from "./Attributes";
import { ApiSync } from "./ApiSync";
import { Eventing } from "./Eventing";
import { Collection } from "./Collection";

export interface UserProps {
  id?: number,
  name?: string,
  age?: number
}

const rootUrl = 'http://localhost:3000/users';

export class User extends Model<UserProps> {
  static buildUser(attrs: UserProps): User {
    return new User(
      //// Gives the ability to store properties tied to this user (name, age, etc)
      new Attributes<UserProps>(attrs),
      //// Gives us the ability to tell other parts of our application whenever data tied to a particular user is changed
      new Eventing(),
      //// Gives us the ability to save this persons data to a remote server, then retrieve it in the future
      new ApiSync<UserProps>(rootUrl)
    )
  }

  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection<User, UserProps>(
      rootUrl,
      (json: UserProps) => User.buildUser(json)
    )
  }
}