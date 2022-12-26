"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ApiConfigService = void 0;
var common_1 = require("@nestjs/common");
var lodash_1 = require("lodash");
var ApiConfigService = /** @class */ (function () {
    function ApiConfigService(configService) {
        this.configService = configService;
    }
    ApiConfigService.prototype.get = function (key) {
        var value = this.configService.get(key);
        if ((0, lodash_1.isNil)(value)) {
            throw new Error(key + ' environment variable does not set');
        }
        return value;
    };
    ApiConfigService.prototype.getString = function (key) {
        var value = this.get(key);
        return value.replace(/\\n/g, '\n');
    };
    Object.defineProperty(ApiConfigService.prototype, "databaseUrl", {
        get: function () {
            return {
                url: this.getString('DATABASE_URL')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "basicAuthConfig", {
        get: function () {
            return {
                username: this.getString('BASIC_AUTH_USERNAME'),
                password: this.getString('BASIC_AUTH_PASSWORD')
            };
        },
        enumerable: false,
        configurable: true
    });
    ApiConfigService = __decorate([
        (0, common_1.Injectable)()
    ], ApiConfigService);
    return ApiConfigService;
}());
exports.ApiConfigService = ApiConfigService;
