import { getDB } from "./db";
import { Guild } from "discord.js";
import { getLogger } from "./utils";

interface IGuildPreference {
    /**
     * Guild ID
     */
    guildId:string;
    /**
     * Preference (key)
     */
    preference:string;
    /**
     * Value for preference, e.g. 'language'='ru'
     */
    value:string;
}

let initDone = false;

const LOG = getLogger("Preferences");
const DB = getDB();
const TABLE_NAME = "guild_prefs";

/// ======================================
/// DB FUNCTIONS
/// ======================================

async function createPreference(guild:Guild, preference:string, value:string) {
    if(!initDone) { await init(); }
    return await DB(TABLE_NAME).insert({
        guildId: guild.id,
        preference, value
    });
}

export async function getPreferenceRow(guild:Guild, preference:string) : Promise<IGuildPreference> {
    if(!initDone) { await init(); }
    return await DB(TABLE_NAME).where({
        guildId: guild.id,
        preference
    }).first();
}

async function updatePreferenceRow(row:IGuildPreference) {
    if(!initDone) { await init(); }
    return await DB(TABLE_NAME).where({
        guildId: row.guildId,
        preference: row.preference
    }).update(row);
}

/// ======================================
/// FOR GLOBAL USAGE
/// ======================================

export async function init() : Promise<boolean> {
    if(initDone) { return true; }
    try {
        if(!(await DB.schema.hasTable(TABLE_NAME))) {
            try {
                LOG("info", "Creating table");
                await DB.schema.createTable(TABLE_NAME, (tb) => {
                    tb.string("guildId").notNullable();
                    tb.string("preference").notNullable();
                    tb.string("value").notNullable().defaultTo("{}");
                });
            } catch (err) {
                LOG("err", "Can't create table", err);
                return false;
            }
        } else {
            LOG("ok", "Table found");
        }
    } catch (err) {
        LOG("err", "Can't check table status", err);
        return false;
    }

    initDone = true;
    return true;
}

export async function removePreference(guild:Guild, preference:string) {
    if(!initDone) { await init(); }
    await DB(TABLE_NAME).where({
        guildId: guild.id,
        preference
    }).delete();
}

export async function getPreferenceValue(guild:Guild, preference:string, json = false) {
    if(!initDone) { await init(); }
    let r = (await getPreferenceRow(guild, preference));
    let v = r ? r.value : undefined;
    return json && v ? JSON.parse(v) : v;
}

export async function setPreferenceValue(guild:Guild, preference:string, value:any) {
    if(!initDone) { await init(); }
    let cr = await getPreferenceRow(guild, preference);
    let twv = typeof value === "string" ? value : JSON.stringify(value);
    if(!cr) {
        await createPreference(guild, preference, twv);
    } else {
        cr.value = twv;
        await updatePreferenceRow(cr);
    }
}