import {youtubedl, youtubedlv2} from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'youtube-yts';
import ytdl from 'youtubedl-core';
import axios from 'axios';
import {bestFormat, getUrlDl} from '../lib/y2dl.js';
const handler = async (m, {conn, args, usedPrefix, command}) => {
  if (!args[0]) throw '*🪩Please enter a link / YouTube link.*';
  let enviando;
  if (enviando) return  
      enviando = true    
  let youtubeLink = '';
  if (args[0].includes('you')) {
    youtubeLink = args[0];
  } else {
    const index = parseInt(args[0]) - 1;
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find((item) => item.from === m.sender);
        if (matchingItem) {
          if (index < matchingItem.urls.length) {
            youtubeLink = matchingItem.urls[index];
          } else {
            enviando = false  
            throw `*[❗] A link was not found for that number, please enter a number between 1 and 1. ${matchingItem.urls.length}*`;
          }
        } else {
          enviando = false  
          throw `*[❗] To be able to make use of the command in this way (${usedPrefix + command} <numero>), please search for videos with the ${usedPrefix}playlist <texto>*`;
        }
      } else {
        enviando = false  
        throw `*[❗] To be able to make use of the command in this way (${usedPrefix + command} <numero>), Please perform the video search with the ${usedPrefix}playlist <texto>*`;
      }
    }
  }
  const { key } = await m.reply(`*♻️Getting your video..._*`);
  try {
    const formats = await bestFormat(youtubeLink, 'video');
    const buff = await getBuffer(formats.url);
    const yt_1 = await youtubedl(youtubeLink).catch(async (_) => await youtubedlv2(youtubeLink));
    const ttl_1 = `${yt_1?.title ? yt_1.title : 'Downloaded video'}`;
    const fileSizeInBytes = buff.byteLength;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
   if (fileSizeInMB > 100) {
    await conn.sendMessage(m.chat, {document: buff, caption: `*🪩Title:* ${ttl_1}\n*🪩Size:* ${roundedFileSizeInMB} MB`, fileName: ttl_1 + '.mp4', mimetype: 'video/mp4'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `*[ ✅ ] Video downloaded and sent successfully🛡️.*\n\n*—◉ It was sent in document format due to the weight of the video ${roundedFileSizeInMB} MB and exceeds the limit set by WhatsApp .*\n*◉ Titulo:* ${ttl_1}`, edit: key}, {quoted: m});
    enviando = false
   } else {
    await conn.sendMessage(m.chat, {video: buff, caption: `*🪩Title:* ${ttl_1}\n*🪩Size:* ${roundedFileSizeInMB} MB`, fileName: ttl_1 + '.mp4', mimetype: 'video/mp4'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `*[ ✅ ] Video successfully downloaded.*`, edit: key}, {quoted: m});
    enviando = false   
   }
 } catch (ee) {
    console.log(ee)
  try {
    const qu = args[1] || '360';
    const q = qu + 'p';
    const v = youtubeLink;
    const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
    const dl_url = yt.video[q].download();
    const ttl = yt.title;
    const size = yt.video[q].fileSizeH;
    await conn.sendMessage(m.chat, {video: {url: dl_url}, fileName: `${ttl}.mp4`, mimetype: 'video/mp4', caption: `*🪩Title:* ${ttl}\n*🪩Size:* ${size}`, thumbnail: await fetch(yt.thumbnail)}, {quoted: m});
    await conn.sendMessage(m.chat, {text: '*[ ✅ ] Video descargado exitosamente.*', edit: key}, {quoted: m});
    enviando = false
  } catch (ee2) {
    console.log(ee2)
    try {
      const mediaa = await ytMp4(youtubeLink);
      await conn.sendMessage(m.chat, {video: {url: mediaa.result}, fileName: `error.mp4`, caption: `_𝐓𝐡𝐞 AMIR - 𝐁𝐨𝐭_`, thumbnail: mediaa.thumb, mimetype: 'video/mp4'}, {quoted: m});
      await conn.sendMessage(m.chat, {text: '*[ ✅ ] Video successfully downloaded.*', edit: key}, {quoted: m});
      enviando = false
    } catch {
      try {
        const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${youtubeLink}`);
        const lolh = await lolhuman.json();
        const n = lolh.result.title || 'error';
        const n2 = lolh.result.link;
        const n3 = lolh.result.size;
        const n4 = lolh.result.thumbnail;
        await conn.sendMessage(m.chat, {video: {url: n2}, fileName: `${n}.mp4`, mimetype: 'video/mp4', caption: `*🪩Title:* ${n}\n*🪩Size:* ${n3}`, thumbnail: await fetch(n4)}, {quoted: m});
        await conn.sendMessage(m.chat, {text: '*[ ✔ ] Video descargado exitosamente.*', edit: key}, {quoted: m});
        enviando = false
      } catch {
        await conn.sendMessage(m.chat, {text: `*[ ❌ ] The video could not be downloaded or sent, please try again.*`, edit: key}, {quoted: m});
        throw '*[❗] Error, It was not possible to download the video.*';
      }
    }
  }
}};
handler.command = /^(fgmp4|dlmp4|getvid|yt(v|mp4)?)$/i;
handler. tags = ['downloader'];
export default handler;

function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
  });
}

async function ytMp3(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
          const {contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {audio: item.url, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.audio != undefined && x.size != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, result2: resultFix, thumb});
    }).catch(reject);
  });
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          const {qualityLabel, contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {video: item.url, quality: qualityLabel, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.video != undefined && x.size != undefined && x.quality != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, rersult2: resultFix[0].video, thumb});
    }).catch(reject);
  });
}

async function ytPlay(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getAudio = await ytMp3(random);
      resolve(getAudio);
    }).catch(reject);
  });
}

async function ytPlayVid(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getVideo = await ytMp4(random);
      resolve(getVideo);
    }).catch(reject);
  });
}

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });

    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
	
