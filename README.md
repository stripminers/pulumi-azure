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

Documentation of sorts here:
https://wiki.factorio.com/Multiplayer


... can I just specify this manually somehow? e.g. --bind <IPADDRESS>:<PORT>?


   3.147 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong1)
   3.182 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong4)
   3.216 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong2)

...

publicIP   : "13.88.133.46"

1.593 Info ServerRouter.cpp:497: Own address is IP ADDR:({40.118.246.29:3136}) (confirmed by pingpong1)
1.628 Info ServerRouter.cpp:497: Own address is IP ADDR:({40.118.246.29:3136}) (confirmed by pingpong4)
1.678 Info ServerRouter.cpp:497: Own address is IP ADDR:({40.118.246.29:3136}) (confirmed by pingpong2)

Maybe try to start it, update env var with IP address, and then restart?

https://docs.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy

PORT=34197
export PORT="34197 --bind 13.86.188.74 "

... did not work.

This was full output with added --bind.

exec su-exec factorio /opt/factorio/bin/x64/factorio --port 34197 --bind 13.86.188.74 --server-settings /factorio/config/server-settings.json --server-banlist /factorio/config/server-banlist.json --rcon-port 27015 --server-whitelist /factorio/config/server-whitelist.json --use-server-whitelist --server-adminlist /factorio/config/server-adminlist.json --rcon-password asdf --server-id /factorio/config/server-id.json --start-server-load-latest


I am trying to host a Factorio game on the cloud, and having some networking problems. I think I
understand what the root cause is, but wanted to double check my understanding and ask a few
questions.

## Symptoms

I have my Factorio server running on the cloud (specifically using an Azure Container Instance) and
generally things are working.

- I can join a game by connecting directly to the instance's IP address.
- The game appears in the "Browser public games" list.

The problem is that I cannot actually connect from the public games listing. Moreover, the "ping"
value never changes from "calculating". (But again, if I connect directly via IP address it works
fine.)

## The Problem (I Think)

My understanding is that the root problem is that my server isn't performing "port forwarding".

When Factorio starts up, it sends a request to pingpong1.factorio.com and friends in order to
figure out the server's IP address. ([FF #143](https://factorio.com/blog/post/fff-143))

Here's a snippet from the Factorio logs, which prints that the supposed IP address for the server
is `104.42.20.63:8194`. However, that isn't the case.

```
   3.147 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong1)
   3.182 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong4)
   3.216 Info ServerRouter.cpp:497: Own address is IP ADDR:({104.42.20.63:8194}) (confirmed by pingpong2)
```

I _can_ connect to the server however if I connect to a different IP address, e.g. `13.86.188.74` (on
which I've opened up the default `34197` port for UDP traffic.)

## Questions

So correct me if I am wrong here, but here's what is going on.

The "actual" or "real" IP address and port that Factorio is running on is (in this example) `104.42.20.63:8194`.
(As was reported by pingpong*.factorio.com.)

But Factorio, when trying to contact the server from the "Browser public games" view cannot contact
my server at that IP address and port.

However, if I use that _other_ IP address `13.86.188.74` it works, because whatever router that is
listening to that particular IP address will take care of routing the "public" IP address (`13.86.188.74`)
to the "private" IP address within the network (`104.42.20.63:8194`)... and that is referred to as
_Network Address Translation_.

Do I have that right?

If so, then second question, is there any way I can fix this? I noticed there are `--bind` and `--port`
flags that I can pass to Factorio. I've done a little experimentation, and it doesn't look like passing
`--bind 13.86.188.74 --port 34197` will work. (But should it?)

Anyways, I'm not looking for a specific answer since it's specific to the cloud provider I'm using, etc.
But any insight or clarification of what the specific issue here is would be super-helpful. Thanks!


https://github.com/gtaylor/factorio-rcon

https://wiki.factorio.com/Console#Multiplayer_commands

https://www.reddit.com/r/factorio/comments/4qchhv/013_list_of_helpful_console_commands/

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

## Bugs

### Cannot Connect via Hosted Servers List

https://factorio.com/blog/post/fff-143

The way Factorio determines the server's IP address is coming up with
the wrong result. This is likely specific to Azure Container Instances,
and NAT somehow.

ACI does not support "port forwarding", but that shouldn't be necessary.
We expose the same ports that are exposed from the container image. So
this should not be a problem.
https://docs.microsoft.com/bs-latn-ba/azure/container-instances/container-instances-troubleshooting#container-group-ip-address-may-not-be-accessible-due-to-mismatched-ports

Perhaps this Factorio Forums post can provide more information:
https://forums.factorio.com/viewtopic.php?f=49&t=73540&p=444143

The response was:
> Because your server contacted the pingpong servers with a different port that is not forwarded.

Or another thing...
> If you setup port forwarding, this creates DNAT, but since first packet is outgoing it may not be linked with DNAT rule in firewall (not incoming, not related). This creates temporary > SNAT rule for contacting pingpong server and this is why external port is different. This may need to be tested thoroughly. Maybe solution would be for pingpong server to send response > to two ports: one related to ip:port from incoming request and one to ip of incoming request but using port explicitly pointed by host contacting pingpong

https://forums.factorio.com/viewtopic.php?f=7&t=62792#p443290

https://docs.microsoft.com/en-us/azure/container-instances/container-instances-container-groups#networking

> To enable external clients to reach a container within the group, you must expose the port on the IP address and from the container. Because containers within the group share a port namespace, port mapping isn't supported.

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

