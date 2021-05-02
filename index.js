/* PlayOnSpotify, a powercord plugin to more easily play music on spotify
 * Copyright (C) 2021 Vendicated
 *
 * PlayOnSpotify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PlayOnSpotify is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with PlayOnSpotify.  If not, see <https://www.gnu.org/licenses/>.
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

      const msg = findInReactTree(res, r => r && r.message && r.setPopout)?.message;
      if (!msg) return res;

      const embed = msg.embeds.find(e => e.provider?.name === "Spotify");

      if (!embed) return res;

      const {
        url,
        thumbnail: { proxyURL: thumb },
        rawDescription: description,
        rawTitle: title
      } = embed;

      console.log(embed);
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
