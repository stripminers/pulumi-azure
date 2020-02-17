FROM factoriotools/factorio:latest

COPY config/ /factorio/config/
COPY /entrypoint.sh /entrypoint.sh

# Verify the files...
RUN if [ ! -f /factorio/config/server-settings.json ]; then echo "ERROR: server-settings.json not found."; false; fi

ENTRYPOINT ["/entrypoint.sh"]
