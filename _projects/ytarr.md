---
title: ytarr
description: A node app that emulates the qBittorrent client for Lidarr to allow for yt-dlp downloads
hidden: false
tags:
- JavaScript
- Node.js
- Express
---

# Introduction

ytarr emulates endpoints of the qBittorrent client to make it possible for Lidarr to hand off downloads to my custom downloader.

My downloader uses yt-dlp, but this can be switched out later on if there is a better alternative.

For a more detailed explanation on how to download and setup ytarr, check the [README](https://github.com/ferrondw/ytarr/blob/main/README.md)

# Client and Indexer

Using the official [Torznab spec](https://torznab.github.io/spec-1.3-draft/torznab/Specification-v1.3.html) and [qBittorrent WebUI API docs](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)) I made all endpoints to make Lidarr succeed both the Download Client and Indexer checks, I did seperately from making the downloader so I could figure out how it all worked.

You can look at the complete implementation in GitHub, both for the [client](https://github.com/ferrondw/ytarr/blob/main/src/bittorrent/client.js) and for the [indexer](https://github.com/ferrondw/ytarr/blob/main/src/bittorrent/indexer.js). 

# Downloader

In my own workspace, I have yt-dlp installed on PATH. In ytarr I use this by just calling yt-dlp as a subprocess, and awaiting the download until the process exists.

```javascript
await execFileAsync(
    "yt-dlp",
    [
        "--js-runtimes", "node",
        "-x",
        "-o", downloadPath,
        "-N", "4",
        "--audio-format", "mp3",
        "--no-keep-video",
        "--no-playlist",
        `https://www.youtube.com/watch?v=${song.videoId}`
    ]
);
```

Afterwards, with all the metdata from the YTMusicAPI, ID3 tags are embedded in every song of the album.

```javascript
const tags = {
    title: song.name,
    album: job.ytarr.album.name,
    ...
}

Constants.NodeID3.write(tags, filePath);
```

# Album Covers

YouTube Music compresses and scales cover images by default, below is an example of Haken's album 'Vector'. First my updated uncompressed version, then the default compressed version, and lastly the difference between the two

![Cover difference](/assets/images/projects/ytarr/cover-difference.png)

On the right, i inverted the lower quality image and set it's opacity to 50%, everything that is not grey is the difference between the 2 images. But you cannot see it that well, so here is a zoomed in version

![Cover difference](/assets/images/projects/ytarr/cover-difference-zoomed.png)