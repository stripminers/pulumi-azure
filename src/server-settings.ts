// Copyright 2020 Chris Smith. All Rights Reserved.

import * as pulumi from "@pulumi/pulumi";

// getOptionalBoolean reads a boolean configuration setting, or if not
// specified the provided default.
function getOptionalBoolean(config: pulumi.Config, settingName: string, defaultValue: boolean): boolean {
    if (config.getBoolean(settingName) !== undefined) {
        return !!config.getBoolean("gamePublic");
    }
    return defaultValue;
}

// getServerSettings returns the file contents of Factorio's server-settings.json file,
// embedding the various settings from the provided configuration object.
export function getServerSettings(config: pulumi.Config): string {
    const gameName = config.get("gameName") || "Stripminers Factorio Server";;
    const gameDescription = config.get("gameDescription") || "Rockets don't launch themselves, yo!";
    const gamePassword = config.get("gamePassword") || "";

    const gamePublic = getOptionalBoolean(config, "gamePublic", false);
    const gameAutoPause = getOptionalBoolean(config, "gameAutoPause", true);

    const factorioLogin = config.get("factorioLogin") || "";
    const factorioPassword = config.get("factorioPassword") || "";

    // The schema for server-settings.json (and any changes between versions) can be found
    // at https://github.com/wube/factorio-data.
    const settings = {
        name: gameName,
        description: gameDescription,
        tags: ["stripminers", "pulumi"],
    
        // Maximum number of players allowed, admins can join even a full server. 0 means unlimited.
        max_players: 0,
    
        // public: Game will be published on the official Factorio matching server.
        // lan: Game will be broadcast on LAN.
        visibility: {
            public: gamePublic,
            lan: false
        },
    
        // Your factorio.com login credentials. Required for games with visibility public.
        username: factorioLogin,
        password: factorioPassword,
    
        // Authentication token. May be used instead of 'password' above.
        token: "",
    
        game_password: gamePassword,
    
        // When set to true, the server will only allow clients that have a valid Factorio.com account.
        require_user_verification: true,
    
        // optional, default value is 0. 0 means unlimited.
        max_upload_in_kilobytes_per_second: 0,
    
        // optional, default value is 5. 0 means unlimited.
        max_upload_slots: 5,
    
        // optional one tick is 16ms in default speed, default value is 0. 0 means no minimum.
        minimum_latency_in_ticks: 0,
    
        // Players that played on this map already can join even when the max player limit was reached.
        ignore_player_limit_for_returning_players: false,
    
        // possible values are, true, false and admins-only.
        allow_commands: "admins-only",
    
        // Autosave interval in minutes.
        autosave_interval: 10,
    
        // server autosave slots, it is cycled through when the server autosaves.,
        autosave_slots: 5,
    
        // How many minutes until someone is kicked when doing nothing, 0 for never.
        afk_autokick_interval: 0,
    
        // Whether should the server be paused when no players are present.
        auto_pause: gameAutoPause,
        only_admins_can_pause_the_game: true,
    
        // Whether autosaves should be saved only on server or also on all connected clients. Default is true.
        autosave_only_on_server: true,
    
        // Highly experimental feature, enable only at your own risk of losing your saves. On UNIX systems, server
        // will fork itself to create an autosave. Autosaving on connected Windows clients will be disabled
        // regardless of autosave_only_on_server option.
        non_blocking_saving: false,
    
        // Long network messages are split into segments that are sent over multiple ticks. Their
        // size depends on the number of peers currently connected. Increasing the segment size
        // will increase upload bandwidth requirement for the server and download bandwidth
        // requirement for clients. This setting only affects server outbound messages. Changing
        // these settings can have a negative impact on connection stability for some clients.
        minimum_segment_size: 25,
        minimum_segment_size_peer_count: 20,
        maximum_segment_size: 100,
        maximum_segment_size_peer_count: 10
    };

    return JSON.stringify(settings, null, "    ");
}