import * as fs from "fs";

interface Configs {
    SITE_URL: string;
    BROWSER: string;
    SELENIUM_WAIT_TIMEOUT_IN_MILLISECONDS: number;
    SELENIUM_POLLING_INTERVAL_IN_MILLISECONDS: number;
    MOCHA_TIMEOUT: number;
}

export class Constants {
    private static readonly CONFIG_FILE = 'config/config.json';
    private static readonly CONFIGS: Configs = Constants.loadConfig();

    private static loadConfig(): Configs {
        try {
            const configFile = fs.readFileSync(Constants.CONFIG_FILE, 'utf-8');
            return JSON.parse(configFile);
        } catch (error) {
            console.error(`An exception occurred while loading the ${Constants.CONFIG_FILE} file`, error);
            throw error;
        }
    }

    public static readonly SITE_URL: string = Constants.CONFIGS.SITE_URL || '';
    public static readonly BROWSER: string = Constants.CONFIGS.BROWSER || 'chrome';
    public static readonly WAIT_TIMEOUT_IN_MILLISECONDS: number = Constants.CONFIGS.SELENIUM_WAIT_TIMEOUT_IN_MILLISECONDS || 5000;
    public static readonly POLLING_INTERVAL_IN_MILLISECONDS: number = Constants.CONFIGS.SELENIUM_POLLING_INTERVAL_IN_MILLISECONDS || 2000;
    public static readonly MOCHA_TIMEOUT: number = Constants.CONFIGS.MOCHA_TIMEOUT || 60000;
}
