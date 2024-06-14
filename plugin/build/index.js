"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withConfig_1 = require("./withConfig");
const withEntitlements_1 = require("./withEntitlements");
const withPlist_1 = require("./withPlist");
const withPodfile_1 = require("./withPodfile");
const withXcode_1 = require("./withXcode");
const withAppClip = (config, { name, groupIdentifier, deploymentTarget, requestEphemeralUserNotification, requestLocationConfirmation, appleSignin, applePayMerchantIds, excludedPackages, } = {}) => {
    name ??= "Clip";
    deploymentTarget ??= "14.0";
    appleSignin ??= false;
    if (!config.ios?.bundleIdentifier) {
        throw new Error("No bundle identifier specified in app config");
    }
    const bundleIdentifier = `${config.ios.bundleIdentifier}.AppClip`;
    const targetName = `${config_plugins_1.IOSConfig.XcodeUtils.sanitizedName(config.name)}Clip`;
    const modifiedConfig = (0, config_plugins_1.withPlugins)(config, [
        [
            withConfig_1.withConfig,
            { targetName, bundleIdentifier, appleSignin, applePayMerchantIds },
        ],
        [
            withEntitlements_1.withEntitlements,
            { targetName, groupIdentifier, appleSignin, applePayMerchantIds },
        ],
        [withPodfile_1.withPodfile, { targetName, excludedPackages }],
        [
            withPlist_1.withPlist,
            {
                targetName,
                deploymentTarget,
                requestEphemeralUserNotification,
                requestLocationConfirmation,
            },
        ],
        [
            withXcode_1.withXcode,
            {
                name,
                targetName,
                bundleIdentifier,
                deploymentTarget,
            },
        ],
    ]);
    return modifiedConfig;
};
exports.default = withAppClip;
