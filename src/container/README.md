# Factorio Server Settings

# The base Factorio server container image can found at:
# https://hub.docker.com/r/factoriotools/factorio/
# Source: https://github.com/factoriotools
#
# We just add on our own configuration files to customize
# the game's settings, mods, etc.
#
# To see

https://github.com/wube/factorio-data

# Use the latest, experimental build.

https://github.com/wube/factorio-data

docker build ./container -t test-build && docker run test-build


docker build \
     --build-arg SERVER_SETTINGS_JSON="${SERVER_SETTINGS_JSON}" \
     --tag test-build ./container

docker run -t test-build
