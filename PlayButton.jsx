const { React, getModule, getModuleByDisplayName } = require("powercord/webpack");
const { post } = require("powercord/http");

const { icon } = getModule(["icon", "isHeader"], false);
const Tooltip = getModuleByDisplayName("Tooltip", false);
const { Button } = getModule(m => m.default && m.default.displayName === "MiniPopover", false);

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
    <Tooltip color="black" position="top" text="Play On Spotify">
      {({ onMouseLeave, onMouseEnter }) => (
        <Button
          className={`playOnSpotifyButton`}
          onClick={() =>
            SpotifyApi.play(data)
              .then(() => notify(`Now playing ${title}`, description, thumb))
              .catch(err => {
                console.error("[PLAY-ON-SPOTIFY]", err);
                notify("Sorry", "Something went wrong. Make sure your spotify is running.");
              })
          }
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <svg x="0" y="0" aria-hidden="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class={icon}>
            <path d="m26.511 12.004-20.278-11.541c-2.151-1.228-4.344 0.115-4.344 2.53v24.093c0 2.046 1.332 2.979 2.57 2.979 0.583 0 1.177-0.184 1.767-0.543l20.369-12.468c1.024-0.629 1.599-1.56 1.581-2.555-0.017-0.996-0.623-1.906-1.665-2.495zm-1.281 2.823-20.368 12.465c-0.137 0.084-0.245 0.126-0.319 0.147-0.02-0.074-0.04-0.188-0.04-0.353v-24.092c0-0.248 0.045-0.373 0.045-0.404 0.08 5e-3 0.22 0.046 0.396 0.146l20.275 11.541c0.25 0.143 0.324 0.267 0.348 0.24-0.013 0.034-0.098 0.161-0.337 0.31z" />
          </svg>
        </Button>
      )}
    </Tooltip>
  );
};

module.exports.QueueButton = ({ uri, thumb, title, description }) => {
  return (
    <Tooltip color="black" position="top" text="Add To Queue">
      {({ onMouseLeave, onMouseEnter }) => (
        <Button
          className={`queueOnSpotifyButton`}
          onClick={() =>
            SpotifyApi.genericRequest(post(`${SPOTIFY_PLAYER_URL}/queue`).query("uri", uri), true)
              .then(() => notify(`Queued ${title}`, description, thumb))
              .catch(err => {
                console.error("[PLAY-ON-SPOTIFY]", err);
                notify("Sorry", "Something went wrong. Make sure your spotify is running");
              })
          }
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <svg x="0" y="0" aria-hidden="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class={icon}>
            <path d="m436.74 151.83c-13.152-26.976-35.744-42.08-57.6-56.704-16.288-10.912-31.648-21.216-42.528-35.968l-2.016-2.72c-6.4-8.608-13.696-18.368-14.816-26.56-0.096-0.672-0.48-1.216-0.672-1.888-0.288-1.12-0.608-2.176-1.12-3.2-0.384-0.832-0.928-1.568-1.504-2.336-0.672-0.864-1.312-1.696-2.144-2.4-0.8-0.704-1.664-1.184-2.56-1.728-0.832-0.48-1.6-0.928-2.528-1.248-1.12-0.416-2.272-0.576-3.488-0.704-0.608-0.032-1.12-0.32-1.76-0.32-0.384 0-0.704 0.192-1.056 0.224-0.384 0.032-0.736-0.128-1.12-0.064-0.704 0.096-1.248 0.48-1.92 0.672-1.088 0.288-2.112 0.576-3.072 1.088-0.896 0.448-1.664 1.024-2.432 1.664-0.832 0.64-1.632 1.28-2.304 2.08-0.672 0.768-1.152 1.6-1.664 2.464-0.512 0.896-0.992 1.76-1.344 2.752s-0.48 2.016-0.608 3.104c-0.16 0.64-0.48 1.28-0.48 2.016v285.12c-13.408-8.128-29.92-13.12-48-13.12-44.128 0-80 28.704-80 64s35.872 64 80 64 80-28.704 80-64v-186.5c24.032 9.184 63.36 32.576 74.176 87.2-2.016 2.976-3.936 6.208-6.176 8.736-5.856 6.624-5.184 16.736 1.44 22.56 3.04 2.688 6.816 4 10.56 4 4.448 0 8.832-1.856 12-5.44 4.256-4.832 8.064-10.56 11.712-16.448 0.416-0.512 0.736-0.992 1.088-1.536 12.928-21.632 21.504-48.992 23.136-76.032 1.056-17.376-2.816-35.616-11.2-52.768zm-196.74 248.22c-26.016 0-48-14.656-48-32s21.984-32 48-32 48 14.656 48 32-21.984 32-48 32zm176.03-197.47c-0.448 7.488-1.6 14.976-3.232 22.304-22.496-45.152-63.296-68.672-92.8-77.376v-58.784c12.544 13.376 27.104 23.392 41.376 32.928 19.168 12.832 37.28 24.96 46.656 44.192 5.888 12 8.704 25.088 8 36.736z" />
            <path d="m208 16.053h-192c-8.832 0-16 7.168-16 16s7.168 16 16 16h192c8.832 0 16-7.168 16-16s-7.168-16-16-16z" />
            <path d="m208 112.05h-192c-8.832 0-16 7.168-16 16s7.168 16 16 16h192c8.832 0 16-7.168 16-16s-7.168-16-16-16z" />
            <path d="m112 208.05h-96c-8.832 0-16 7.168-16 16s7.168 16 16 16h96c8.832 0 16-7.168 16-16s-7.168-16-16-16z" />
            <path d="m112 304.05h-96c-8.832 0-16 7.168-16 16s7.168 16 16 16h96c8.832 0 16-7.168 16-16s-7.168-16-16-16z" />
          </svg>
        </Button>
      )}
    </Tooltip>
  );
};
