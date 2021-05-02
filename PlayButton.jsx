const { React, getModule } = require("powercord/webpack");
const { post } = require("powercord/http");

const { icon } = getModule(["icon", "isHeader"], false);
const { button } = getModule(["button", "separator", "wrapper"], false);
// teehee
const SpotifyApi = require("../pc-spotify/SpotifyAPI");
const { SPOTIFY_PLAYER_URL } = require("../pc-spotify/constants");

function notify(header, content, image) {
  powercord.api.notices.sendToast("playOnSpotify", {
    header,
    content,
    image,
    type: "info",
    timeout: 3000
  });
}

module.exports.PlayButton = ({ data, thumb, title, description }) => {
  return (
    <div className={button}>
      <img
        className={`emoji ${icon}`}
        src="/assets/9fa9d42fbc4405fdca021e2fe9e5c4e2.svg"
        onClick={() =>
          SpotifyApi.play(data)
            .then(() => notify(`Now playing ${title}`, description, thumb))
            .catch(err => {
              console.error("[PLAY-ON-SPOTIFY]", err);
              notify("Sorry", "Something went wrong. Check the console for more info");
            })
        }
      />
    </div>
  );
};

module.exports.QueueButton = ({ uri, thumb, title, description }) => {
  return (
    <div className={button}>
      <img
        className={`emoji ${icon}`}
        src="/assets/9a43e631d506ae4818ecefc825dc02ad.svg"
        onClick={() =>
          SpotifyApi.genericRequest(post(`${SPOTIFY_PLAYER_URL}/queue`).query("uri", uri), true)
            .then(() => notify(`Queued ${title}`, description, thumb))
            .catch(err => {
              console.error("[PLAY-ON-SPOTIFY]", err);
              notify("Sorry", "Something went wrong. Check the console for more info");
            })
        }
      />
    </div>
  );
};
