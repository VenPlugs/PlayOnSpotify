const { getAccounts } = require("powercord/webpack").getModule(["getAccounts"], false);

const BASE_URL = "https://api.spotify.com/v1/me/player";

class SpotifyError extends Error {}

function getToken() {
    return getAccounts().find((a) => a.type === "spotify")?.accessToken;
}

function request(endpoint, method, data) {
    const token = getToken();
    if (!token)
        return Promise.reject(
            new SpotifyError(
                "Spotify Token could not be retrieved. Please link your Spotify to Discord in Settings > Connections"
            )
        );

    return fetch(BASE_URL + endpoint, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(async (r) => {
        if (r.ok) return r;
        switch (r.status) {
            case 401:
            case 403:
                throw new SpotifyError("Unauthorized. Try relinking your Spotify");
            case 404:
                throw new SpotifyError("No player found. Do you have Spotify running?");
            case 429:
                throw new SpotifyError("Chill!!!! You're clicking the button too damn much D:");
            default:
                if (r.status >= 500) throw new SpotifyError("Wow, Spotify is having server issues O_o Try again later");
                console.error(`[PlayOnSpotify] ${r.status}: ${r.statusText} - ${await r.text()}`);
                throw new SpotifyError("Unknown Error. Check the console");
        }
    });
}

function play(data) {
    return request("/play", "PUT", data);
}

function queue(uri) {
    return request(`/queue?uri=${encodeURIComponent(uri)}`, "POST", void 0);
}

module.exports = {
    play,
    queue,
    SpotifyError
};
