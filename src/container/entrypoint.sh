#!/bin/bash
# Simple bootstrapping script that just prints a 

echo "==== Factorio Server ===="
echo ""

echo "Environment Variables:"
echo ""
env | sort
echo ""


echo "Server Settings:"
echo ""
cat /factorio/config/server-settings.json
echo ""


echo "envsubst..."
echo ""
envsubst < /factorio/config/server-settings.json
echo ""

echo "Starting Game:"
echo ""
/docker-entrypoint.sh
