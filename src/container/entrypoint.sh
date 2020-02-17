#!/bin/bash
# Bootstrap the container instance.

echo "==== Factorio Server ===="

echo "SERVER_SETTINGS_JSON env var:"
echo ""
echo ${SERVER_SETTINGS_JSON}
echo ""

echo "Server Settings:"
ls -al /factorio/config/server-settings.json
echo ""
cat /factorio/config/server-settings.json
echo ""

echo ""
echo "Starting game..."
echo ""

echo "BEFORE..."
cat /factorio/config/before.json
echo "AFTER..."
cat /factorio/config/after.json


# Launch the game.
/docker-entrypoint.sh
