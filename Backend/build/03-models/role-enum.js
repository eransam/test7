"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//משתנה טייפ שאנו י צרנו באופן ידני  (אינטרפייס)
var RoleEnum;
(function (RoleEnum) {
    RoleEnum[RoleEnum["User"] = 1] = "User";
    RoleEnum[RoleEnum["Admin"] = 2] = "Admin";
})(RoleEnum || (RoleEnum = {}));
exports.default = RoleEnum;
