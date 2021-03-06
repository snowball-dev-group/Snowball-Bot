import * as Localization from "@sb-types/Localizer/Localizer";
import { IModuleInfo } from "@sb-types/ModuleLoader/Interfaces";
import * as ModLoader from "@sb-types/ModuleLoader/ModuleLoader";
import * as djs from "discord.js";
import * as logger from "loggy";
import * as Raven from "raven";
import { Typer, InterfaceSchema } from "./Typer";
import { LocalizerYAMLParser } from "@sb-types/Localizer/parsers/YAMLParser";

export interface IBotConfig {
	/**
	 * Bot token
	 */
	token: string;
	/**
	 * Name of bot
	 */
	name: string;
	/**
	 * discord's Snowflake ID of bot owner
	 */
	botOwner: string;
	/**
	 * Modules to automatic load
	 */
	autoLoad: string[];
	/**
	 * Array of modules info
	 */
	modules: IModuleInfo[];
	/**
	 * Discord Client's config
	 */
	djsConfig: djs.ClientOptions;
	/**
	 * Localizator options
	 */
	localizerOptions: Localization.ILocalizerOptions;
	/**
	 * Sharding options
	 */
	shardingOptions: {
		enabled: boolean;
		shards: number;
	};
	/**
	 * Enable queue mode?
	 * If `false`, all modules will be loaded at same time
	 * Parallel loading is good for debugging
	 */
	queueModuleLoading: boolean;
	/**
	 * Raven URL (Sentry.io)
	 */
	ravenUrl?: string;
}

export interface IPublicBotConfig {
	/**
	 * Name of bot
	 */
	name: string;
	/**
	 * ID of bot owner
	 */
	botOwner: string;
	/**
	 * Bot is runned in sharded mode
	 */
	sharded: boolean;
	/**
	 * Main shard
	 */
	mainShard: boolean;
	/**
	 * Shard ID
	 */
	shardId: number;
	/**
	 * Total Shards
	 */
	shardsCount: number;
}

export interface IInternalBotConfig {
	/**
	 * Currently runned shards
	 */
	shardsCount: number;
	/**
	 * Current Shard ID
	 */
	shardId: number;
}

declare global {
	/**
	 * Bot itself
	 */
	const $discordBot: djs.Client;

	/**
	 * Public bot config visible to all modules
	 */
	const $botConfig: IPublicBotConfig;

	/**
	 * Localizer
	 */
	const $localizer: Localization.Localizer;

	/**
	 * Module Loader
	 */
	const $modLoader: ModLoader.ModuleLoader;

	/**
	 * Snowball bot instance
	 */
	const $snowball: SnowballBot;
}

const SCHEMA_CONFIG: InterfaceSchema<IBotConfig> = {
	"token": { type: "string" },
	"name": { type: "string" },
	"botOwner": { type: "string" },
	"autoLoad": {
		type: "object", isArray: true,
		elementSchema: { type: "string" }
	},
	"modules": {
		type: "object", isArray: true,
		elementSchema: ModLoader.SCHEMA_MODULEINFO
	},
	"djsConfig": { type: "any" },
	"localizerOptions": {
		type: "object",
		schema: Localization.SCHEMA_LOCALIZEROPTIONS
	},
	"shardingOptions": {
		type: "object",
		schema: {
			"enabled": { type: "boolean" },
			"shards": { type: "number", notNaN: true }
		}
	},
	"queueModuleLoading": { type: "boolean", optional: true },
	"ravenUrl": { type: "string", optional: true }
};

export class SnowballBot {
	/**
	 * Module loader
	 */
	public modLoader: ModLoader.ModuleLoader;
	
	/**
	 * Discord Bot
	 */
	private _discordClient: djs.Client;
	
	/**
	 * Raven (Sentry.io) client
	 */
	public raven: Raven.Client | null;

	/**
	 * Log function
	 */
	private readonly _log: Function;

	constructor(
		/**
		 * Bot configuration
		 */
		private readonly _config: IBotConfig,
		/**
		 * Internal configuration
		 */
		private readonly _internalConfiguration: IInternalBotConfig
	) {
		// Check everything
		Typer.checkObjectBySchema(SCHEMA_CONFIG, _config);

		this._log = logger(`${_config.name}:SnowballBot`);

		// Public Snowball instance
		Object.defineProperty(global, "$snowball", {
			enumerable: true, writable: false,
			configurable: false, value: this
		});
	}

	/**
	 * Prepare module loader
	 * It will load all modules / plugins
	 */
	public async prepareModLoader() {
		if (this.modLoader) { throw new Error("ModLoader is already prepared"); }

		this.modLoader = new ModLoader.ModuleLoader({
			basePath: "./cogs/",
			name: `${this._config.name}:ModLoader`,
			defaultSet: this._config.autoLoad,
			registry: ModLoader.convertToModulesMap(this._config.modules)
		});

		// Public module loader
		Object.defineProperty(global, "$modLoader", {
			configurable: false, enumerable: false,
			writable: true, value: this.modLoader
		});

		await this.modLoader.loadModules();
	}

	/**
	 * Prepare global client variable and client itself
	 */
	public prepareDiscordClient() {
		if (this._discordClient) { throw new Error("Discord client is already prepared"); }

		const publicBotConfig: IPublicBotConfig = {
			name: this._config.name,
			botOwner: this._config.botOwner,
			mainShard: true,
			sharded: false,
			shardId: 1,
			shardsCount: 1
		};

		// Prepare the options
		const djsOptions = this._config.djsConfig || {};

		{ // Checks the shards count
			const shardCount = this._internalConfiguration.shardsCount;

			if (this._config.shardingOptions.enabled) {
				this._log("warn", "WARNING! Running in sharding mode is still expiremental. Please use it with caution!");

				if (shardCount < 0) {
					this._log("err", "Invalid shards count", shardCount);
					throw new Error("Invalid shards count");
				}

				publicBotConfig.sharded = true;
			}
		}

		{ // Check shard ID
			const shardId = this._internalConfiguration.shardId;

			if (shardId >= 0) {
				this._log("info", "Running as shard with ID", shardId);

				if (shardId === 0) {
					publicBotConfig.mainShard = true;
				}

				publicBotConfig.shardId = shardId;
			} else {
				throw new Error("Invalid shard id");
			}
		}

		djsOptions.shardId = this._internalConfiguration.shardId;
		djsOptions.shardCount = this._internalConfiguration.shardsCount;

		this._log("info", "Preparing the Discord client...");

		// Make the new Discord Client
		this._discordClient = new djs.Client(djsOptions);

		// Set max listeners number
		this._discordClient.setMaxListeners(0);

		// Handle the messages
		this._discordClient
			.on("warn", (info: string) => this._log("warn", info))
			.on("error", (err) => {
				this._log("err", "Error at the Discord client", err);
				this.captureException(err);
			});

		// Handle the disconnect
		this._discordClient.on("disconnect", async (reason) => {
			this._log("warn", "Disconnected with the reason:", reason);

			const status = this._discordClient.status;

			if (typeof status !== "number" || status < 3) {
				switch (status) {
					case 2: {
						this._log("info", "The reconnection in process. Not handling the disconnect event...");
					} break;
					case 1: {
						this._log("warn", "Currently connecting (which is unexpected status in this situation). Not handling the disconnect event...");
					} break;
					case 0: {
						this._log("info", "\"READY\" status, the reconnect already happened. Not handling the disconnect event...");
					} break;
					default: {
						this._log("warn", "Unexpected status detected, for safety reason. Not handling the disconnect event...");
					} break;
				}

				return;
			}
			

			this._log("warn", "No reconnect pending, reconnecting...");

			try {
				await this.login();
				this._log("ok", "Reconnected successfully");
			} catch (err) {
				this._log("err", "Detected error while reconnecting", err);
				this.captureException(err);

				this.shutdown("reconnection_failure");
			}
		});

		// Handle other miscellaneous events
		this._discordClient
			.on("reconnecting", () => {
				this._log("info", "The Discord client reported reconnecting...");
			})
			.on("resumed", (replayedEvents) => {
				this._log("ok", `The connection has been resumed with ${replayedEvents} events replayed`);
			})
			.on("ready", () => {
				this._log("info", "The Discord client reported \"READY\"");
			})
			.on("rateLimit", (ratelimit: djs.RateLimitData) => {
				this._log("warn", `Ratelimit hit. ${ratelimit.method} ${ratelimit.path} ${ratelimit.route} - ${ratelimit.timeout}`);
			});

		// Define the global bot variable, which should be used by the plugins
		Object.defineProperty(global, "$discordBot", {
			configurable: false, enumerable: false,
			writable: true, value: this._discordClient
		});

		// Define the global public bot configuration for the plugins
		Object.defineProperty(global, "$botConfig", {
			configurable: false, enumerable: false,
			writable: true, value: publicBotConfig
		});
	}

	public prepareRaven() {
		if (this.raven) {
			throw new Error("Raven is already prepared");
		}

		if (this._config.ravenUrl) {
			this.raven = Raven.config(this._config.ravenUrl).install();
			this._log("ok", "Raven is configured!");
		} else {
			this.raven = null;
		}

		Object.defineProperty(global, "$raven", {
			enumerable: true, configurable: false,
			writable: false, value: this.raven
		});
	}

	public captureException(err: Error, options?: Raven.CaptureOptions) {
		if (!this.raven) { return; }

		return this.raven.captureException(err, options);
	}

	public captureMessage(message: string, options?: Raven.CaptureOptions) {
		if (!this.raven) { return; }

		return this.raven.captureMessage(message, options);
	}

	/**
	 * Prepare Localizer
	 * Creates, initializes, defines global variable of localizer
	 */
	public async prepareLocalizator() {
		if (global["$localizer"]) {
			throw new Error("Localizer is already prepared");
		}

		const localizer = new Localization.Localizer(
			`${this._config.name}:Localizer`,
			this._config.localizerOptions
		);

		localizer.fileLoader.parsersCollection.addParser(
			new LocalizerYAMLParser()
		);

		await localizer.init();

		Object.defineProperty(global, "$localizer", {
			configurable: false, enumerable: false,
			writable: false, value: localizer
		});
	}

	/**
	 * Connect to Discord
	 */
	public async login() {
		this._log("info", "Connecting to Discord...");

		if (!this._discordClient) {
			throw new Error("Discord client not requires reconnecting");
		}

		return this._discordClient.login(this._config.token);
	}

	/**
	 * Forces all modules to unload and shutdowns Discord connection
	 * @param reason Reason of shutdown whcih will be transfered to all modules
	 */
	public async shutdown(reason = "unknown") {
		this._log("info", `Shutting down with the reason: "${reason}"`);
		await this.modLoader.unload(Object.keys(this.modLoader.loadedModulesRegistry));
		this._discordClient.destroy();
	}
}
