"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPodfile = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("expo/config-plugins");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const withPodfile = (config, { targetName, excludedPackages }) => {
    // return config;
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        (config) => {
            const podFilePath = node_path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            let podfileContent = node_fs_1.default.readFileSync(podFilePath).toString();
            const useExpoModules = excludedPackages && excludedPackages.length > 0
                ? `exclude = ["${excludedPackages.join(`", "`)}"]
      use_expo_modules!(exclude: exclude)`
                : "use_expo_modules!";
            const appClipTarget = `
        target '${targetName}' do
          ${useExpoModules}
          config = use_native_modules!

          use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
          use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']

          use_react_native!(
            :path => config[:reactNativePath],
            :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
            # An absolute path to your application root.
            :app_path => "#{Pod::Config.instance.installation_root}/..",
            :privacy_file_aggregation_enabled => podfile_properties['apple.privacyManifestAggregationEnabled'] != 'false',
          )
        end
      `;
            /* podfileContent = podfileContent
              .concat(`\n\n# >>> Inserted by react-native-app-clip`)
              .concat(podfileInsert)
              .concat(`\n\n# <<< Inserted by react-native-app-clip`); */
            podfileContent = (0, generateCode_1.mergeContents)({
                tag: "react-native-app-clip-2",
                src: podfileContent,
                newSrc: appClipTarget,
                anchor: "Pod::UI.warn e",
                offset: 3,
                comment: "#",
            }).contents;
            node_fs_1.default.writeFileSync(podFilePath, podfileContent);
            return config;
        },
    ]);
};
exports.withPodfile = withPodfile;
