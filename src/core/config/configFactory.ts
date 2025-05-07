import { HyperShieldConfig } from '../types/config';
import { ConfigValidator } from './validator';

export class ConfigFactory {
  private static instance: ConfigFactory;
  private currentConfig: HyperShieldConfig;

  private constructor() {
    this.currentConfig = ConfigValidator.validate({});
  }

  static getInstance(): ConfigFactory {
    if (!ConfigFactory.instance) {
      ConfigFactory.instance = new ConfigFactory();
    }
    return ConfigFactory.instance;
  }

  updateConfig(config: Partial<HyperShieldConfig>): void {
    this.currentConfig = ConfigValidator.validate(config);
  }

  getConfig(): HyperShieldConfig {
    return { ...this.currentConfig };
  }

  loadEnvironmentConfig(): void {
    const env = process.env.NODE_ENV || 'development';
    try {
      const envConfig = require(`../../../config/${env}.json`);
      this.updateConfig(envConfig);
    } catch (error) {
      console.warn(`No configuration found for environment: ${env}`);
    }
  }
}
