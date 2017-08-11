import { User } from './user.model';

export interface Friendship {
    id?: number;
    insertedAt?: Date;
    isAccepted?: boolean;
    updatedAt?: Date;
    friend?: User;
}

export interface FriendshipState {
  [key: number]: Friendship;
}
