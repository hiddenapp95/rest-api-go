const roles = {
    adminRoles: 0,
    createUser: 1,
    getUsers: 2
};

const userRoles = {
    owner: Object.keys(roles),
    admin: [],
    user: [],
    bannedUser: []
};

const userIsAuthorizedTo = ( userRole,role ) => !(!role || !userRoles[role] || !userRoles[role].includes(roles.get));

module.exports = {userIsAuthorizedTo,userRoles,roles};