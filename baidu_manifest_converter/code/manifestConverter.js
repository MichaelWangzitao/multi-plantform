const fs = require('fs');

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

let rawData = fs.readFileSync(inputPath);
let standardManifest = JSON.parse(rawData);
let baiduManifest = new Object();

function convertMembers(standardManifest) {
    // no app_id in baidu miniapp
    // no color_scheme
    // no description
    // no device_type
    // no dir
    // no icons
    // no lang
    // no platform_version
    // no name
    // pages
    baiduManifest.pages = standardManifest.pages;
    // req_permissions
    if (standardManifest.hasOwnProperty('req_permissions')) {
        baiduManifest.permission = new Object();
        standardManifest.req_permissions.forEach(permission => {
            permissionObject = new Object();
            permissionObject.desc = permission.reason || '';
            baiduManifest.permission[permission.name] = permissionObject;
        });
    }
    // no short_name
    // no version
    // TODO widgets
    // window
    if (standardManifest.hasOwnProperty('window')) {
        let standardWindow = standardManifest.window;
        let baiduWindow = new Object();
        // no auto_design_width
        if (standardWindow.background_color) {
            baiduWindow.backgroundColor = standardWindow.background_color;
        }
        if (standardWindow.background_text_style) {
            baiduWindow.backgroundTextStyle = standardWindow.background_text_style;
        }
        // no design_width
        if (standardWindow.enable_pull_down_refresh) {
            baiduWindow.enablePullDownRefresh = `${standardWindow.enable_pull_down_refresh}`;
        }
        // no fullscreen
        if (standardWindow.navigation_bar_background_color) {
            baiduWindow.navigationBarBackgroundColor = standardWindow.navigation_bar_background_color;
        }
        if (standardWindow.navigation_bar_text_style) {
            baiduWindow.navigationBarTextStyle = standardWindow.navigation_bar_text_style;
        }
        if (standardWindow.navigation_bar_title_text) {
            baiduWindow.navigationBarTitleText = standardWindow.navigation_bar_title_text;
        }
        if (standardWindow.navigation_style) {
            baiduWindow.navigationStyle = standardWindow.navigation_style;
        }
        if (standardWindow.on_reach_bottom_distance) {
            baiduManifest.onReachBottomDistance = `${standardWindow.on_reach_bottom_distance}`;
        }
        // no orientation
        baiduManifest.window = baiduWindow;
    }
}

convertMembers(standardManifest);

fs.writeFile(outputPath, JSON.stringify(baiduManifest, null, "\t"), (error) => {
    if (error) throw error;
});