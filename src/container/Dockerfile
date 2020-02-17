
FROM factoriotools/factorio:latest

# The SERVER_SETTINGS_JSON build argument containts the entire contents of
# the server-settings.json file, which we write at build-time.
ARG SERVER_SETTINGS_JSON=
ENV SERVER_SETTINGS_JSON=$SERVER_SETTINGS_JSON
RUN test -n "$SERVER_SETTINGS_JSON" || (echo "SERVER_SETTINGS_JSON  not set" && false)


COPY config/ /factorio/config/
COPY /entrypoint.sh /entrypoint.sh

RUN envsubst < /factorio/config/server-settings.json > /factorio/config/server-settings.json

ENTRYPOINT ["/entrypoint.sh"]
