# Host a Factorio Server on Azure using Pulumi

This project contains a Pulumi program for standing up a Factorio server on Microsoft Azure.

## Overview

The Pulumi stack will stand up the necessary infrastructure for hosting the Factorio server
on Azure. (Using Azure Container Instances...)

The Pulumi stack's configuration will allow you to manage the games settings, without needing
to edit configuration files or modify the underlying container.

> This repository contains the Pulumi program parts, but most credit should go to the kind
> folks at https://github.com/factoriotools/, who maintain the Docker container for hosting
> factorio.

## Quickstart

Standup the Pulumi Stack / Infrastructure.

```zsh
# First, configure the Azure SDK locally. You can sanity check this via:
$ az account show

# Create the Pulumi stack.
$ pulumi stack init seablock

# Configure the game's settings.
pulumi config set gameName "Stripminers Factorio Server - Seablock"
pulumi config set gameDescription "rockets don't launch themselves, yo"

# To specify a password for the hosted game. (Optional)
pulumi config set gamePassword "mine-it-all!"

# To publish your game on the official Factorio matching server, you'll need
# to specify your factorio.com login credentials.
pulumi config set gamePublic true
pulumi config set factorioLogin <factorio-login>
pulumi config set factorioPassword hunter2 --secret
```

Connect to your server!

Download Factorio https://factorio.com/download/

Start Factorio
- Multiplayer
- Connect to address, enter `publicIP` output property
- Connect to cloud-hosted game!

To configure map generation settings, mods, etc. read on...


## Configuration

The Pulumi program exposes a lot of configuration knobs so that you can easily
configure your Factorio game instance using Pulumi configuration, without needing
to duplicate data and files...

```
pulumi config set 
```

### Remote Control

RCON protocol, setup, and meaning.

### Map Generation

...

### Mods

...

## Appendix

### Pulumi Configuration Settings

### Costs

