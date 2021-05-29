/* PlayOnSpotify, a powercord plugin to more easily play music on spotify
 * Copyright (C) 2021 Vendicated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { getModule, React } = require("powercord/webpack");
const { findInReactTree } = require("powercord/util");
const { isSpotifyPremium } = getModule(["isSpotifyPremium"], false);

const { QueueButton, PlayButton } = require("./PlayButton");

const MiniPopover = getModule(m => m.default?.displayName === "MiniPopover", false);

module.exports = class PlayOnSpotify extends Plugin {
  startPlugin() {
    inject("playInSpotify", MiniPopover, "default", (_, res) => {
      if (!isSpotifyPremium) return res;

      const msg = findInReactTree(res, r => r && r.message)?.message;
      if (!msg) return res;

      const embed = msg.embeds.find(e => e.provider?.name === "Spotify");

      if (!embed) return res;

      const {
        url,
        thumbnail: { proxyURL: thumb },
        rawDescription: description,
        rawTitle: title
      } = embed;

      const [, , type, id] = url.match(/(https?:\/\/)?open.spotify.com\/(album|track|playlist)\/([^?]+)/) ?? [];
      if (!type || !id) return res;

      const uri = `spotify:${type}:${id}`;

      if (type === "track")
        res.props.children.unshift(
          React.createElement(QueueButton, {
            uri,
            thumb,
            title,
            description
          })
        );

      res.props.children.unshift(
        React.createElement(PlayButton, {
          data: type === "track" ? { uris: [uri] } : { context_uri: uri },
          thumb,
          title,
          description
        })
      );

      return res;
    });
    MiniPopover.default.displayName = "MiniPopover";
  }

  pluginWillUnload() {
    uninject("playInSpotify");
  }
};
