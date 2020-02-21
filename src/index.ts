// Copyright 2020 Chris Smith. All Rights Reserved.

import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import * as azure from "@pulumi/azure";

import * as fs from "fs";
import * as path from "path";

import * as serverSettings from "./server-settings";


const stackName = pulumi.getStack();
const config = new pulumi.Config();

const resourceGroup = new azure.core.ResourceGroup(`factorio-${stackName}`);

// Create an Azure Container Registry resource. We could alternatively post our
// container to Docker Hub, but this way secrets stored in the container's
// JSON files aren't publicly visible.
const registry = new azure.containerservice.Registry("registry", {
    sku: "basic",
    adminEnabled: true,

    resourceGroupName: resourceGroup.name,
});

// Container with the game server, with of our configuration data baked in.
// For the build we copy all of the settings files from configuration as appropriate...
// but then... delete them afterwards.
//
// NOTE: We aren't calling the cleanup function to delete the files...
serverSettings.writeSettingsFiles(config, "./container/config");

let factorioGameImage = new docker.Image("factorio-game", {
    imageName: pulumi.interpolate`${registry.loginServer}/factorio-game:latest`,
    build: {
        context: "./container",
    },
    registry: {
        server: registry.loginServer,
        username: registry.adminUsername,
        password: registry.adminPassword,
    },
});

// Actually run the container image on Azure.
const containerImage = new azure.containerservice.Group("factorio-server", {
    containers: [{
        name: "factorio",

        image: factorioGameImage.imageName,

        // Machine resources.
        memory: 1,
        cpu: 1,

        // Ports to expose.
        ports: [
            // Game server (required).
            {
                port: 34197,
                protocol: "UDP",
            },
            // RCON for remote management (optional).
            {
                port: 27015,
                protocol: "TCP"
            }
        ],
    }],

    // Provide credentials to fetch the image from our container repository.
    imageRegistryCredentials: [
        {
            server: registry.loginServer,
            username: registry.adminUsername,
            password: registry.adminPassword,
        }
    ],

    ipAddressType: "public",
    osType: "linux",

    dnsNameLabel: `factorio-${pulumi.getStack()}`,

    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
}, {
    // Since the DNS label / FQDN are in a global namespace,
    // we need to delete the older instance before we can recreate
    // it (which will happen for most updates.)
    deleteBeforeReplace: true,
});

// Export a "publicIP" output property from the Pulumi stack, which contains
// the IP address of the container instance running on Azure.
exports.publicIP = containerImage.ipAddress;

// Fully-qualified domain name, in case you want to reach it via a friendly
// URI.
exports.fqdn = containerImage.fqdn;

// Command to get the container's logs, which will help to troubleshoot any problems.
exports.logsCommand =
    pulumi.interpolate `az container logs --resource-group ${resourceGroup.name} --name ${containerImage.name}`;
