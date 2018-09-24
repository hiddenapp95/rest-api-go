import NAME from "./constants";

export const getFilteredUsers = (state) =>
    state[NAME].filter === ""?
        state[NAME].users:
        state[NAME].users.filter(user=>user.email.toLowerCase().includes(state[NAME].filter.toLowerCase()));

export const getUser = (state) => state[NAME].user;

export const isRequesting = (state) => state[NAME].login_request;