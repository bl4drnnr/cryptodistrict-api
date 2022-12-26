"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BasicAuthMiddleware = void 0;
var common_1 = require("@nestjs/common");
var BasicAuthMiddleware = /** @class */ (function () {
    function BasicAuthMiddleware(configService) {
        this.configService = configService;
    }
    BasicAuthMiddleware.prototype.use = function (req, res, next) {
        if (req.headers['authorization']) {
            var authorization = req.headers['authorization'];
            var basic = authorization.match(/^Basic (.+)$/);
            if (!basic)
                return new common_1.UnauthorizedException();
            var credentials = Buffer.from(basic[1], 'base64').toString('utf-8');
            var apiUsername = this.configService.basicAuthConfig.username;
            var apiPassword = this.configService.basicAuthConfig.password;
            if (credentials != "".concat(apiUsername, ":").concat(apiPassword)) {
                return new common_1.UnauthorizedException();
            }
            return next();
        }
        return new common_1.UnauthorizedException();
    };
    BasicAuthMiddleware = __decorate([
        (0, common_1.Injectable)()
    ], BasicAuthMiddleware);
    return BasicAuthMiddleware;
}());
exports.BasicAuthMiddleware = BasicAuthMiddleware;
