import {strings} from "./localization/strings";

export const searchByFilters = [
    {value:"cuil",label:strings.cuil}];

export const roles = {
    owner: "owner",
    admin: "admin",
    user: "user",
    bannedUser: "bannedUser"
};

export const userRoles = [
    {name: roles.owner, label: strings.ownerLabel, icon: "1"},
    {name: roles.admin, label: strings.adminLabel, icon: "2"},
    {name: roles.user, label: strings.userLabel, icon: "3"},
    {name: roles.bannedUser, label: strings.bannedUserLabel, icon: "4"},
];