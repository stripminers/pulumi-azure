#!/bin/bash
# Bootstrap the container instance.

echo "==== Factorio Server ===="

if [ -z ${ACI_IP_ADDRESS:-} ]; then
	

    echo "Environment Variable ACI_IP_ADDRESS not set."
    echo "Refusing to start until it is."
        
    # Loop indefinitely.
    while true; do printf "."; sleep 60; done
fi

# Launch the game.
/docker-entrypoint.sh
