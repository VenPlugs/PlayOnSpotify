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
        src="https://raw.githubusercontent.com/Vendicated/PowercordPlayOnSpotify/icons/play.svg"
        onClick={() =>
          SpotifyApi.play(data)
            .then(() => notify(`Now playing ${title}`, description, thumb))
            .catch(err => {
              console.error("[PLAY-ON-SPOTIFY]", err);
              notify("Sorry", "Something went wrong. Make sure your spotify is running.);
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
        src="https://raw.githubusercontent.com/Vendicated/PowercordPlayOnSpotify/icons/queue.svg"
        onClick={() =>
          SpotifyApi.genericRequest(post(`${SPOTIFY_PLAYER_URL}/queue`).query("uri", uri), true)
            .then(() => notify(`Queued ${title}`, description, thumb))
            .catch(err => {
              console.error("[PLAY-ON-SPOTIFY]", err);
              notify("Sorry", "Something went wrong. Make sure your spotify is running");
            })
        }
      />
    </div>
  );
};
