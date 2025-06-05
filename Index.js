
require("./dono/dono.js")
const { 
default: makeWASocket, 
makeInMemoryStore,
makeCacheableSignalKeyStore,
MediaType,  WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,  useMultiFileAuthState, BufferJSON,  WAMessageProto,  MessageOptions,	 WAFlag,  WANode,	 WAMetric,	 ChatModification,  MessageTypeProto,  WALocationMessage, ReconnectMode,  WAContextInfo,  proto,	 WAGroupMetadata,  ProxyAgent,	 waChatKey,  MimetypeMap,  MediaPathMap,  WAContactMessage,  WAContactsArrayMessage,  WAGroupInviteMessage,  WATextMessage,  WAMessageContent,  WAMessage,  BaileysError,  WA_MESSAGE_STATUS_TYPE,  MediaConnInfo,   generateWAMessageContent, URL_REGEX,  Contact, WAUrlInfo,  WA_DEFAULT_EPHEMERAL,  WAMediaUpload,  mentionedJid,  processTime,	 Browser,  MessageType,  Presence,  WA_MESSAGE_STUB_TYPES,  Mimetype,  relayWAMessage,	 Browsers,  GroupSettingChange,  delay,  DisconnectReason,  WASocket,  getStream,  WAProto,  isBaileys,  AnyMessageContent,  generateWAMessageFromContent, fetchLatestBaileysVersion,  processMessage,  processingMutex
} = require('@whiskeysockets/baileys');
let pino = require('pino')
const fs = require('fs')
const axios = require('axios');
const PhoneNumber = require('awesome-phonenumber')
const cfonts = require('cfonts')
const NodeCache = require('node-cache')
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require("child_process")
const moment = require('moment-timezone');
const readline = require('readline')

//mensagens do bot
var resposta = {
      espere: "agrade um momento...."
    }
    resposta = {
      espere: " 🕙 ️ *AGUARDE JA ESTOU ENVIANDO* ",
      aguarde: " 🕙️  *AGUARDE JA ESTOU ENVIANDO* ",
      dono: "️🔒 *APENAS MEU DONOTEM ACESSO A ESSE COMANDO 🤦🏻‍♀️* ",
      grupo: "✨️ *SO PODE SER UTILIZANDOEM GRUPOS* ✨️ ",
      premium: "🥂 *APENAS USUARIO VIP* 🥂",
      privado: " 😛 *SO EM PRIVADO, FOI MAL >_<* ",
      adm: " ⚠️️*COMANDO APENAS PARA ADMINISTRADORES*",
      botadm: " *presciso ser adm 🥺* ",
      erro: " 🚫 ️ *OCORREU UM ERRO INESPERADO* 🚫",
      menu: "aaaaa"
     
    }
//fim fim 


// const de menu
const { menu } = require('./dono/menus.js')
const { menuadm } = require('./dono/menus.js')
const { menu18 } = require('./dono/menus.js')
const { menudono } = require('./dono/menus.js')
const { menubrincadeiras } = require('./dono/menus.js')
const { menupesquisa } = require('./dono/menus.js')
const { menusticker } = require('./dono/menus.js')
const { menuvip } = require('./dono/menus.js')
const { menulogos } = require('./dono/menus.js')
const { menuaudios } = require('./dono/menus.js')
const { menurpg } = require('./dono/menus.js')
//fim

//sla 
const SANDRO_MD = "sandrobot"
const SAFIRA_PRIVACY = "safira"
//fim

////
const { getRandom } = require('./arquivos/funções/myfunc.js');
const { fetchJson } = require('./arquivos/funções.js');
const { getBuffer, getGroupAdmins,} = require('./database/myfunc')
//fi.

/////mexa em nada
const { 
getExtension, Random, 
getFileBuffer,
} = require("./arquivos/browser/get.js")
donoName = global.donoName
botName = global.botName
donoNumber = global.donoNumber
prefix = global.prefix
/////fim

//hora
data = moment.tz("America/Sao_Paulo").format("DD/MM/YY");
hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
//fim

//conexão 
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };

const msgRetryCounterCache = new NodeCache();
const { AdicionarGold, RemoverGold } = require("./arquivos/js/dinheiro.js")


async function ligarbot() {
let phoneNumber = "553172595934"
const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) })
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))



const { state, saveCreds } = await useMultiFileAuthState('./database/qr-code')
const { version, isLatest} = await fetchLatestBaileysVersion();

const sandro = makeWASocket({
  logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
      mobile: useMobile,
      browser: ['Chrome (Linux)'],
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
   })
//==========================================\\

if (pairingCode && !sandro.authState.creds.registered) {
console.log(`${chalk.redBright("Coloque o número de whatsapp. Exemplo: +553172595934")}:`);
let phoneNumber = await question(`   ${chalk.cyan("- Número")}: `);
phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

let code = await sandro.requestPairingCode(phoneNumber);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(` 🥶 ${chalk.redBright("Seu código")}:`);
console.log(`   ${chalk.cyan("- Código")}: ${code}`);
rl.close();
}


const banner = cfonts.render(("SAFIRA|PRIVACY"), {
font: "simple",
align: "center",
colors: [`yellow`,`white`,`yellow`],
})

sandro.ev.on('creds.update', saveCreds);
store.bind(sandro.ev)
sandro.ev.on("chats.set", () => {
console.log("Tem conversas", store.chats.all())
})
sandro.ev.on("contacts.set", () => {
console.log("Tem contatos", Object.values(store.contacts))
})
sandro.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update
if(connection === "close") {
const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
console.log("Conexão fechada devido a", lastDisconnect.error, "Tentando reconectar...", shouldReconnect);
if(shouldReconnect) {
startsandro()
}
} else if(connection === "open") {
console.log(banner.string)
console.log(`${color(`${botName} Conectado com sucesso ✓ `,'green')}`)
}
})


sandro.ev.on('chats.set', () => {
console.log('setando conversas...')
})


sandro.ev.on('contacts.set', () => {
console.log('setando contatos...')
})

sandro.ev.on('creds.update', saveCreds)

sandro.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 
//fimm

// const
const key = {
    remoteJid: info.key.remoteJid,
    id: info.key.id, 
    participant: info.key.participant 
}
await sandro.readMessages([key])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

const from = info.key.remoteJid
type_message = JSON.stringify(info.message)

const isGroup = from.endsWith("@g.us")

const isQuotedImage = type === "extendedTextMessage" && type_message.includes("imageMessage")

/// ==============budy
const body = type === "conversation" ? info.message.conversation : type === "viewOnceMessageV2" ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === "imageMessage" ? info.message.imageMessage.caption : type === "videoMessage" ? info.message.videoMessage.caption : type === "extendedTextMessage" ? info.message.extendedTextMessage.text : type === "viewOnceMessage" ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === "documentWithCaptionMessage" ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === "buttonsMessage" ? info.message.buttonsMessage.imageMessage.caption : type === "buttonsResponseMessage" ? info.message.buttonsResponseMessage.selectedButtonId : type === "listResponseMessage" ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === "templateButtonReplyMessage" ? info.message.templateButtonReplyMessage.selectedId : type === "groupInviteMessage" ? info.message.groupInviteMessage.caption : type === "pollCreationMessageV3" ? info.message.pollCreationMessageV3 : type === "interactiveResponseMessage" ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === "text" ? info.text : ""

const budy =
(type === 'conversation') ? info.message.conversation : type === "viewOnceMessageV2" ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === "imageMessage" ? info.message.imageMessage.caption : type === "videoMessage" ? info.message.videoMessage.caption : type === "extendedTextMessage" ? info.message.extendedTextMessage.text : type === "viewOnceMessage" ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === "documentWithCaptionMessage" ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === "buttonsMessage" ? info.message.buttonsMessage.imageMessage.caption : type === "buttonsResponseMessage" ? info.message.buttonsResponseMessage.selectedButtonId : type === "listResponseMessage" ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === "templateButtonReplyMessage" ? info.message.templateButtonReplyMessage.selectedId : type === "groupInviteMessage" ? info.message.groupInviteMessage.caption : type === "pollCreationMessageV3" ? info.message.pollCreationMessageV3 : type === "interactiveResponseMessage" ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === "text" ? info.text : ""               


const content = JSON.stringify(info.message);

const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
//fim 


//arquivos 
const pastinhaDosGrupos = './bot/json/grupos/';
if (!fs.existsSync(pastinhaDosGrupos)){
fs.mkdirSync(pastinhaDosGrupos, { recursive: true });
}

const PastaDeGrupos = `${pastinhaDosGrupos}${from}.json`;
if (isGroup && !fs.existsSync(PastaDeGrupos)) {
var datea = [{
 antilink: false, joguinhos: false, adultos: false, autoResposta: false, 
}];
fs.writeFileSync(PastaDeGrupos, JSON.stringify(datea, null, 2) + '\n');
}

const ArquivosDosGrupos = isGroup && fs.existsSync(PastaDeGrupos) 
? JSON.parse(fs.readFileSync(PastaDeGrupos)) 
: undefined;

function ModificaGrupo(index) {
fs.writeFileSync(PastaDeGrupos, JSON.stringify(index, null, 2) + '\n');
}
const nescessario = "./nescessario/nescessario.json"
//fim

//váriveis definidas
const isCmd = body.startsWith(prefix)
const sender = isGroup ? info.key.participant: from
const command = comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
const nome = pushName = info.pushName ? info.pushName: botName 
const pushname = info.pushName ? info.pushName : ""
const groupMetadata = isGroup ? await sandro.groupMetadata(from): ""
const participants = isGroup ? await groupMetadata.participants : ''
const groupName = isGroup  ? groupMetadata.subject: ""
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const args = body.trim().split(/ +/).splice(1)
const q = text = args.join(' ')
const criador = `${donoNumber}@s.whatsapp.net`
const numeroBot = sandro.user.id.split(":")[0]+"@s.whatsapp.net"
const isCreator = criador.includes(sender)
const isGroupAdmins = groupAdmins.includes(sender) || false 
const isBotAdmins = groupAdmins.includes(numeroBot) || false
const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false
const menc_jid = args?.join(" ").replace("@", "") + "@s.whatsapp.net"
const menc_jid2 = args?.join(" ").replace("@", "") + "@s.whatsapp.net"
const welkom = JSON.parse(fs.readFileSync('./lib/welkom.json'));
const isWelkom = isGroup ? welkom.includes(from) : false
const textobv = JSON.parse(fs.readFileSync('./lib/legendabv.json'))
    const fazerBackupIndex = () => {
    const backupsDir = "./backups";
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const destino = `${backupsDir}/index_backup_${timestamp}.js`;

    fs.copyFileSync("./index.js", destino);
    return destino;
  };

var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''



const texto = texto_exato.slice(0).trim().split(/ +/).shift().toLowerCase()

async function escrever (texto) {
await sandro.sendPresenceUpdate('composing', from) 
await esperar(1000)   
sandro.sendMessage(from, { text: texto }, {quoted: info})
}
const totalcmd = "163"

//fim


//================//isquoted/const
const isImage = type == 'imageMessage'
const isVideo = type == 'videoMessage'
const isAudio = type == 'audioMessage'
const isSticker = type == 'stickerMessage'
const isContact = type == 'contactMessage'
const isLocation = type == 'locationMessage'
const isProduct = type == 'productMessage'
const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
typeMessage = body.substr(0, 50).replace(/\n/g, '')
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
//fim

//const
const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant

const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')

const _ = require('lodash');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const enviar = (texto) => {
sandro.sendMessage(from, { text: texto }, {quoted: info})
}

const reagir = async (idgp, emj) => {
sandro.sendMessage(idgp, {react: {text: emj, key: info.key}} )
}

const { BaseApiDark, BaseApiSpeed, BaseApiMoon, Speed_Apikey, MoonKey, DARK_USERNAME, DARK_APIKEY, emoji } = require('./dono/config.json')


const { botVersion, msg, msgClara, msgApi, consoleVerde, consoleVerde2, consoleVermelho, consoleVermelho2, consoleAmarelo, consoleAmarelo2, consoleAzul, consoleAzul2, consoleErro, consoleAviso, consoleInfo, consoleOnline, consoleSucesso, fetchJson, getBuffer, timed, data, seloCriador, seloMeta, seloGpt, seloLuzia, seloLaura, seloCopilot, seloNubank, seloBb, seloBradesco, seloSantander, seloItau, cpuUsage, totalThreads, totalMemory, freeMemory, nodeVersion, platform, hostname, HostOuNao, formatTime, uptime, velocidadeBot, latensi, timestamp, os, speed, banner, banner2, banner3 } = require('./dono/dodo.js')


const reply = (texto) => {
sandro.sendMessage(from, { text: texto }, {quoted: selo})
}

const API_KEY_NODZ = "2c9d81c84e"
//active
const gpAtivo = JSON.parse(fs.readFileSync('./dados/grupos/grupo.json')); 
const isGpativo = isGroup ? gpAtivo.includes(from) : true 
//fim

const dirGroup = `./dados/grupos/activation_gp/login.json`
//selu
const selo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net'
  },
  message: {
    extendedTextMessage: {
text: `${botName} e ${donoName} arrasando como sempre`,
      title: null,
      jpegThumbnail: null
    }
  }
};
let somembros = groupMembers.map(v => v.id);
const mencionarIMG = (teks= '', Url, ms) => {
memberr = []
vy = teks.includes('\n') ? teks.split('\n') : [teks]
for(vz of vy){ for(zn of vz.split(' ')){
if(zn.includes('@'))memberr.push(parseInt(zn.split('@')[1])+SNET)
}}
sandro.sendMessage(from, {image: {url: Url}, caption: teks.trim(), mentions: memberr}, {quoted: ms}) 
}

const SNET = "@s.whatsapp.net";

const mrc_ou_numero = q.length > 6 && !q.includes("@") ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + SNET : menc_prt 

const marc_tds = q.includes("@") ? menc_jid : q.length > 6 && !q.includes("@") ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + SNET : menc_prt 

const menc_prt_nmr = q.length > 12 ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + SNET : menc_prt

const moment = require('moment');

const timeDate = (format = 'DD/MM/YYYY') => moment().format(format);

const countDays = (start, end) => {
  const startDate = new Date(start[2], start[1] - 1, start[0]);
  const endDate = new Date(end[2], end[1] - 1, end[0]);
  const diffTime = endDate - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const tempo = timeDate();
const countDay = countDays(q.split("/"), tempo.split("/"));
//selo


   
const selosafira = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net'
  },
  message: {
    extendedTextMessage: {
      text: `${botName} e ${donoName} arrasando como sempre`,
      title: null,
      jpegThumbnail: null
    }
  }
};

//ju

const infoSystem = require('os')
const runtime = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? " Dia, " : " Dias, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " Hora, " : " Horas, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " Minuto e " : " Minutos e ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " Segundo" : " Segundos") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}

var hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
var date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');

bidy =  body.toLowerCase()
const testat = bidy

//

const isJogos = isGroup ? ArquivosDosGrupos[0].joguinhos : undefined

const dataGp = isGroup ? JSON.parse(fs.readFileSync(dirGroup)) : undefined 

const esperar = async (tempo) => {
    return new Promise(funcao => setTimeout(funcao, tempo));
}

const premium = JSON.parse(fs.readFileSync('./arquivos/vip/premium.json'));
const isPremium = premium.includes(sender)
const cargo =  "sla"


const mention = (teks= '', ms = info) => {
memberr = []
vy = teks.includes('\n') ? teks.split('\n') : [teks]
for(vz of vy){ for(zn of vz.split(' ')){
if(zn.includes('@'))memberr.push(parseInt(zn.split('@')[1])+'@s.whatsapp.net')
}}
sandro.sendMessage(from, {text: teks.trim(), mentions: memberr}, {quoted: selo}) 
}

const { fundo1, fundo2, imgnazista, imggay, imgcorno, imggostosa, imggostoso, imgfeio, imgvesgo, imgbebado, imggado, matarcmd, deathcmd, beijocmd, chutecmd, tapacmd, rnkgay, rnkgado, rnkcorno, rnkgostoso, rnkgostosa, rnknazista, rnkotaku, rnkpau, suruba, minado_bomb, thumbnail } = require("./arquivos/links_img.json");

const mentions = (texto, ids, send) => {
    if (send) {
        sandro.sendMessage(from, { text: texto, mentions: ids }, { quoted: info });
    }
};
const isnit = true; // ou false
const menc_os2 = q.includes("@") ? menc_jid : menc_prt 
//fim 

//console.log 
 if (!isGroup && isCmd) console.log(
color(`𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐍𝐎 𝐏𝐑𝐈𝐕𝐀𝐃𝐎`,'red'),'\n',
color('⪼ NOME DO BOT:','red'),color(botName, 'red'),'\n',
color('⪼ USUÁRIO:','red'),color(pushname,'red'),'\n',
color('⪼ COMANDO:','red'),color(budy, 'red'),'\n',
color('⪼ HORÁRIO:','red'),color(hora,'red'),'\n',
color('⪼ DAТA:','red'),color(data,'red'),'\n')

if (!isCmd && !isGroup) console.log(
color(`𝐌𝐄𝐍𝐒𝐀𝐆𝐄𝐌 𝐍𝐎 𝐏𝐑𝐈𝐕𝐀𝐃𝐎`,'red'),'\n',
color('⪼ NOME DO BOT:','red'),color(botName, 'red'),'\n',
color('⪼ USUÁRIO:','red'),color(pushname,'red'),'\n',
color('⪼ MENSAGEM:','red'),color(budy,'red'),'\n',
color('⪼ HORÁRIO:','red'),color(hora,'red'),'\n',
color('⪼ DATA:','red'),color(data,'red'),'\n')

if (isCmd && isGroup) console.log(
color(`𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐄𝐌 𝐆𝐑𝐔𝐏𝐎`,'yellow'),'\n',
color('⪼ NOME DO BOT:','yellow'),color(botName, 'red'),'\n',
color('⪼ NOME DO GRUPO:','yellow'),color(groupName,'red'),'\n',
color('⪼ USUÁRIO:','yellow'),color(pushname,'red'),'\n',
color('⪼ COMANDO:','yellow'),color(budy,'red'),'\n',
color('⪼ HORÁRIO:','yellow'),color(hora,'red'),'\n',
color('⪼ DATA:','yellow'),color(data,'red'),'\n')

if (!isCmd && isGroup) console.log(
color(`𝐌𝐄𝐍𝐒𝐀𝐆𝐄𝐌 𝐄𝐌 𝐆𝐑𝐔𝐏𝐎`,'yellow'),'\n',
color('⪼ NOME DO BOT:','yellow'),color(botName, 'red'),'\n',
color('⪼ NOME DO GRUPO:','yellow'),color(groupName,'red'),'\n',
color('⪼ USUÁRIO:','yellow'),color(pushname,'red'),'\n',
color('⪼ MENSAGEM:','yellow'),color(budy,'red'),'\n',
color('⪼ HORÁRIO:','yellow'),color(hora,'red'),'\n',
color('⪼ DATA:','yellow'),color(data,'red'),'\n')


// CASES ABAIXO, BOTE NADA ACIMA, TUDO JA EST



// Carregar os dados de RPG e autorpg uma vez só



const selinLive = {key: {participant: '0@s.whatsapp.net'}, message: {liveLocationMessage: {caption: `Dono: Yatiin mods`}}} 

const carrinho = {key: {participant: '0@s.whatsapp.net'}, message: {orderMessage: {itemCount: 999999999, status: 1, surface: 1, orderTitle: `${botName}`, thumbnail: null}}}

const selinVideo = {key: {participant : '0@s.whatsapp.net'},message: {videoMessage: {caption: pushname}}}

const selinContact = {key: {participant : '0@s.whatsapp.net'},message: {contactMessage: {displayName: `${pushname}`}}}

const selinDocument = {key: {participant : '0@s.whatsapp.net'}, message: {documentMessage: {caption: pushname}}}

const selinho = { 
"key": {
"participant": "13135550002@s.whatsapp.net",
"remoteJid": "status@broadcast", 
"fromMe": false, 
},
"message": {
"contactMessage": {
"displayName": `${botName}`, 
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Meta AI;;;\nFN:Meta AI\nitem1.TEL;waid=13135550002:13135550002\nitem1.X-ABLabel:Celular\nEND:VCARD`, 
"contextInfo": {
"forwardingScore": 1,
"isForwarded": true}}}};




  let sabrpg = [];
  let autorpg = [];

  try {
    sabrpg = JSON.parse(fs.readFileSync('./database/usuarios/SystemRPG/sabrpg.json', 'utf-8'));
  } catch {
    sabrpg = [];
  }

  try {
    autorpg = JSON.parse(fs.readFileSync('./database/usuarios/SystemRPG/autorpg.json', 'utf-8'));
  } catch {
    autorpg = [];
  }

  const idx = autorpg.findIndex(i => i.id === from);
  const isSabCityOFF = idx === -1 || autorpg[idx]?.rpg === true;

let So_Adm;
if (isGroup && Array.isArray(dataGp) && dataGp.length > 0 && dataGp[0].soadm !== undefined) {
  So_Adm = dataGp[0].soadm;
}

const sender_ou_n = q.includes("@") ? menc_jid : sender

const sendPoll = (sabrina, id, name = '', values = [], selectableCount = 1) => { 
return sabrina.sendMessage(id, {poll: {name, values, selectableCount}, messageContextInfo: { messageSecret: randomBytes(32)}}, {id, options: {userJid: sabrina?.user?.id}}).catch(() => {
return console.log(console.error);
});
}

const { randomBytes } = require("crypto");

//

//comandos
switch(command) {

case 'venomlogo2'://toshiruz dev 
try {//api venom apis                      
if (args.length < 1) return reply('qual o nome?')
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply('*Estou fazendo, se der erro tente novamente ✓*')
const toshiruz = await getBuffer(`https://lollityp.sirv.com/venom_apis2.jpg?text.0.text=${encodeURIComponent(teks)}&text.0.position.gravity=center&text.0.position.x=1%25&text.0.position.y=16%25&text.0.size=80&text.0.color=ff2772&text.0.opacity=67&text.0.font.family=Bangers&text.0.font.style=italic&text.0.background.opacity=50&text.0.outline.width=6`)
await sandro.sendMessage(from, { image: toshiruz }, { quoted: seloGpt });
} catch (e) {
console.error('Erro no comando venomlogo2:', e);
reply('Ocorreu um erro ao gerar a imagem. Tente novamente.');
}
break;

case 'venomlogo3'://toshiruz dev 
try {//api venom apis       
if (args.length < 1) return reply('qual o nome?')
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply('*Estou fazendo, se der erro tente novamente ✓*')
const toshiruz = await getBuffer(`https://lollityp.sirv.com/venom_apis3.jpg?text.0.text=${encodeURIComponent(teks)}&text.0.position.gravity=north&text.0.position.y=59%25&text.0.size=89&text.0.color=000000&text.0.opacity=71&text.0.font.family=Changa%20One&text.0.font.style=italic&text.0.background.opacity=10&text.0.outline.color=ffffff&text.0.outline.width=3`)
await sandro.sendMessage(from, { image: toshiruz }, { quoted: seloGpt });
} catch (e) {
console.error('Erro no comando venomlogo3:', e);
reply('Ocorreu um erro ao gerar a imagem. Tente novamente.');
}
break;

case 'venomlogo4'://toshiruz dev 
try {//api venom apis       
if (args.length < 1) return reply('qual o nome?')
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply('*Estou fazendo, se der erro tente novamente ✓*')
const toshiruz = await getBuffer(`https://lollityp.sirv.com/venom_apis.jpg?text.0.text=${encodeURIComponent(teks)}&text.0.position.gravity=center&text.0.position.x=11%25&text.0.position.y=22%25&text.0.size=20&text.0.color=241b1b&text.0.opacity=33&text.0.font.family=Rock%20Salt&text.0.font.style=italic&text.0.background.opacity=49`)
await sandro.sendMessage(from, { image: toshiruz }, { quoted: seloGpt });
} catch (e) {
console.error('Erro no comando venomlogo4:', e);
reply('Ocorreu um erro ao gerar a imagem. Tente novamente.');
}
break;
					
case 'venomlogo5'://toshiruz dev 
try {//api venom apis       
if (args.length < 1) return reply('qual o nome?')
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply('*Estou fazendo, se der erro tente novamente ✓*')
const toshiruz = await getBuffer(`https://lollityp.sirv.com/venom_apis5.jpg?text.0.text=${encodeURIComponent(teks)}&text.0.position.gravity=center&text.0.position.x=1%25&text.0.position.y=22%25&text.0.align=left&text.0.size=59&text.0.font.family=Permanent%20Marker&text.0.outline.color=df00ff&text.0.outline.width=2&text.0.outline.blur=18`)
await sandro.sendMessage(from, { image: toshiruz }, { quoted: seloGpt });
} catch (e) { console.error('Erro no comando venomlogo5:', e);
reply('Ocorreu um erro ao gerar a imagem. Tente novamente.');
}
break;

case 'rankgay': case 'rankgays':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `*🤖RANK DOS 5 MAIS GAYS DO GRUPO [ ${groupName} ]🏳‍🌈*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgay)
break;

case 'rankgado': case 'rankgados':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `RANK DOS 5 MAIS GADO DO GRUPO 🐂🐃\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgado);
break;

case 'rankcorno': case 'rankcornos':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `RANK DOS 5 MAIS CORNO DO GRUPO 🐂\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkcorno);
break;

case 'rankgostosos': case 'rankgostoso':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `RANK DOS 5 MAIS GOSTOSOS DO GRUPO 😏🔥\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgostoso);
break;

case 'rankgostosas': case 'rankgostosa':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `RANK DAS 5 MAIS GOSTOSAS DO GRUPO 😏🔥\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgostosa);
break;

case 'ranknazista': case 'ranknazistas':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `*💂‍♂RANK DOS 5 MAIS NAZISTAS DO GRUPO 卐🤡*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnknazista);
break;

case 'rankotaku': case 'rankotakus':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos precisa ta ativo")
ABC = `*㊙ RANK DOS 5 MAIS OTAKU DO GRUPO ( ˶•̀ _•́ ˶)*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkotaku);
break;

case 'rankpau':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modojogos precisa ta ativo")
ABC = `*RANK DOS 5 PAU MAIOR DO GRUPO 📏*\n\n`
TMPAU = ["Pequeno pra cact, se mata maluco 🥴", `Pequenininho chega ser até fofo 🥺`, `Menor que meu dedo mindinho pequeno demais 😑`, `Até que dá sentir, tá na média 😌`, `Grandinho 🥵`, `Grande até `, `Gigantesco igual meu braço 😖`, `Enorme quase chega no útero 🤧`, `Grandão demais em, e uii 🤯`, `Vara de pegar manga, grande demais, como sai na rua assim??`, "Que grandão em, nasceu metade animal 😳"]
for (var i = 0; i < 5; i++) {
ABC += `${TMPAU[Math.floor(Math.random() * TMPAU.length)]} _- @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkpau);
break;

case 'eununca':
if(!isJogos) return reply(`o modo brincadeira esta desativado se vc for adm use ${prefix}modobrincadeiras 1 ou chame um adm`)  
if(!isGroup) return reply("so em grupo")
sandro.sendMessage(from,
{image: fs.readFileSync('./arquivos/imagens/leia.png'),
gifPlayback: true},
{quoted: selo})
await delay(8000)
setTimeout(() => {reagir(from, "🙈")}, 100)
const pergunta_ = JSON.parse(fs.readFileSync('./arquivos/json/eununca.json'));
const getRandomINever = pergunta_[Math.floor(Math.random() * pergunta_.length)]
sendPoll(sandro, from, getRandomINever, ["Eu nunca", "Eu já"]).catch(console.error);
break


case 'nazista':
if(!isJogos) return reply(`o modo brincadeira esta desativado se vc for adm use ${prefix}modobrincadeiras 1 ou chame um adm`)  
if(!isGroup) return reply("so em grupo")
sandro.sendMessage(from, {text: `Pesquisando a sua ficha de nazista: *@${sender_ou_n.split("@")[0]}* aguarde...`, mentions: [sender_ou_n]}, {quoted: info})
setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
sandro.sendMessage(from, {image: {url: imgnazista}, caption: `O quanto *@${sender_ou_n.split("@")[0]}* pode ser uma pessoa nazista?\n• Porcentagem de chance de ser uma pessoa nazista: *${random}%.* `, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'gay':
if(!isGroup) return reply("so em grupo")
if(!isJogos) return reply(`o modo brincadeira esta desativado se vc for adm use ${prefix}modobrincadeiras 1 ou chame um adm`)  
sandro.sendMessage(from, {text: `Pesquisando a sua ficha de gay: @${sender_ou_n.split("@")[0]} aguarde...`, mentions: [sender_ou_n]}, {quoted: info})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
feio = random
boiola = random
if(boiola < 20 ) {var bo = 'hmm... você é hetero...'} else if(boiola == 21 ) {var bo = '+/- boiola'} else if(boiola == 23 ) {var bo = '+/- boiola'} else if(boiola == 24 ) {var bo = '+/- boiola'} else if(boiola == 25 ) {var bo = '+/- boiola'} else if(boiola == 26 ) {var bo = '+/- boiola'} else if(boiola == 27 ) {var bo = '+/- boiola'} else if(boiola == 2 ) {var bo = '+/- boiola'} else if(boiola == 29 ) {var bo = '+/- boiola'} else if(boiola == 30 ) {var bo = '+/- boiola'} else if(boiola == 31 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 32 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 33 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 34 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 35 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 36 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 37 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 3 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 39 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 40 ) {var bo = 'tenho minha desconfiança...'} else if(boiola == 41 ) {var bo = 'você é né?'} else if(boiola == 42 ) {var bo = 'você é né?'} else if(boiola == 43 ) {var bo = 'você é né?'} else if(boiola == 44 ) {var bo = 'você é né?'} else if(boiola == 45 ) {var bo = 'você é né?'} else if(boiola == 46 ) {var bo = 'você é né?'} else if(boiola == 47 ) {var bo = 'você é né?'} else if(boiola == 4 ) {var bo = 'você é né?'} else if(boiola == 49 ) {var bo = 'você é né?'} else if(boiola == 50 ) {var bo = 'você é ou não?'} else if(boiola > 51) {var bo = 'você é gay...'
}
sandro.sendMessage(from, {image: {url: imggay}, caption: `Qual é a porcentagem de chance do(a) *@${sender_ou_n.split("@")[0]}* ser gay?\n• *${random}% homossexual*, ${bo}`, mentions: [sender_ou_n], thumbnail:null}, {quoted: selo})
}, 7000)
break

case 'gostoso':
if(!isGroup) return reply("so em grupo")
if(!isJogos) return reply(`o modo brincadeira esta desativado se vc for adm use ${prefix}modobrincadeiras 1 ou chame um adm`)  
sandro.sendMessage(from, {text:`Pesquisando a sua ficha de gostoso @${sender_ou_n.split("@")[0]} aguarde...`, mentions: [sender_ou_n]}, {quoted: info})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
sandro.sendMessage(from, {image: {url: imggostoso}, caption: `O quanto *@${sender_ou_n.split("@")[0]}* pode ser uma pessoa gostosa?\n• A porcentagem de chance é *${random}%*`, gifPlayback: true, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 


case 'gostosa':
if(!isGroup) return reply("so em grupo")
if(!isJogos) return reply(`o modo brincadeira esta desativado se vc for adm use ${prefix}modobrincadeiras 1 ou chame um adm`)  
sandro.sendMessage(from, {text:`Pesquisando a sua ficha de gostosa @${sender_ou_n.split("@")[0]} aguarde...`, mentions: [sender_ou_n]}, {quoted: info})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
sandro.sendMessage(from, {image: {url: imggostosa}, caption: `O quanto *@${sender_ou_n.split("@")[0]}* pode ser uma pessoa gostosa?\n• A porcentagem de chance é *${random}%*`, gifPlayback: true, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 




case 'deletar': 
case 'delete': 
case 'del':  
case 'd':
if(!menc_prt) return reply("Marque a mensagem do usuário que deseja apagar, do bot ou de alguém.")
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: menc_prt}})
break


case 'cassino':
if(!isGroup) return reply(resposta.grupo)
if(!JSON.stringify(sabrpg).includes(sender)) return reply(`${tempo} usuário(a), novo(a) por aqui? Use *${prefix}rgsc* para se registrar na Sab's City.`)
horacass = moment.tz('America/Sao_Paulo').format('HH')
diacass = moment.tz('America/Sao_Paulo').format('DD')
mmcass = moment.tz('America/Sao_Paulo').format('MM')
AB = sabrpg.map(i => i.id).indexOf(sender)
if(Number(args[0]) > Number(sabrpg[AB].money)) return reply(`Você não possui saldo suficiente para efetuar essa aposta...`)
if(Number(sabrpg[AB].limiteC) === 0 && Number(sabrpg[AB].horaC) === Number(horacass)) return reply(`*Você já apostou muito hoje...* Suas chances estão esgotadas! Por favor, volte mais tarde! 😔😭`)
HC = Number(sabrpg[AB].horaC) + 1
//acabou o limite...
if(Number(horacass) > Number(sabrpg[AB].horaC) && Number(sabrpg[AB].diaC) === Number(diacass) && Number(sabrpg[AB].mC) === Number(mmcass)) {
sabrpg[AB].limiteC = 20
sabrpg[AB].horaC = horacass
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`😝🤪 Mas já mlk? Bora apostar então, eu ainda vou sugar muito teu dinheiro!`)
}
//passar do dia pro outro...
if(Number(sabrpg[AB].limiteC) === 0 && Number(diacass) > Number(sabrpg[AB].diaC)) {
sabrpg[AB].limiteC = 20
sabrpg[AB].horaC = horacass
sabrpg[AB].diaC = diacass
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`💰🌟 ${tempo} caro jogador, como está a sua sorte hj?`)
}
//passar do mês pro outro...
if(Number(sabrpg[AB].limiteC) === 0 && Number(mmcass) > Number(sabrpg[AB].mC)) {
sabrpg[AB].limiteC = 30
sabrpg[AB].horaC = horacass
sabrpg[AB].diaC = diacass
sabrpg[AB].mC = mmcass
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`📆🗣 Primeira aposta do mês? Eu ainda vou sugar muito teu dinheiro todo...`)
}
if(Number(sabrpg[AB].limiteC) > 0) {
if(!q) {
return reply(`Você deve escolher uma quantia para apostar... Ex: ${prefix+command} 100 _(você estará apostando R$ 100.00)_`)
}
if(Number(args[0]) < 10) return reply(`Não é possível apostar menos que R$ 10.00`)
if(Number(args[0]) > 20000) return reply(`Não é possível apostar mais que R$ 20000.00! 😿`)
if(!Number(args[0])) return reply(`*${args[0]}* não é número! 😿`)
frutasC = JSON.parse(fs.readFileSync("./arquivos/json/slots.json"));
resulC = `${frutasC[Math.floor(Math.random()*frutasC.length)]} : ${frutasC[Math.floor(Math.random()*frutasC.length)]} : ${frutasC[Math.floor(Math.random()*frutasC.length)]}`
if(resulC == `🦴 : 🦴 : 🦴`) {
CC = Number(sabrpg[AB].limiteC) - 1
sabrpg[AB].money = 50
sabrpg[AB].limiteC = CC
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`• *[${resulC}]* - Óia a bruxa passando... Todo o dinheiro da sua conta agora é dela!`)
}
if(resulC == `🍫 : 🍫 : 🍫`){cmrpg = 1000};
if(resulC == `🍔 : 🍔 : 🍔`){cmrpg = 600};
if(resulC == `🥩 : 🥩 : 🥩`){cmrpg = 400};
if(resulC == `🍕 : 🍕 : 🍕`){cmrpg = 250};
if(resulC == `🌶️ : 🌶️ : 🌶️`){cmrpg = 200};
if(resulC == `🍪 : 🍪 : 🍪`){cmrpg = 100};
if(resulC == `🍗 : 🍗 : 🍗`){cmrpg = 80};
if(resulC == `🌭 : 🌭 : 🌭`){cmrpg = 70};
if(resulC == `🥞 : 🥞 : 🥞`){cmrpg = 60};
if(resulC == `🥓 : 🥓 : 🥓`){cmrpg = 50};
if((resulC == `🧇 : 🧇 : 🧇`) || (resulC == `🍞 : 🍞 : 🍞`) || (resulC == `🥐 : 🥐 : 🥐`) || (resulC == `🥥 : 🥥 : 🥥`) || (resulC == `🍎 : 🍎 : 🍎`) || (resulC == `🍌 : 🍌 : 🍌`) || (resulC == `🍓 : 🍓 : 🍓`)){cmrpg = 40};
if((resulC == `🍐 : 🍐 : 🍐`) || (resulC == `🍊 : 🍊 : 🍊`) || (resulC == `🍋 : 🍋 : 🍋`) || (resulC == `🍉 : 🍉 : 🍉`) || (resulC == `🍇 : 🍇 : 🍇`) || (resulC == `🍒 : 🍒 : 🍒`) || (resulC == `🍑 : 🍑 : 🍑`) || (resulC == `🥭 : 🥭 : 🥭`) || (resulC == `🍍 : 🍍 : 🍍`) || (resulC == `🥝 : 🥝 : 🥝`) || (resulC == `🍅 : 🍅 : 🍅`) || (resulC == `🥑 : 🥑 : 🥑`) || (resulC == `🌽 : 🌽 : 🌽`) || (resulC == `🥕 : 🥕 : 🥕`)){cmrpg = 30}
if((resulC == `🍫 : 🍫 : 🍫`) || (resulC == `🍔 : 🍔 : 🍔`) || (resulC == `🥩 : 🥩 : 🥩`) || (resulC == `🍕 : 🍕 : 🍕`) || (resulC == `🌶️ : 🌶️ : 🌶️`) || (resulC == `🍪 : 🍪 : 🍪`) || (resulC == `🍗 : 🍗 : ??`) || (resulC == `🌭 : 🌭 : 🌭`) || (resulC == `🥞 : 🥞 : 🥞`) || (resulC == `🥓 : 🥓 : 🥓`) || (resulC == `🧇 : 🧇 : 🧇`) || (resulC == `🍞 : 🍞 : 🍞`) || (resulC == `🥐 : 🥐 : 🥐`) || (resulC == `🥥 : 🥥 : 🥥`) || (resulC == `🍎 : 🍎 : 🍎`) || (resulC == `🍌 : 🍌 : 🍌`) || (resulC == `🍓 : 🍓 : 🍓`) || (resulC == `🍐 : 🍐 : 🍐`) || (resulC == `🍊 : 🍊 : 🍊`) || (resulC == `🍋 : 🍋 : 🍋`) || (resulC == `🍉 : 🍉 : 🍉`) || (resulC == `🍇 : 🍇 : 🍇`) || (resulC == `🍒 : 🍒 : 🍒`) || (resulC == `🍑 : 🍑 : 🍑`) || (resulC == `🥭 : 🥭 : 🥭`) || (resulC == `🍍 : 🍍 : 🍍`) || (resulC == `🥝 : 🥝 : 🥝`) || (resulC == `🍅 : 🍅 : 🍅`) || (resulC == `🥑 : 🥑 : 🥑`) || (resulC == `🌽 : 🌽 : 🌽`) || (resulC == `🥕 : 🥕 : 🥕`)) {
var Vitória = "Você acaba de ganhar"
var CC = Number(sabrpg[AB].limiteC) - 1
var MR = sabrpg[AB].money
var TT = Number(args[0]) * Number(cmrpg)
var TC = Number(TT) + Number(args[0])
var VT = Number(MR) + Number(TC) * 5
var Ctxt = `R$ ${Number(TC).toFixed(2)}`
sabrpg[AB].money = VT
sabrpg[AB].limiteC = CC
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
} else {
var Vitória = "Você perdeu! Como punição, você perderá"
var CC = Number(sabrpg[AB].limiteC) - 1
var MR = sabrpg[AB].money
var VT = Number(MR) - Number(args[0])
var Ctxt = `R$ ${Number(args[0]).toFixed(2)}`
sabrpg[AB].money = VT
sabrpg[AB].limiteC = CC
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
}
const cassino = `• *[${resulC}]* - ${Vitória} ${Ctxt}` 
reply(cassino)
}
break

case 'pinterest':{
try {
if (!q.trim()) return reply(`ex: ${prefix + command} cat`);
await reply(resposta.espere)
await sandro.sendMessage(from, {image: {url: `https://api.nexfuture.com.br/api/pesquisas/pinterest?query=${q}`}, caption: `sua imagem!`})
} catch (e) {
reagir(from, "❌")
console.log("erro em" + e)
}
} break//by: shizuku-Bot & jpzinh!

case 'listavip': case 'listaprem':
if(!isCreator) return reply(resposta.dono)   
if(!isPremium) return reply(resposta.premium)   
tkks = '╭────*「 _PREMIUM USER👑_ 」\n'
for (let V of premium) {
tkks += `│+  @${V.split('@')[0]}\n`
}
tkks += `│+ Total : ${premium.length}\n╰──────*「 _${botName}_ 」*────`
reply(tkks.trim())
break

case 'delpremium': case 'delvip':
if(!isCreator) return reply("esse comando e exclusivo para meu dono")
if (!budy.includes("@55")) {
num = info.message.extendedTextMessage.contextInfo.participant
bla = premium.includes(num)
if(!bla) return reply("_Este número não está incluso na lista premium.._")  
pesquisar = num
processo = premium.indexOf(pesquisar)
while(processo >= 0){
premium.splice(processo, 1)
processo = premium.indexOf(pesquisar)
}
fs.writeFileSync('./arquivos/vip/premium.json', JSON.stringify(premium))
sandro.sendMessage(from, {text: ` ${num.split("@")[0]} foi tirado da lista premium com sucesso..`}, {quoted: info})
} else {
mentioned = args.join(" ").replace("@", "") + "@s.whatsapp.net"
bla = premium.includes(mentioned)
if(!bla) return reply("_Este número não está incluso na lista premium.._")  
pesquisar = mentioned
processo = premium.indexOf(pesquisar)
while(processo >= 0){
premium.splice(processo, 1)
processo = premium.indexOf(pesquisar)
}
fs.writeFileSync('./arquivos/vip/premium.json', JSON.stringify(premium))
sandro.sendMessage(from, {text: ` @${mentioned.split("@")[0]} foi tirado da lista premium com sucesso..`}, {quoted: info})
}
break

case 'so_adm':
if(!isGroup) return reply(Resposta.grupo)
if(!isGroupAdmins) return reply(resposta.adm)
if(!isBotGroupAdmins) return reply(resposta.botadm)
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(So_Adm) return reply('Ja esta ativo')
dataGp[0].soadm = true
setGp(dataGp)
reply(' - Ativou com sucesso o recurso de só adm utilizar comandos neste grupo 📝')
} else if(Number(args[0]) === 0) {
if(!So_Adm) return reply('Ja esta Desativado')
dataGp[0].soadm = false
setGp(dataGp)
reply('‼️ Desativou o recurso de Só ADM utiliar comandos neste grupo ✔️')
} else {
reply('1 para ativar, 0 para desativar')
}
break


case 'addpremium':
case 'addvip':
    if (!isCreator) return reply("❌ Esse comando é exclusivo para meu dono.");

    // Proteção contra mensagens sem marcações
    const extendedText = info.message.extendedTextMessage;
    const contextInfo = extendedText?.contextInfo;
 const mentioned = contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
        return reply("❌ Marque pelo menos um usuário para adicionar ao VIP.");
    }

    let pru = '.\n';
    for (let user of mentioned) {
        pru += `@${user.split('@')[0]}\n`;
        if (!premium.includes(user)) {
            premium.push(user);
        }
    }

    // Salva no arquivo
    fs.writeFileSync('./arquivos/vip/premium.json', JSON.stringify(premium, null, 2));

    const susp = `👑 @${mentioned[0].split('@')[0]} foi adicionado à lista de usuários premium com sucesso 👑`;
    mentions(susp, mentioned, true);
    break;

case 'serprem': case 'servip':
if(!isCreator) return reply("esse comando e exclusivo para meu dono")
premium.push(`${donoNumber}@s.whatsapp.net`)
fs.writeFileSync('./arquivos/vip/premium.json', JSON.stringify(premium))
reply(`Pronto ${donoNumber} você foi adicionado na lista premium👑.`)
break

case 'modojogos':
if(!isGroup) return enviar(resposta.grupo)
if(!isGroupAdmins) return enviar(resposta.adm)
if(!isBotGroupAdmins) return enviar(resposta.botadm)
if(q.length < 1) return enviar(`${prefix + comando} 1 para ativar, 0 para desativar.`)
if(Number(q[0]) === 1) {
if(isJogos) return enviar('Isso já ta ativo no grupo ✅')
ArquivosDosGrupos[0].joguinhos = true
ModificaGrupo(ArquivosDosGrupos)
enviar('*_O modo jogos foi ativado com sucesso nesse grupo 😋_*.')
} else if(Number(q[0]) === 0) {
if(!isJogos) return enviar('Isso já ta offline 😪')
ArquivosDosGrupos[0].joguinhos = false
ModificaGrupo(ArquivosDosGrupos)
enviar('*_O modo jogos foi desativado com sucesso nesse grupo 😋_*')
} else {
enviar(`${prefix + comando} 1 para ativar, 0 para desativar.`)
}
break

case 'facebook': 
if (!q) return reply(`Por favor, adicione um link do Facebook`);
try {
reply(`Realizando o download do vídeo...`);

api = await fetchJson(`https://api.nexfuture.com.br/api/downloads/facebook/dl?url=${encodeURIComponent(q)}`);

await sandro.sendMessage(from, {video: {url: api.resultado.data[0].url}, mimetype: "video/mp4"}, {quoted: info})
} catch(error) {
return reply(`Deu um pequeno erro, tente novamente mais tarde`)
}
break

case 'simi':
if(!q) return reply("Escreva algo para o simsimi");
try {
let apisimi = await fetchJson(`https://carisys.online/api/outros/simsimi?query=${encodeURIComponent(q)}`);
reply(apisimi.resposta);
} catch (e) {
return reply("Resposta não encontrada..");
}
break;

case 'listafake':
if(!isGroup) return reply(resposta.grupo)
if(!isGroupAdmins) return reply(resposta.adm)
teks = '𝗙𝗔𝗞𝗘𝗦 𝗡𝗢 𝗚𝗥𝗨𝗣𝗢  \n'
men = []
for(let mem of groupMembers) {
    if(!mem.id.startsWith(55)) {
teks += `➤ @${mem.id.split('@')[0]}\n`
men.push(mem.id)
    }
}
if(teks.indexOf('➤') < 0) return reply(' 𝗡𝗲𝗻𝗵𝘂𝗺 𝗙𝗮𝗹𝘀𝗼 𝗗𝗲𝘁𝗲𝗰𝘁𝗔𝗱𝗼')
sandro.sendMessage(from, {text: teks, mentions: men})
break

case 'listabr':
if(!isGroup) return reply(resposta.grupo)
if(!isGroupAdmins) return reply(resposta.adm)
teks = '𝗕𝗥𝗔S𝗜𝗟𝗘𝗜𝗥𝗢𝗦 𝗡𝗢 𝗚𝗥𝗨𝗣𝗢 \n'
men = []
for(let mem of groupMembers) {
    if(mem.id.startsWith(55)) {
teks += `➤ @${mem.id.split('@')[0]}\n`
men.push(mem.id)
    }
}
if(teks.indexOf('➤') < 0) return reply('🇧🇷 *NENHUM NÚMERO BR FOI ENCONTRADO* 🇧🇷')
sandro.sendMessage(from, {text: teks, mentions: men})
break
//Créditos: ROM BY: Alvechinkkj 愛
case 'alfabeto':
case 'a':
if(!q) return reply(`*Ex:* A letra que cair é a inicial da pessoa que vai te fazer feliz esse ano...`)
alfa = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S","T","U","V","W","X","Y","Z"]
reply(`❤️‍🔥 Vamos sortear uma letra para a frase⟩
${q}`)
setTimeout(async() => {
sandro.sendMessage(from, {text: `${alfa[Math.floor(Math.random()*alfa.length)]}`})
}, 2000)
break
//
const BaseYuxinzesite = `http://speedhosting.cloud:2009`

case 'insta':// Yuki X Delta Channel 
case 'instagram':
if (!q) return reply('coloque o link do vídeo que você quer baixar do Instagram 😉')
reply('aguarde, estou baixando o seu vídeo direto do instagram.')
try{
insta = await fetchJson(`${BaseYuxinzesite}/download/instagram?&url=${q}`);
  
await sandro.sendMessage(from, {video: {url: insta.resultado.dados[0].url}, caption: `『 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 』\n
➥𝑻𝒊𝒕𝒖𝒍𝒐: ${insta.resultado.legenda.texto}\n
➥𝑪𝒓𝒊𝒂𝒅𝒐𝒓: ${insta.resultado.perfil.nome_completo}
➥𝑽𝒆𝒓𝒊𝒇𝒊𝒄𝒂𝒅𝒐: ${insta.resultado.perfil.verificado ? 'Sim': 'Não'}
➥𝑪𝒐𝒎𝒆𝒏𝒕𝒂́𝒓𝒊𝒐𝒔: ${insta.resultado.estatísticas.numero_comentarios}
➥𝑳𝒊𝒌𝒆𝒔: ${insta.resultado.estatísticas.numero_likes}
➥𝑪𝒐𝒎𝒑𝒂𝒓𝒕𝒊𝒍𝒉𝒂𝒎𝒆𝒏𝒕𝒐𝒔: ${insta.resultado.estatísticas.numero_compartilhamentos}`}, {quoted:selo})
} catch (e) {
console.log(e)
return reply('ocorreu um erro ao baixar o vídeo do Instagram.')
}
break//Yuki X Delta Channel

case 'criargp': {
  const nomeGrupo = q || args.join(" ");
  if (!isCreator) return reply("Apenas o dono pode executar este comando.");
  if (!groupName) return reply(`Digite o nome do grupo: ${prefix}criargp NomeDoGrupo`);
  try {
    const response = await sandro.groupCreate(groupName, [sender]);
    const idGrupoNovo = response.id;
    await sandro.sendMessage(idGrupoNovo, { text: `Grupo criado com sucesso!\nBem-vindo ao grupo *${nomeGrupo}*!`, mentions: [sender] });
    reply(`Grupo "${groupName}" criado com sucesso!`);
  } catch (err) {
    console.log(err);
    reply('Erro ao criar grupo. Verifique se o número tem permissão.');
  }
} break;

case 'calculadora':
case 'calcular':
case 'calc'://toshiruz dev 
if (!q) return reply("Digite uma expressão para calcular, exemplo: 5+5");
try {
let expressao = q
.replace(/x/gi, "*")   
.replace(/÷/g, "/")    
.replace(/[^0-9\-+*/().]/g, ""); 
let resultado = eval(expressao);
if (resultado === undefined) return reply("Expressão inválida.");
reply(`Resultado: ${resultado}`);
} catch (err) {
reply("Erro ao calcular. Verifique a expressão.");
}
break;

case 'atestado': {//By Xulinn
reagir(from, "🤕")
  function gerarCPF() {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
      cpf += Math.floor(Math.random() * 10);
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3') + '-' + Math.floor(Math.random() * 90 + 10);
  }

  function gerarCRM() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const paciente = pushname || 'Paciente';
  const cpf = gerarCPF();
  const crm = gerarCRM();
  const assinatura = botName || 'botName';

  const dataHoje = new Date();
  const dia = String(dataHoje.getDate()).padStart(2, '0');
  const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
  const ano = dataHoje.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;

  const mensagem = `
╭━━━━━━━❮◆❯━━━━━━━╮
        *ATESTADO MÉDICO*
╰━━━━━━━❮◆❯━━━━━━━╯

Atesto, para os devidos fins, que o(a) paciente *${paciente}*, CPF nº *${cpf}*, foi atendido(a) em consulta médica nesta data, apresentando quadro clínico compatível com *gripe (síndrome gripal)*, com sintomas como febre, dor no corpo, coriza e mal-estar geral.

*Recomendo afastamento de suas atividades habituais por 2 dias*, a contar de *${dataFormatada}*, para tratamento e recuperação, além de prevenção da disseminação da infecção.

───────────────
*Dr(a). ${assinatura}*
CRM: ${crm}
Assinatura: *${paciente}*
───────────────
`;

  reply(mensagem);
}
break//By Xulinn & Sakamoto-Legacy

case 'tiktok':
case 'tiktokaudio':
case 'tiktok_audio':
case 'tiktok2': {
try {
if (!q.includes("tiktok")) {
await reply('Envie o link do vídeo do TikTok!');
await reagir(from, "🧐")
return;
}

    await reagir(from, "⌛");
   let api = await fetchJson(`https://nodz-apis.com.br/api/downloads/tiktok/dl?url=${q.trim()}&apiKey=${API_KEY_NODZ}`);
    const result = api.resultado;
    
    if (command == 'tiktok') {
      const videoUrl = result.play
      await sandro.sendMessage(from, { video: { url: videoUrl }, mimetype: 'video/mp4' }, { quoted: selo });
    } else if (command == 'tiktok2') {
      const videoUrl = result.wmplay
      await sandro.sendMessage(from, { video: { url: videoUrl }, mimetype: 'video/mp4' }, { quoted: selosafira });
    } else if (command == 'tiktokaudio' || command == 'tiktok_audio') {
      const audioUrl = result.music;
      await sandro.vsendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: selo });
    }
  } catch (e) {
    console.error("erro em:", e);
    await reply('Erro ao baixar o conteúdo. Tente novamente mais tarde.');
    await reagir(from, "❌");
  }
}//CREDITOS A NODZ "https://nodz-apis.com.br/"
break//

case 'menu':
case 'menubasico':{
reagir(from, "🦋")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menu(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}

case 'menurpg': {
reagir(from, "☕️")
if (!isSabCityOFF) return reply(`É nescessário a ativação do *MODO RPG* no grupo! Use *${prefix}sabrpg*.`)

tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menurpg(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}

case 'menuaudios':{
reagir(from, "🎤")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menuaudios(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}


case 'menuvip':
case 'menupremium':{
if(!isPremium) return reply(resposta.premium)
reagir(from, "🥂")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menuvip(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}



//
function DLT_FL(file) {
try {
fs.unlinkSync(file);
} catch (error) {
}
}
///




case 'esquilo':
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')

if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply("Enviando....")
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=0.7,asetrate=65100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Ocorreu um erro ao adicionar o *efeito sonoro* no áudio.')
hah = fs.readFileSync(ran)
sandro.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:true}, {quoted: info})
DLT_FL(ran)
})
} else {
reply("Marque o áudio...")
}
break

case 'menulogos':{
reagir(from, "🗃")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menulogos(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}

case 'plaq1':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://raptibef.sirv.com/images%20(3).jpeg?text.0.text=${teks}&text.0.position.gravity=center&text.0.position.x=19%25&text.0.size=45&text.0.color=000000&text.0.opacity=55&text.0.font.family=Crimson%20Text&text.0.font.weight=300&text.0.font.style=italic&text.0.outline.opacity=21`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break
    
    case 'plaq2':{
    if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://umethroo.sirv.com/BUNDA1.jpg?text.0.text=${teks}&text.0.position.x=-20%25&text.0.position.y=-20%25&text.0.size=18&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=700&text.0.background.opacity=65`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break

case 'plaq3':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`exemplo ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://umethroo.sirv.com/bunda3.jpg?text.0.text=${teks}&text.0.position.gravity=center&text.0.position.x=-25%25&text.0.position.y=-17%25&text.0.size=17&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=700&text.0.font.style=italic`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break

case 'plaq4':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://umethroo.sirv.com/peito1.jpg?text.0.text=${teks}&text.0.position.x=-48%25&text.0.position.y=-68%25&text.0.size=14&text.0.color=000000&text.0.font.family=Shadows%20Into%20Light&text.0.font.weight=700`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break

case 'plaq5':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://umethroo.sirv.com/9152e7a9-7d49-48ef-b8ac-2e6149fda0b2.jpg?text.0.text=${teks}&text.0.position.x=-70%25&text.0.position.y=-23%25&text.0.size=17&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=300`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break

case 'plaq6':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://clutamac.sirv.com/1011b781-bab1-49e3-89db-ee2c064868fa%20(1).jpg?text.0.text=${teks}&text.0.position.gravity=northwest&text.0.position.x=22%25&text.0.position.y=60%25&text.0.size=12&text.0.color=000000&text.0.opacity=47&text.0.font.family=Roboto%20Mono&text.0.font.style=italic`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break

case 'plaq7':{
if (!isPremium) return enviar(resposta.premium)
    if (args.length < 1) return reply(`Exemplo  ${prefix}plaq e digite o seu nome`)
    teks = body.slice(6)
    if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
    buffer =(`https://umethroo.sirv.com/Torcedora-da-sele%C3%A7%C3%A3o-brasileira-nua-mostrando-a-bunda-236x300.jpg?text.0.text=${teks}&text.0.position.x=-64%25&text.0.position.y=-39%25&text.0.size=25&text.0.color=1b1a1a&text.0.font.family=Architects%20Daughter`)
    sandro.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
    await sandro.sendMessage(sender, { react: { text: `🔞`, key: info.key }})
    }
    reply(`a plaquinha esta sendo enviado no seu privado...`)
    break


case 'wallpapers4k': {
//by Daniel >\<
data = fs.readFileSync('./arquivos/wallpapers/wallpapers4k.js');
jsonData = JSON.parse(data);
randIndex = Math.floor(Math.random() * jsonData.length);
var foda =[`aqui está o seu ${command} ${pushname}`]
var zaltin = foda[Math.floor(Math.random() * foda.length)]
randKey = jsonData[randIndex];
imagem = await getBuffer(randKey.result)
let thumbInfo = `${zaltin}`;
blabla = await getBuffer(`https://telegra.ph/file/0e2989e6947b464fa66b8.jpg`);
sandro.sendMessage(from, {image: imagem, caption: `${thumbInfo}`},{quoted: info})
}
break

case 'wallpaperverde': {
//by Daniel >\<
data = fs.readFileSync('./arquivos/wallpapers/wallpaperverde.js');
jsonData = JSON.parse(data);
randIndex = Math.floor(Math.random() * jsonData.length);
var foda =[`aqui está o seu ${command} ${pushname}`]
var zaltin = foda[Math.floor(Math.random() * foda.length)]
randKey = jsonData[randIndex];
imagem = await getBuffer(randKey.result)
let thumbInfo = `${zaltin}`;
blabla = await getBuffer(`https://telegra.ph/file/0e2989e6947b464fa66b8.jpg`);
sandro.sendMessage(from, {image: imagem, caption: `${thumbInfo}`},{quoted: info})
}
break


//menus
case 'menusticker': {
reagir(from, "🎆")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menusticker(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}

case 'menupesquisa':{
reagir(from, "🤖")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menupesquisa(prefix, botName, donoName, totalcmd, pushname, cargo)
}, { quoted: selo });
break}

case 'menuadm':{
reagir(from, "🥋")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menuadm(prefix, botName, donoName, pushname, cargo)
}, { quoted: selo });
break}

case 'menudono':{
reagir(from, "👑")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menudono(prefix, botName, donoName, pushname, cargo)
}, { quoted: selo });
break}

case 'menubrincadeiras':
case 'brincadeiras':{
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
reagir(from, "🎊")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menubrincadeiras(prefix, botName, donoName, pushname, cargo)
}, { quoted: selo });
break}

case 'menu18':{
if(!isPremium) return reply(resposta.premium)
reagir(from, "🔞")
tp = fs.readFileSync('arquivos/imagens/menu.mp4')
await sandro.sendMessage(from, {
    video: tp,
    gifPlayback: true,
    caption: menu18(prefix, botName, donoName, pushname, cargo)
}, { quoted: selo });
break}

case 'totalcmd':
case 'case':
case 'cases':
case 'comandos':
  if(!isCreator) {return enviarAd(seTocaMenino), errorReact(), erroDono();}
    try {
        const fileContent = fs.readFileSync("index.js", "utf-8");
        const caseNames = fileContent.match(/case\s+['"]([^'"]+)['"]/g) || [];
        const cont = caseNames.length;
        sandro.sendMessage(from, { text: `Atualmente, existem ${cont} comandos registrados no ${botName}` }, {quoted: info});
    } catch (error) {
        console.error("Erro ao obter o total de comandos:", error);
        encamError();
    }
    break;

case 'ytsearch2': 
case "pesquisayt":{//jpzinh
  if (!q) return reply('Digite algo para pesquisar no YouTube.')
  reply(`🔎 Pesquisando no YouTube por: *${q}*...`)

  const apiKey = 'AIzaSyC97tR4IgcPRm_C2QYhT3tJIzyxu-7iSps&cx=54eb7ab01d9064a71' // substitua pela sua key real
  const query = encodeURIComponent(q)
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${apiKey}`

  try {//canal https://whatsapp.com/channel/0029Vb9odHa002T9NBh4kL0j
    const res = await fetch(url)
    const json = await res.json()
    const video = json.items[0]
    const title = video.snippet.title
    const channel = video.snippet.channelTitle
    const videoId = video.id.videoId
    const link = `https://www.youtube.com/watch?v=${videoId}`
    const thumb = video.snippet.thumbnails.high.url

    await sandro.sendMessage(from, {
      image: { url: thumb },
      caption: `*${title}*\nCanal: ${channel}\n🔗 ${link}`
    }, { quoted: selo})

  } catch (e) {
    console.error(e)
    reply('Erro ao buscar no YouTube.')
  }
}
break

case 'getcase':
case 'puxarcase':
  if(!isCreator) {return enviarAd(seTocaMenino), errorReact(), erroDono();}
      try {
                  const cases = args[0];
                  if (!cases) return reply('Por favor, especifique o nome da case.');
          
                  const fileContent = fs.readFileSync("./index.js", "utf8"); 
                  if (!fileContent.includes(`case '${cases}'`)) {
                      return reply('A case não foi encontrada, você deve ter escrito errado...');
                  }
                  const caseContent = fileContent.split(`case '${cases}'`)[1].split("break")[0] + "break";
                  await sandro.sendMessage(from, { text: `case '${cases}'` + caseContent }, { quoted: selo });
              } catch (e) {
                  console.error("Erro ao puxar case:", e);
                  error();
              }
  break;

case 'listacases':
  if(!isCreator) {return enviarAd(seTocaMenino), errorReact(), erroDono();}
    try {
      const fs = require('fs'); // A biblioteca que vamos usar para ler o arquivo
      const caminhoArquivo = './index.js'; 
 
      const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
  
      const listaCases = conteudoArquivo.match(/case\s+'(.+?)'/g);
  
      if (listaCases && listaCases.length > 0) {
        
        const listaFormatada = listaCases.map((item, index) => `${index + 1}. ${item.match(/'(.+?)'/)[1]}`).join('\n');
        reply(`Aqui está a lista de todas as cases:\n\n${listaFormatada}`);
      } else {
        reply('Nenhuma "case" foi encontrada no arquivo.');
      }
    } catch (e) {
      console.log('Erro ao listar as cases:', e);
      reply('Houve um erro ao tentar listar as cases. Tente novamente mais tarde.');
    }
    break

case 'reiniciar':
case 'r':
if(!isCreator) return reply("*✋🏻SO O MEU DONO PODE USAR ESSE COMANDO✋🏻*")
reply("Reiniciando o sistema, em segundos já estarei de volta senhor(a) as suas ordens!")
setTimeout(async() => {process.exit()}, 1200)
break
case 'hentai':{ 
if(!isPremium) return reply("você não é vip")
  await 	reply(`${isGroup ? "enviando no seu pv." : "enviando..."}`);
  try {
 Hentai = await fetchJson(`https://api.nexfuture.com.br/api/outros/hentais/videos`)
YunoBot = `> *_${botName} - hentais_*\n
> ♤Título: ${Hentai.resultado[0].titulo}
> ♡Categoria: ${Hentai.resultado[0].categoria}
> ♧Vizualizações: ${Hentai.resultado[0].views}
> □link: ${Hentai.resultado[0].url}`;

await sandro.sendMessage(sender, {video: {url: `${Hentai.resultado[0].videoDown}`}, mimetype: "video/mp4", caption: YunoBot})
} catch (e) {
	reply("deu erro ao buscar hentais");
console.log("cuzin", e)
	}//★彡 ʏᴜɴᴏ-ʙᴏᴛ - ᴄʜᴀɴɴᴇʟ 彡★
}break

 case 'listaradm':
  try {
    // Obtém os detalhes do grupo onde o comando foi executado
    const groupMetadata = await sandro.groupMetadata(from);
    const groupName = groupMetadata.subject || "Sem nome";
    const groupMembers = groupMetadata.participants || [];
    
    // Filtra os administradores do grupo
    const admins = groupMembers.filter(member => member.admin === 'admin' || member.admin === 'superadmin');
    const adminList = admins.map(admin => `@${admin.id.split('@')[0]}`).join("\n") || "Nenhum administrador encontrado.";

    // Monta a mensagem
    let txt = `👑 *Administradores do Grupo*\n\n`;
    txt += `📌 *Nome do Grupo*: ${groupName}\n`;
    txt += `👑 *Administradores*: \n${adminList}\n`;
    txt += `━━━━━━━━━━━━━━━━━━`;

    // Envia a mensagem mencionando os administradores
    await sandro.sendMessage(from, { 
      text: txt, 
      mentionedJid: admins.map(admin => admin.id) 
    }, { quoted: selo });
  } catch (error) {
    console.error(error);
    sandro.sendMessage(from, { text: "❌ Ocorreu um erro ao listar os administradores do grupo." });
  }
  break;
 
 case 'sairgp':
        if(!isGroup)
        if (!isCreator && !info.key.fromMe) return reply("🌸COMANDO SO PARA DONO🌸")
       
        try {
          sandro.groupLeave(from)
        } catch (erro) {
          reply(String(erro))
        }
        break
        
              case 'abrirgp':
      case 'fechagp':
      case 'grupo':
        if (!isGroup) return reply(`SÓ EM GRUPO`)
        if (!isGroupAdmins) return reply(`PRECISA SER ADMININASTROR`)
        if (!isBotGroupAdmins) return reply(`BOT PREPRECISA SER ADMININASTROR`)
        if (args[0] === 'a') {
          reply(`*GRUPO ABERTO COM SUCESSO*`)
          await sandro.groupSettingUpdate(from, 'not_announcement')
        } else if (args[0] === 'f') {
          reply(`*GRUPO FECHADO COM SUCESSO*`)
          await sandro.groupSettingUpdate(from, 'announcement')
        }
        break

      case 'legendabv':
        if (!isGroup) return reply(sandro.sendMessage.dono);
        const novaMensagem = `${q}`;
        textobv.texto = novaMensagem
        fs.writeFileSync('./lib/legendabv.json', JSON.stringify(textobv, null, '\t'))
        reply('A mensagem de boas-vindas foi alterada com sucesso.');
        break;

case 'welcome':
      case 'bemvindo':
        if (!isGroup) return reply(`SÓ EM GRUPO`)
        if (!isGroupAdmins) return reply(`PRECISA SER ADMININASTROR`)
        if (!isBotGroupAdmins) return reply(`BOT PREPRECISA SER ADMININASTROR`)
        if (Number(args[0]) === 1) {
          if (isWelkom) return reply('Ja esta ativo')
          welkom.push(from)
          fs.writeFileSync('./lib/welkom.json', JSON.stringify(welkom))
          reply(' Ativou com sucesso o recurso de bem vindo neste grupo 📝')
        } else if (Number(args[0]) === 0) {
          if (!isWelkom) return reply('Ja esta Desativado')
          pesquisar = from
          processo = welkom.indexOf(pesquisar)
          while (processo >= 0) {
            welkom.splice(processo, 1)
            processo = welkom.indexOf(pesquisar)
          }
          fs.writeFileSync('./lib/welkom.json', JSON.stringify(welkom))
          reply('‼️ Desativou com sucesso o recurso de bemvindo neste grupo✔️')
        } else {
          reply("1 para ativar, 0 para desativar")
        }
        break
        
 case 'carro': //by brutality 
 if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
    try {
        const carros = [
            { carro: "Fusca", emoji: "🚗" },
            { carro: "Civic", emoji: "🚙" },
            { carro: "Mustang", emoji: "🏎️" },
            { carro: "Ferrari", emoji: "🚘" },
            { carro: "Lamborghini", emoji: "🚀" },
            { carro: "Kombi", emoji: "🚌" },
            { carro: "BMW", emoji: "🚙" },
            { carro: "Porsche", emoji: "🚗" },
            { carro: "Gol", emoji: "🚗" },
            { carro: "Chevette", emoji: "🚙" },
            { carro: "Tesla", emoji: "🔋" },
            { carro: "Audi", emoji: "🚘" },
            { carro: "McLaren", emoji: "🏎️" },
            { carro: "Jeep", emoji: "🚙" },
            { carro: "Corvette", emoji: "🚗" },
            { carro: "Chrysler 300C", emoji: "🚓" },
            { carro: "Pajero", emoji: "🚙" },
            { carro: "Camaro", emoji: "🏁" },
            { carro: "Fiat Uno", emoji: "🚗" },
            { carro: "Chevrolet Tracker", emoji: "🚙" }
        ];

        const carroEscolhido = carros[Math.floor(Math.random() * carros.length)]; // Escolhendo um carro aleatório

        const mensagem = `
🚗 *SEU CARRO DE BOSTA É:* 🚗
━━━━━━━━━━━━━━━━━━━━
🛣️ *Carro escolhido:* ${carroEscolhido.carro} ${carroEscolhido.emoji}
💨 *Agora é só acelerar e sair por aí, cuidado com o radar!*
━━━━━━━━━━━━━━━━━━━━
😂 *Seu carro é rápido ou só no meme mesmo?* 😜
        `;
        reply(mensagem);
    } catch (error) {
        console.error(error);
        reply("❌ *Opa, deu erro ao sortear o carro! Tenta de novo!* ❌");
    }
break;
 
case 'dar':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
    // Verifica se o usuário forneceu um argumento após o comando
    if (!args[0]) return reply(`Por favor, especifique o que deseja dar. Exemplo: ${prefix}dar abraço`);

    // Captura o que o usuário deseja dar
    const item = args.join(' / ');

    // Envia uma mensagem confirmando a ação
    reply(`🥵 Você deu um(a) *${item}*  bem gostoso(a)!`);
    break;

case 'abraço': case 'abraçar':  
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if(!isGroup) return reply("so em grupo")
if(!menc_os2 || menc_jid2[1]) await reply('marque o alvo que você quer abraçar, a mensagem ou o @')
sandro.sendMessage(from, {video: {url: `https://files.catbox.moe/3cm852.mp4` }, gifPlayback: true, caption: `Você acabou de abraçar a(o) @${menc_os2.split('@')[0]} com amor♥️💞`, mentions: [menc_os2]}, {quoted: selo})
break

case 'figurinha': case 's': case 'stickergifp': case 'figura': case 'f': case 'figu': case 'st': case 'stk': case 'fgif': case "sticker":

{
(async function () {
var legenda = q ? q?.split("/")[0] : `╼⊳⊰ Solicitado Por:
╼⊳⊰ Bot:
╼⊳⊰ Dono:`
var autor = q ? q?.split("/")[1] : q?.split("/")[0] ? '' : `${pushname}
${botName}
${donoName}`
if (isMedia && !info.message.videoMessage || isQuotedImage) {
var encmedia = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'image')
fs.writeFileSync(rane, buffimg)
rano = getRandom('.webp')
exec(`ffmpeg -i ${rane} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 800:800 ${rano}`, (err) => {
fs.unlinkSync(rane)
// "android-app-store-link": "https://play.google.com/store/search?q=%2B55%2094%209147-2796%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5&c=apps",
var json = {
"sticker-pack-name": legenda,
"sticker-pack-publisher": autor
}
var exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
var jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
var exif = Buffer.concat([exifAttr, jsonBuff])
exif.writeUIntLE(jsonBuff.length, 14, 4)
let nomemeta = Math.floor(Math.random() * (99999 - 11111 + 1) + 11111)+".temp.exif"
fs.writeFileSync(`./${nomemeta}`, exif) 
exec(`webpmux -set exif ${nomemeta} ${rano} -o ${rano}`, () => {
sandro.sendMessage(from, {sticker: fs.readFileSync(rano)}, {quoted: selo})
fs.unlinkSync(nomemeta)
fs.unlinkSync(rano)
})
})
} else if (isMedia && info.message.videoMessage.seconds < 11 || isQuotedVideo && info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 35) {
var encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
rano = getRandom('.webp')
await ffmpeg(`./${rane}`)
.inputFormat(rane.split('.')[1])
exec(`ffmpeg -i ${rane} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 200:200 ${rano}`, (err) => {
fs.unlinkSync(rane)
let json = {
"sticker-pack-name": legenda,
"sticker-pack-publisher": autor
}
let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
let jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
let exif = Buffer.concat([exifAttr, jsonBuff])
exif.writeUIntLE(jsonBuff.length, 14, 4)
let nomemeta = "temp.exif"
fs.writeFileSync(`./${nomemeta}`, exif) 
exec(`webpmux -set exif ${nomemeta} ${rano} -o ${rano}`, () => {
sandro.sendMessage(from, {sticker: fs.readFileSync(rano)}, {quoted: selo})
fs.unlinkSync(nomemeta)
fs.unlinkSync(rano)
})
})
} else {
reply(`Você precisa enviar ou marcar uma imagem ou vídeo com no máximo 10 segundos`)
}
})().catch(e => {
console.log(e)
reply("Hmm deu erro")
try {
if (fs.existsSync("temp.exif")) fs.unlinkSync("temp.exif");
if (fs.existsSync(rano)) fs.unlinkSync(rano);
if (fs.existsSync(media)) fs.unlinkSync(media);
} catch {}
})
}
break

case 'papof':
case 'regraspp':  
if(!isGroupAdmins) return reply(resposta.adm())
txtz = `【᯽𒋨📷:𝑆𝑒 𝑎𝑝𝑟𝑒𝑠𝑒𝑛𝑡𝑒𝑚 𝑙𝑖𝑥𝑜𝑠🌚»°】
𒋨·࣭࣪̇🔥ɴᴏᴍᴇ:
𒋨·࣭࣪̇🔥ɪᴅᴀᴅᴇ:
𒋨·࣭࣪̇🔥ʀᴀʙᴀ:
*Aᴘʀᴇsᴇɴᴛᴇ-sᴇ sᴇ ǫᴜɪsᴇʀ.*
𝙏𝘼𝙂𝙎➭᜔ׂ࠭ ⁸₈⁸|𝟖𝟖𝟖|𝟠𝟠𝟠| ེི⁸⁸⁸
 ──╌╌╌┈⊰★⊱┈╌╌╌┈─
❌ ENTROU NO 
GRUPO INTERAJA, NÃO PRECISAMOS DE ENFEITES,INATIVOS SERAO REMOVIDOS ❌* 

/﹋<,︻╦╤─ ҉ - -----💥 
/﹋ 🅴 🅱🅴🅼 🆅🅸🅽🅳🅾 🆂🅴🆄🆂 🅵🅸🅻🅷🅾🆂 🅳🅰 🅿🆄🆃🅰`
sandro.sendMessage(from, {text: txtz}, {quoted: selo})
break

case 'digt':
bla = `🔥↯𝐉𝐀 𝐄𝐍𝐓𝐑𝐀 𝐃𝐈𝐆𝐈𝐓𝐀𝐍𝐃𝐎 𝚽𝐈 ↯°🌚💕
           ི⋮ ྀ🌴⏝ ི⋮ ྀ🚸 ི⋮ ྀ⏝🌴 ི⋮ ྀ 

🐼🍧↯𝖠𝖰𝖴𝖨 𝖵𝖮𝖢𝖤̂ 𝖯𝖮𝖣𝖤 𝖲𝖤𝖱↯🍧🐻
ㅤㅤㅤㅤ  ◍۫❀⃘࣭࣭࣭࣭ٜꔷ⃔໑࣭࣭ٜ⟅◌ٜ🛸◌⟆࣭࣭ٜ໑⃕ꔷ⃘࣭࣭࣭࣭ٜ❀۫◍ི࣭࣭࣭࣭ ུ
    【✔】ᴘʀᴇᴛᴀ👩🏾‍🦱 【✔】ʙʀᴀɴᴄᴀ👩🏼
    【✔】ᴍᴀɢʀᴀ🍧【✔】ɢᴏʀᴅᴀ🍿
    【✔】ᴘᴏʙʀᴇ🪙 【✔】ʀɪᴄᴀ💳
    【✔】ʙᴀɪᴀɴᴀ💌【✔】ᴍᴀᴄᴏɴʜᴇɪʀᴀ🍁
    【✔】ᴏᴛᴀᴋᴜ🧧【✔】ᴇ-ɢɪʀʟ🦄
    【✔】ʟᴏʟɪ🍭    【✔】ɢᴀᴅᴏ🐃
    【✔】ɢᴀʏ🏳️‍🌈     【✔】ʟᴇsʙɪᴄᴀ✂️
    【✔】ᴠᴀᴅɪᴀ💄  【✔】ᴛʀᴀᴠᴇᴄᴏ🍌
                【✔】ɴɪɴɢᴜᴇᴍ ʟɪɢᴀ📵
. ☪︎ • ☁︎. . •.
【 𝐕𝐄𝐌 𝐆𝐀𝐋𝐄𝐑𝐀, 𝐒𝐄 𝐃𝐈𝐕𝐄𝐑𝐓𝐈𝐑 𝐄 𝐅𝐀𝐙𝐄𝐑 𝐏𝐀𝐑𝐓𝐄 𝐃𝐀 𝐅𝐀𝐌𝐈𝐋𝐈𝐀.】🥂`
sandro.sendMessage(from, {text: bla}, {quoted: selo})
break

case 'sairdogp':
if(!isCreator)return reply(resposta.dono())  
if(!q) return reply(`Você deve visualizar o comando ${prefix}listagp e olhar de qual o grupo quer sair, e veja a numeração dele, e só digitar\nExemplo: ${prefix}sairdogp 0\nesse comando é para o bot sair do grupo que deseja..`)
var getGroups = await sandro.groupFetchAllParticipating()
var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
var ingfoo = groups.map(v => v)
try {
sandro.sendMessage(ingfoo[q].id, {text: "Irei sair do grupo, por ordem de gebe, adeus..."}) 
setTimeout(() => {
sandro.groupLeave(ingfoo[q].id)
}, 5000)
} catch(erro) {
reply(String(erro))
}
reply("Pronto gebe, sair do grupo que você queria, em caso de dúvidas acione o comando listagp pra verificar..")
break

case 'shota':///cases by Pedrozz_Mods
reply(`Estarei te enviando no seu privado ${pushname}`)
sandro.sendMessage(sender,
 {image: {url: `https://pedrozz-api.onrender.com/shota?apikey=pedrozz13`}}, 
{quoted: selo})
break

case 'correio':
                {
                if (isPremium) return reply(resposta.premium)
                    txt = args.join(" ")
               if (!txt) return reply(`Exemplo: ${prefix + command} +55 00.../Oi amor, sdds`)
                    let txt1 = txt.split("/")[0].replace(/\D/g, '');
                    let txt2 = txt.split("/")[1];
                    if (!txt1) return reply('cade o numero, contado da pessoa?🤔')
                    if (!txt2) return reply('ta faltando nada ai não?, cade a mensagem de texto que quer que eu envie?🤔')
                    let [result] = await sandro.onWhatsApp(txt1)
                    if (!result) return reply(`NÃºmero invÃ¡lido`)
                    bla =`‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
oie ${pushname}, Como você esta?*                   
*Sou a ${botName}*

*só tou passando pra dizer que*
*me mandaram lhe falar:*👇
*⊰᯽⊱════❖•ೋ°△°ೋ•❖════⊰᯽⊰*            
👉 *${txt2}*     
*⊰᯽⊱════❖•ೋ°△°ೋ•❖════⊰᯽⊰* 
                      
⊰᯽⊱═══❖•ೋ°△°ೋ•      
*CORREIO ANONIMO😁*
⊰᯽⊱═══❖•ೋ°△°ೋ•\n\n> by: gebe modz
`
 sandro.sendMessage(result.jid, { text: bla }, {quoted: selo})
reply(`*Mensagem enviada com sucesso para wa.me/${result.jid.split("@")[0]}*`)
  } break

case 'clima':
case 'tempo':
if (args.length < 1) return reply(`*Sintaxe correta para uso:* ${prefix + command} cidade\n• Caso tenha algum acento, retire ok?`)
cidade = body.slice(7)
clima = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=548b8266f19038cfd1f6d6f007d8bc58&units=metric&lang=pt_br`)
if (clima.error) return reply(clima.error)
hora1 = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
jr = `╭━『⛈️ 𝐓𝐄𝐌𝐏𝐎/𝐂𝐋𝐈𝐌𝐀 ⌛』━╮
│ೋ❀🌡️ 𝘈𝘨𝘰𝘳𝘢⧽ ${clima.data.main.temp}ºC
│ೋ❀🏙️ 𝘊𝘪𝘥𝘢𝘥𝘦⧽ ${clima.data.name}
│ೋ❀🔺 𝘛𝘦𝘮𝘱. ??𝘢́𝘹𝘪𝘮𝘢⧽ ${clima.data.main.temp_max}°C
│ೋ❀🔻 𝘛𝘦𝘮𝘱. 𝘔𝘪́𝘯𝘪𝘮𝘢⧽ ${clima.data.main.temp_min}°C
│ೋ❀🌦️ 𝘊𝘭𝘪𝘮𝘢⧽ ${clima.data.weather[0].description}
│ೋ❀💧 𝘜𝘮𝘪𝘥𝘢𝘥𝘦 𝘥𝘰 𝘈𝘳⧽ ${clima.data.main.humidity}%
│ೋ❀🌬️ 𝘝𝘦𝘯𝘵𝘰𝘴⧽ ${clima.data.wind.speed}  
╰━━━━━━━━━━〔 ${hora1} 〕`
await sandro.sendMessage(from, {text: jr}, {quoted:selo, contextInfo: {"mentionedJid": jr}})	
break

case "tag":
case "hidetag":
if (!isGroup) return reply("*OPS, SO PODE SER USADO EM GRUPOS*")
if (!isGroupAdmins) return reply("*SAI DAI MACACO SEM ADM, SO ADM PODE USAR VEY*")
if (args.length < 1) return reply(`Ai ce mi quebra, usando o comando "${body}" sem dizer o que tenho que avisar
> use assim: exemplo: ${prefix}hidetag oi`)
let mem = _.map(groupMembers, "id")
let options = {
  text: q,
  mentionedJid: mem,
  quoted: selo
}
sandro.sendMessage(from, options)
break

case "limpar":
if (!isGroup) return reply("*OPS, SO PODE SER USADO EM GRUPOS*")
if (!isGroupAdmins) return reply("SAI DAI MACACO SEM ADM, SO ADM PODE USAR VEY*")
if (!isBotGroupAdmins) return reply(`*${botName} precisa de adm 🥺*`)
 reply(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nn\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n🗑️
❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ Cᴏɴᴄʟᴜɪ́ᴅᴀ* ✅`)
break

case "ppt":
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if(args.length < 1) return reply(`Você deve digitar ${prefix}ppt pedra, ${prefix}ppt papel ou ${prefix}ppt tesoura`)
ppt = ["pedra", "papel", "tesoura"]
ppy = ppt[Math.floor(Math.random() * ppt.length)]
ppg = Math.floor(Math.random() * 1) + 10
pptb = ppy
if((pptb == "pedra" && args == "papel") ||
(pptb == "papel" && args == "tesoura") ||
(pptb == "tesoura" && args == "pedra")) {
var vit = "vitoria"
} else if((pptb == "pedra" && args == "tesoura") ||
(pptb == "papel" && args == "pedra") ||
(pptb == "tesoura" && args == "papel")) {
var vit = "derrota"
} else if((pptb == "pedra" && args == "pedra") ||
(pptb == "papel" && args == "papel") ||
(pptb == "tesoura" && args == "tesoura")) {
var vit = "empate"
} else if(vit = "undefined") {
return reply(`Você deve digitar ${prefix}ppt pedra, ${prefix}ppt papel ou ${prefix}ppt tesoura`)
}
if(vit == "vitoria") {
var tes = "Vitória do jogador"
}
if(vit == "derrota") {
var tes = "A vitória é do BOT"
}
if(vit == "empate") {
var tes = "O jogo terminou em empate"
}
reply(`${botName} jogou: ${pptb}\nO jogador jogou: ${args}\n\n${tes}`)
break

case 'join': case 'entrar':
if(!isCreator) return reply(sandro.sendMessage.isCreator)
string = args.join(' ')
if(!string) return reply('Insira um link de convite ao lado do comando.')
if(string.includes('chat.whatsapp.com/') || reply('Ops, verifique o link que você inseriu.') ) {
link = string.split('app.com/')[1]
try {
conn.groupAcceptInvite(`${link}`)
} catch(erro) {
if(String(erro).includes('resource-limit') ) {
reply('O grupo já está com o alcance de 257 membros.')
}
if(String(erro).includes('not-authorized') ) {
reply('Não foi possível entrar no grupo.\nMotivo: Banimento.')
}
}
}
break

case 'only1': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only1 = `
Luiz russo (mansão maromba)
⌠🌐⌡> https://t.me/+8cJ7yGnq5fI2YjYx
`
sandro .sendMessage(sender, {text: only1}, {quoted: selo})
break

case 'only2': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only2 = `
Luiza blue 
⌠🌐⌡> https://t.me/+JaX8wY_45843ZTBh
`
sandro .sendMessage(sender, {text: only2}, {quoted: selo})
break

case 'only3': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only3 = `
Isadora vale 
⌠🌐⌡> https://t.me/+smb4i0bxRl41ZjRh
`
sandro .sendMessage(sender, {text: only3}, {quoted: selo})
break

case 'only4': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only4 = `
Ingrid bianchi
⌠🌐⌡> https://t.me/+RJtf2TqTQ8NjZjlh
`
sandro .sendMessage(sender, {text: only4}, {quoted: selo})
break

case 'only5'://${botName}  
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only5 = `
Lizy Donato 
⌠🌐⌡> https://t.me/+gmSjm2WZnb41OGEx
`
sandro .sendMessage(sender, {text: only5}, {quoted: selo})
break

case 'only6': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only6 = ` 
Feh Galvão
⌠🌐⌡> https://t.me/+naeQ1pp8ajswMjgx
`
sandro .sendMessage(sender, {text: only6}, {quoted: selo})
break

case 'only7': //${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only7 = `
Tatyzack
⌠🌐⌡> https://t.me/+NvglGFhOLSY5NmZ
`
sandro .sendMessage(sender, {text: only7}, {quoted: selo})
break

case 'only8'://${botName}  
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only8 = `
Ayrla Souza 
⌠🌐⌡> https://t.me/+XLziPd47MWo2N2Y
`
sandro .sendMessage(sender, {text: only8}, {quoted: selo})
break

case 'only9'://${botName} 
if(!isPremium) return reply(resposta.premium)
reagir(from, "🤭")
reply(`*Acabei de te enviar no PV 🤭*`)
only9 = `
ALINE FARIA
⌠🌐⌡> https://t.me/+j1xp_hmXrx5lZWMx
`
sandro .sendMessage(sender, {text: only9}, {quoted: selo})
break

case 'openai':
case 'chatgpt2':
const SANDROAPI = SANDROAPI 
try {
  if (!q) return reply(`${prefix}gpt2 pergunte algo...`);
  reply("Pensando...");
  const { data } = await axios.get(`https://sandroapi.site/api/openai?apikey=${SANDROAPI}&q=${encodeURIComponent(q)}`);
  if (!data.result) return reply("Não foi possível obter uma resposta.");
  reply(data.result);
} catch (e) {
  console.error("Erro no ChatGPT:", e);
  reply("Erro ao tentar se comunicar com a IA.");
}
break;

case 'gemini':
try {
if (!q) {
return await reply("Você esqueceu de perguntar ao lado do comando.", {reagir: '🧠'})
}
let { key } = await sandro.sendMessage(from, {text: `Estou processando a resposta de sua pergunta, *isso pode levar alguns segundos*! Aguarde...️`}, {quoted: selo})
let api = await axios.get(`https://nodz-apis.com.br/api/inteligencias/gemini?query=${encodeURIComponent(q)}&apiKey=4e61f806bcc08aa4441fec7602a59092`)
return sandro.sendMessage(from, {text: api.data.resultado, edit: key});
} catch (error) { 
console.error(error)
return reply(`Ocorreu um erro ao processar a solicitação.`, {reagir: "❌"})
}
break;

case 'getcase2':
case 'puxarcase2'://FEITA POR H!!
  try {//CANAL: https://whatsapp.com/channel/0029Vb9odHa002T9NBh4kL0j
if (!isCreator && !isnit) return reply(enviar.msg.donosmt)
if (!q.includes('|')) return reply(`Use o formato: ${prefix}getcase2 559999999|nome da case`);

var [numbr, nomeCase] = q.split('|')
number = numbr.replace(/\D/g, '') + '@s.whatsapp.net'
if (!nomeCase) return reply('Informe o nome da case.')
await reply('- Buscando e enviando a case...')
const getCase = (cases) => {
return 'case ' + `'${cases}'` + fs.readFileSync("./index.js").toString().split("case '" + cases + "'")[1].split("break")[0] + "break"
}

await sleep(500)
await sandro.sendMessage(number, { text: `${getCase(nomeCase.trim())}//by: yuno-Bot && h` }, { quoted: selo })
await reply(`Case *${nomeCase.trim()}* enviada para o número *${number.split('@')[0]}*!`)
} catch (e) {
 return reply('❌️ Comando não encontrado ou erro ao enviar! ❌')
}//Canal: https://whatsapp.com/channel/0029Vb9odHa002T9NBh4kL0j
break

case 'rankhetero':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")

                if (!isGroup) return reply(`Só pode ser utilizado este comando, em grupo.`)
                var porcentagem = `${Math.floor(Math.random() * 105)}`
                membr = []
                const hetero1 = groupMembers
                const hetero2 = groupMembers
                const hetero3 = groupMembers
                const hetero4 = groupMembers
                const hetero5 = groupMembers
                var porcent = porcentagem[Math.floor(Math.random() * porcentagem.length)]
                var porcent2 = porcentagem[Math.floor(Math.random() * porcentagem.length)]
                var porcent3 = porcentagem[Math.floor(Math.random() * porcentagem.length)]
                var porcent4 = porcentagem[Math.floor(Math.random() * porcentagem.length)]
                var porcent5 = porcentagem[Math.floor(Math.random() * porcentagem.length)]
                const heteros1 = hetero1[Math.floor(Math.random() * hetero1.length)]
                const heteros2 = hetero2[Math.floor(Math.random() * hetero2.length)]
                const heteros3 = hetero3[Math.floor(Math.random() * hetero3.length)]
                const heteros4 = hetero4[Math.floor(Math.random() * hetero4.length)]
                const heteros5 = hetero5[Math.floor(Math.random() * hetero5.length)]
                rankzinhetero = `
*Esses são os Héteros💥 do grupo:*\n${groupName}\n
*╭────────────*
*│* 💥 @${heteros1.id.split('@')[0]}
*│➥ ${porcent} Hétero Comum*
*│* 💥 @${heteros2.id.split('@')[0]}
*│➥ ${porcent2} Hétero Mandrake*
*│* 💥 @${heteros3.id.split('@')[0]}
*│➥ ${porcent3} Hétero Curioso*
*│* 💥 @${heteros4.id.split('@')[0]}
*│➥ ${porcent4} Hétero Top*
*│* 💥 @${heteros5.id.split('@')[0]}
*│➥ ${porcent5} Hétero Cis*
*╰────────────*
\n${botName}`
                membr.push(heteros1.id)
                membr.push(heteros2.id)
                membr.push(heteros3.id)
                membr.push(heteros4.id)
                membr.push(heteros5.id)
                sandro.sendMessage(from, { text: rankzinhetero, mentionedJid: membr }, { quoted: selo})
                break
                
    

case 'dado':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
await reply(`🎲 Rolando o dado... Aguarde!`);
const endjhockers = [
        { "url": "https://i.ibb.co/zmVD85Z/53025f3f00f8.webp", "no": 6 },
        { "url": "https://i.ibb.co/BchBsJ1/0b7b4a9b811d.webp", "no": 5 },
        { "url": "https://i.ibb.co/25Pf1sY/a66d2b63f357.webp", "no": 4 },
        { "url": "https://i.ibb.co/hccTrhd/5b36dd6442b8.webp", "no": 3 },
        { "url": "https://i.ibb.co/9tPHPDt/544dbba5bb75.webp", "no": 2 },
        { "url": "https://i.ibb.co/y040HHw/3e583d6459e6.webp", "no": 1 }
    ];
function tem_dado_em_casa_kkk(array) {
return array[Math.floor(Math.random() * array.length)];
    }
var HRicky = tem_dado_em_casa_kkk(endjhockers);
await sandro.sendMessage(from, { sticker: { url: HRicky.url } }, { quoted: selo });
await reply(`🎲 O dado parou! ${pushname}O número sorteado foi *${HRicky.no}*! 🎉`);
break;

case 'boquete':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if (!isGroup) return reply('Só em Grupo')
if (JSON.stringify(donoNumber).indexOf(menc_os2) >= 0) return reply(`Opa gostosa no meu dono não sua puta, Mas posso fuder você 😈`)
reagir(from, "🍼");//by tzn
if(!menc_os2 || menc_jid2[1]) await reply('*qual foi do bagulho? CADE O @*')
sandro.sendMessage(from, {video: {url: `https://files.catbox.moe/w332co.mp4`}, gifPlayback: true, caption: ` *_O @${pushname} 🍼 MAMOU GOSTOSINHO NO:_*
A PIKA DE @${menc_os2.split("@")[0]} 🍼`, mentions: [menc_os2]}, {quoted: selo})
break;

case 'venomlogo1'://toshiruz dev 
try {//api venom apis
if (args.length < 1) return reply('Qual o nome?');
const teks = body.slice(7);
if (teks.length > 10) return reply('O texto é longo, máximo 10 caracteres.');
reply('*Estou fazendo, se der erro tente novamente ✓*');
const toshiruz = await getBuffer(`https://lollityp.sirv.com/venom_api.jpg?text.0.text=${encodeURIComponent(teks)}&text.0.color=000000&text.0.font.family=Pacifico&text.0.font.weight=600&text.0.background.color=ffffff&text.0.outline.color=ffffff&text.0.outline.width=10&text.0.outline.blur=17`);
await sandro.sendMessage(from, { image: toshiruz }, { quoted: selo });
} catch (e) {
console.error('Erro no comando venom1:', e);
reply('Ocorreu um erro ao gerar a imagem. Tente novamente.');
}
break;

case 'punheteiro':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
               try {
	if (!isGroup) return reply(`SÃ³ pode ser utilizado este comando, em grupo.`)
	const aleta = `${Math.floor(Math.random() * 105)}`
	const riasMencionar = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender || null;
	reply(`Pesquisando a sua ficha de punheteiro :\n@${riasMencionar.split("@")[0]} aguarde...`)
	await delay(5000)
	punheteiroleg = `Sua Porcentagem ( @${riasMencionar.split("@")[0]} )\nde punheteiro r de : ${aleta}%`
	sandro.sendMessage(from, {
		image: {
			url: "https://telegra.ph/file/ae026596be46f740c2156.jpg"
		},
		caption: punheteiroleg,
		mentions: [riasMencionar ]
	}, {
		quoted: selo
	})
} catch (e) {
	console.error(e);
	reply("Houve um problema ao executar o comando!");
}
break;

	case 'lindo':
case 'linda':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
  if (!isGroup) return reply(`so pode ser utilizado este comando, em grupo.`)
  const aletc = `${Math.floor(Math.random() * 105)}`
 reply('_Aguarde enquanto eu calculo suas chances de ser lindo(a)_')
 await delay(5000)
   reply(`_Sua Porcentagem De Lindo(a) é de : ${aletc}%_`)
    break
              
case 'listgroup': {//perdi os créditos, desculpa!!

  let teks = '*Lista de todos os grupos em que o bot está:*\n\n'
  let grup = Object.entries(sandro.groupMetadata)
  for (let [id, data] of grup) {
    teks += `*• Nome:* ${data.subject}\n*• ID:* ${id}\n\n`
  }
  let allChats = await sandro.groupFetchAllParticipating()
  for (let id in allChats) {
    let metadata = allChats[id]
    teks += `*• Nome:* ${metadata.subject}\n*• ID:* ${id}\n\n`
  }
  reply(teks.trim())
}
break

case'tt':{
        if (!q) return reply(`𝙀𝙭𝙖𝙢𝙥𝙡𝙚 : ${prefix + command} tutor jadi pacar msbrewc 🎗`)
          let cuki = await fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=kamu%20adalah%20ai%20yang%20tolol%20dan%20lucu%20buatan%20RaldzzXyz&content=${text}`)
          let mamad = cuki.data
          sandro.sendMessage(from, { text : mamad }, {quoted: selo })
      }
      break
      
      


case 'comer3': {
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
	if (!isGroup) return reply("Apenas em grupos")
	if (!menc_os2) return reply("você deve marcar *@* pra eu arrombar o cuzinho");
 cuzinn = "https://files.catbox.moe/58k8xg.mp4";
emojiskk = ["😈","🥵","💦"];
emojiis = emojiskk[Math.floor(Math.random() * emojiskk.length)];
reagir(from, `${emojiis}`);
 comeu = `${Math.floor(Math.random() * 105)}`;
 comi = [`Olá ${pushname}, você acabou de fuder gostosinho o cuzinho do(a) @${menc_os2.split("@")[0]}\nchance de ter gozado dentro foi de ${comeu}%`];
await sandro.sendMessage(from, {video: {url : cuzinn}, gifPlayback: true, caption: comi, mentions: [menc_os2]}, {quoted: selo});
}break; 	

case 'safada':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
const imgsafada = "https://telegra.ph/file/9bd3e6fcc0e8da9939ed6.jpg"
if(!isGroup) return reply("só em grupos")
await sandro.sendMessage(from, {text:`Pesquisando a sua ficha de safada @${sender.split("@")[0]} aguarde...`, mentionedJid: [sender]}, {quoted: selo})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
await sandro.sendMessage(from, {image: {url: imgsafada}, caption: `O quanto *@${sender.split("@")[0]}* pode ser uma pessoa safada?\n• A porcentagem de chance é *${random}%*`, mentionedJid: [sender]}, {quoted: selo})
}, 2000)
break
//========
case "safado":
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if(!isGroup) return reply("só em grupos")
reply(`Pesquisando a sua fica de safado @${sender.split("@")["0"]}, aguarde..`)
await sleep(1000)
var jpcomeuvc = `${Math.floor(Math.random() *100)}`
await sandro.sendMessage(from, {image: {url: imgsafado}, caption: `*_@${sender.split("@")[0]}, vc é ${jpcomeuvc}% safado_*`}, {quoted: selo});
break;

case 'instagram':
try {
if(q.length < 5) return reply(`Exemplo: ${prefix+command} o link`);
reply(enviar.espere)
ABC = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/instagram?url=${q.trim()}&apikey=${YUNOBOT}`)
let DM_T = ABC.msg[0].type
var A_T = DM_T === "mp4" ? "video/mp4" : DM_T === "webp" ? "image/webp" : DM_T === "jpg" ? "image/jpeg" : DM_T === "mp3" ? "audio/mpeg" : "video/mp4"
sandro.sendMessage(from, {[A_T.split("/")[0]]: {url: ABC.msg[0].url}, mimetype: A_T}, {quoted: selo}).catch(e => {
return reply("Erro..")
})
} catch (e) {
return reply("Erro..")
}
break;

const YUNOZIN = "Jpzinh";



/* *COMANDOS DE ADMINISTRAÇÃO* 
• Lembre-se de alterar o client.
• Eu tenho uma function de erro, que se chama "encamError", tirem ela ou crie. 
O meu 'args[0]' está definido como "sz" troquem por "q" ou defina fora do switch, só usar:
const sz = args[0]
Também, podem usar seus nicks ou de suas butecas. 
*/

//ban por ddd
case 'banddd': 
if(!isGroup) return reply(sandro.sendMessage.grupo)
if(!isGroupAdmins) return reply(sandro.sendMessage.adm)
if(!isBotGroupAdmins) return reply(sandro.sendMessage.botAdm)
if (!q) return reply('⚠️ Por favor, forneça o DDD que deseja remover.');
const ddd = q.trim();
const dddNumber = parseInt(ddd, 10);
if (isNaN(dddNumber) || dddNumber < 11 || dddNumber > 99) {
    return reply('😠 Você acha que sou besta? Só aceito DDDs de 11 a 99.');}
const groupMetadata = await sandro.groupMetadata(from)   ? await Promise.race([
 sandro.groupMetadata(from).catch((e) => null), 
 new Promise((resolve) => setTimeout(() => resolve(null), 5000))
])
: null;
const participantss = groupMetadata.participants
const participantesParaRemover = participantss
    .filter(participant => {
        const phoneNumber = participant.id.split('@')[0];
        return phoneNumber.startsWith(`55${ddd}`);
    })
    .map(participant => participant.id);
if (participantesParaRemover.length === 0) {
    return reply(`⚠️ Nenhum participante encontrado com o DDD ${ddd}.`);}
try {
    await sandro.groupParticipantsUpdate(from, participantesParaRemover, 'remove');
    reply(`✅ Todos os participantes com o DDD ${ddd} foram removidos com sucesso.`);
} catch (error) {
    console.error("Erro ao remover participantes:", error);
    encamError();}
break;

//Ban por número fake (qualquer um que não comece com +55)
case 'banfakes':
case 'banmrfake': { 
if(!isGroup) return reply(sandro.sendMessage.grupo)
if(!isGroupAdmins) return reply(sandro.sendMessage.adm)
if(!isBotGroupAdmins) return reply(sandro.sendMessage.botAdm)
  const groupMetadata = await sandro.groupMetadata(from);
  const participants = groupMetadata.participants;
  const participantsToBan = participants
      .filter(participant => !participant.id.startsWith('55'))
      .map(participant => participant.id);

  if (participantsToBan.length === 0) {
      return reply('⚠️ Todos os participantes têm números começando com 55. Nenhum participante foi banido.');}
  try {
      await sandro.groupParticipantsUpdate(from, participantsToBan, 'remove');
      reply(`✅ Todos os participantes com números internacionais foram removidos com sucesso.`);
  } catch (error) {
      console.error("Erro ao remover participantes:", error);
      encamError();
  }
break;}

case "newcase":
  if (!isCreator) return reply("❌ Comando exclusivo para o dono.");

  const novoCase = body.slice(command.length + 1).trim();

  if (!novoCase.startsWith("case ") || !novoCase.includes("break")) {
    return reply("❌ O código precisa conter 'case' no início e um 'break' para fechar.");
  }
  try {
    fazerBackupIndex();

    const indexPath = "./index.js";
    const indexAtual = fs.readFileSync(indexPath, "utf-8");

    const posDefault = indexAtual.lastIndexOf("default:");
    if (posDefault === -1) return reply("❌ Não foi possível encontrar o trecho 'default:' para inserir o novo case.");

    const novoIndex = indexAtual.slice(0, posDefault) +
                      `\n\n${novoCase}\n` +
                      indexAtual.slice(posDefault);

    fs.writeFileSync(indexPath, novoIndex);

    reply("✅ Novo case adicionado com sucesso! Reiniciando bot...");
    setTimeout(() => process.exit(0), 1000);
  } catch (e) {
    console.error(e);
    reply("❌ Erro ao adicionar nova case.");
  }
  break;

case 'setfotogp':
case 'fotogp':  
if(!isGroup) return reply(resposta.grupo())
if(!isGroupAdmins) return reply(resposta.adm())
if(!isBotGroupAdmins && !isCreator) return reply(resposta.botadm)
if(!isQuotedImage) return reply(`Use: ${prefix + command} <Marque uma foto>`)
ftgp = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage
rane = getRandom('.'+await getExtension(ftgp.mimetype))
buffimg = await getFileBuffer(ftgp, 'image')
fs.writeFileSync(rane, buffimg)
medipp = rane 
sandro.updateProfilePicture(from, {url: medipp})
reply(`Foto do grupo alterada com sucesso`) 
break

case 'traduzir':
case 'tradutor':{
 if (!q) {//by: jpzinh, canal: https://whatsapp.com/channel/0029VbASCMXFCCoSxDWWVi24
await reply(`❌ Use assim:\n\nExemplo:\n${prefix+command} pt cat`);
return;
};
 const JpzinhV = q.split(' ')[0].toLowerCase();
 const Shizukuh = q.replace(JpzinhV, '').trim();

if (!Shizukuh|| !JpzinhV) {//https://whatsapp.com/channel/0029VbASCMXFCCoSxDWWVi24
await reply(`❌ Formato inválido!\nUse:\n${prefix+command} pt cat`);
return;
 };

await reply(resposta .espere);

try {//https://whatsapp.com/channel/0029VbASCMXFCCoSxDWWVi24
const Vi = await fetchJson(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${JpzinhV}&dt=t&q=${encodeURIComponent(Shizukuh)}`);
const ShizukuTraduz = Vi[0][0][0];
const ShizukuIdioma = Vi[2];

await reply(`🔤 Tradução detectada de *${ShizukuIdioma}* para *${JpzinhV}*:\n\n${ShizukuTraduz}`);
 } catch (e) {
console.log('Error:', e);
 await reply('❌ Ocorreu um erro ao tentar traduzir. Verifique se o código do idioma está correto e tente novamente!');
 };
break;
};

case 'marukarv': { 
	if (!isPremium) return reply(resposta.premium)

await reagir(from, "😈");
  await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 40) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/MaruKarv/%20${numb}.jpg` };
    const mag = '🔞MaruKarv??';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'netersg': {
if (!isPremium) return reply(resposta.premium)

await reagir(from, "😈");
  await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 30) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/netersg/%20${numb}.jpg` };
    const mag = '🔞netersg🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
 await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'egril18': {
if (!isPremium) return reply(resposta.premium)

  await reagir(from, "😈");
  await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
  
    const numb = Math.floor(Math.random() * 14) + 1;
    const videoUrl = `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/EgrilVideo/%20${numb}.mp4`;
    const caption = '🔞egril🔞';
    
 await sandro.sendMessage(sender, { video: { url: videoUrl }, caption: caption, footer: `${botName}`, headerType: 4 }, { quoted: selo });
}
break;

case 'princesa': {

if (!isPremium) return reply(resposta.premium)
 await reagir(from, "😈");
  await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 32) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/McPrincesa/%20${numb}.jpg` };
    const mag = '🔞McPrincesa🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'carniello': {
if (!isPremium) return reply(resposta.premium)

 await reagir(from, "😈");
  await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 29) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/carniello/%20${numb}.jpg` };
    const mag = '🔞carniello🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'vitacelestine': {
if (!isPremium) return reply(resposta.premium)

 await reagir(from, "😈")
 await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 30) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/VitaCelestine/%20${numb}.jpg` };
    const mag = '🔞Vita Celestine🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo });
}
break;

case 'porno':
case 'onlyfansvideo': {
if (!isPremium) return reply(resposta.premium)

await reagir(from, "😈");
await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 47) + 1;
    const videoUrl = `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/OnlyfansVideo/%20${numb}.mp4`;
       
    await sandro.sendMessage(sender, { video: { url: videoUrl }, footer: `${botName}`, headerType: 4 }, { quoted: selo});
}
break;

case 'marinamui': {
if(!isPremium) return reply(resposta.premium)

await reagir(from, "😈");
 await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 27) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/MarinaMui/%20${numb}.jpg` };
    const mag = '🔞Marina Mui??';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;
case 'laynuniz': {
if (!isPremium) return reply(resposta.premium)

 await reagir(from, "😈");
 await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 25) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/LayNuniz/%20${numb}.jpg` };
    const mag = '🔞Lay Nuniz🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'isawaifu': {
if (!isPremium) return reply(resposta.premium)

await reagir(from, "😈");
 await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 21) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/IsaWaifu/%20${numb}.jpg` };
    const mag = '🔞IsaWaifu🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo});
}
break;

case 'isadoramartinez': {
if (!isPremium) return reply(resposta.premium)
await reagir(from, "😈");
 await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
    const numb = Math.floor(Math.random() * 30) + 1;
    const wew = { url: `https://raw.githubusercontent.com/Herojoii/midiiporno/main/packs/ISADORA%20MARTINEZ/%20${numb}.jpg` };
    const mag = '🔞Isadora Martinez🔞';
    let buttonMessage = {
        image: wew,
        caption: mag,
        footer: `${botName}`,
        headerType: 4,
    };
    await sandro.sendMessage(sender, buttonMessage, { quoted: selo });
}
break;

case 'onlyfans': {
if (!isPremium) return reply(resposta.premium)
await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
 await sandro.sendMessage(sender, {image: {url: "https://world-ecletix.onrender.com/api/onlyfans"}, quoted: selo});
}
break

case 'presentinho':
if (!isPremium) return reply(resposta.premium)
await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
await sandro.sendMessage(sender, {image: {url: "https://world-ecletix.onrender.com/api/atriz"}, quoted: selo})
break

case 'presentinho2':
case 'pack+18': {
if (!isPremium) return reply(resposta.premium)
await reagir(from, `😈`);
await reply(`${isGroup ? "Enviando no seu pv, aguarde..." : "Enviando, aguarde..."}😈`);
sandro.sendMessage(sender, {image: {url: "https://world-ecletix.onrender.com/api/atriz"}, quoted: selo});
}
break
  
  case 'gerarcpf':
if(!isPremium) return reply(resposta.premium)
cp1 = `${Math.floor(Math.random() * 300) + 600}`
cp2 = `${Math.floor(Math.random() * 300) + 600}`
cp3 = `${Math.floor(Math.random() * 300) + 600}`
cp4 = `${Math.floor(Math.random() * 30) + 60}`
cpf = `${cp1}.${cp2}.${cp3}-${cp4}`
sandro.sendMessage(from, {text: `CPF gerado com sucesso : ${cpf}`}, {quoted: selo})
break

case 'ddd':
if(!isPremium) return reply(resposta.premium)
if(args.length < 1) return reply(`Use ${prefix + command} 81`)
ddd = body.slice(5)
ddds = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)
dddlist = `Lista de Cidades de ${ddds.data.state} com este DDD ${q}>\n\n`
for (let i = 0; i < ddds.data.cities.length; i++) { dddlist += `${i + 1} ⪧ *${ddds.data.cities[i]}*\n` }
sandro.sendMessage(from, {text: dddlist}, {quoted: selo})	
break

case 'pau':         
if (isGroup) return reply(resposta.grupo)
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
random = `${Math.floor(Math.random() * 35)}`
const tamanho = random
if (tamanho < 13 ) {pp = 'só a fimose'} else if (tamanho == 13 ) {pp = 'passou da média😳'} else if (tamanho == 14 ) {pp = 'passou da média😳'} else if (tamanho == 15 ) {pp = 'eita, vai pegar manga?'} else if (tamanho == 16 ) {pp = 'eita, vai pegar manga?'} else if (tamanho == 17 ) {pp = 'calma man, a mina não é um poço😳'} else if (tamanho == 18 ) {pp = 'calma man, a mina não é um poço😳'} else if (tamanho == 19 ) {pp = 'calma man, a mina não é um poço😳'} else if (tamanho == 20 ) {pp = 'você tem um poste no meio das pernas'} else if (tamanho == 21 ) {pp = 'você tem um poste no meio das pernas'} else if (tamanho == 22 ) {pp = 'você tem um poste no meio das pernas'} else if (tamanho == 23 ) {pp = 'você tem um poste no meio das pernas'} else if (tamanho == 24 ) {pp = 'você tem um poste no meio das pernas'} else if (tamanho > 25 ) {pp = 'vai procurar petróleo com isso?'
}
safira = `╭═════════════════ ⪩
╰╮ू ፝͜❥⃟🍌𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐃𝐎 𝐏𝐀𝐔👁⃟ू ፝͜❥
╭┤➢☃️ 「𝘖𝘓𝘈: ${pushName}」
╭┤➢🍆「𝘚𝘌𝘜 𝑃𝐴𝑈 𝘛𝘌𝘔: ${random}𝘊𝘔
╭┤➢✉️ 「${pp}」
┃╰══ ⪨
╰═════════════════ ⪨`
reply(safira)
break

case 'chifre':
if (isGroup) return reply(resposta.grupo)
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
random2 = `${Math.floor(Math.random() * 35)}`
const tamanho2 = random2
if (tamanho2 < 13 ) {pp = 'muito corno🤟'} else if (tamanho2 == 13 ) {pp = 'meio corno😬'} else if (tamanho2 == 14 ) {pp = 'muito corno😳'} else if (tamanho2 == 15 ) {pp = 'cuidado com o poste'} else if (tamanho2 == 16 ) {pp = 'vai pegar manga com esse chifre?'} else if (tamanho2 == 17 ) {pp = 'eita poha, levou muita galha em😳'} else if (tamanho2 == 18 ) {pp = 'cuidado com os fios de energia😳'} else if (tamanho2 == 19 ) {pp = 'como você aguenta esse peso todo😳'} else if (tamanho2 == 20 ) {pp = 'recorde de maior chifre, parabéns'} else if (tamanho2 == 21 ) {pp = 'parabéns, belos chifres'} else if (tamanho2 == 22 ) {pp = 'parabéns, belos chifres'} else if (tamanho2 == 23 ) {pp = 'parabéns, belos chifres'} else if (tamanho2 == 24 ) {pp = 'parabéns, belos chifres'} else if (tamanho2 > 25 ) {pp = 'vai construir uma torre com isso?'
}
safira = `╭═════════════════ ⪩
╰╮ू ፝͜❥⃟💡𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐃𝐎 𝐂𝐇𝐈𝐅𝐑𝐄👁⃟ू ፝͜❥
╭┤➢☃️ 「𝘖𝘓𝘈: ${pushName}」
╭┤➢🤟 「𝘚𝘌𝘜 𝘊𝘏𝘐𝘍𝘙𝘌 𝘛𝘌𝘔: ${random2}𝘊𝘔
╭┤➢✉️ 「${pp}」
┃╰══ ⪨
╰═════════════════ ⪨`
reply(safira)
break

case 'gplink':
case 'linkgrupo':
case 'linkgp':
  if (!isGroup) return reply("Este comando só pode ser usado em grupos.");
  if (!isBotGroupAdmins) return reply("Preciso ser um administrador para gerar o link de convite.");
  const linkgc = await sandro.groupInviteCode(from);
  sandro.sendMessage(from, {text: `https://chat.whatsapp.com/${linkgc}\n\nLink do grupo ${groupName}`}, { quoted: selo });
  break;  

case "safado":
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if(!isGroup) return reply("só em grupos")
reply(`Pesquisando a sua fica de safado @${sender.split("@")["0"]}, aguarde..`)
await sleep(1000)
var jpcomeuvc = `${Math.floor(Math.random() *100)}`
await sandro.sendMessage(from, {image: {url: imgsafado}, caption: `*_@${sender.split("@")[0]}, vc é ${jpcomeuvc}% safado_*`}, {quoted: selo});
break;

case 'ping': {
const fotomenu = " https://files.catbox.moe/663yrl.jpg"
if(!isCreator) return enviar(resposta.dono)
await sandro.sendMessage(from, {text: '*𝙲𝚊𝚕𝚌𝚞𝚕𝚊𝚗𝚍𝚘 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚌𝚘𝚎𝚜*'});
//LATÊNCIA DO BOT
r = (Date.now() / 1000) - info.messageTimestamp
//DESEMPENHO DO BOT
let desempenhoBot = 'Rápido';
if (velocidadeBot >= 1.000 && velocidadeBot < 2.000) {
desempenhoBot = 'Razoável';
} else if (velocidadeBot >= 2.000 && velocidadeBot < 4.000) {
desempenhoBot = 'Lento';
} else if (velocidadeBot >= 4.000) {
desempenhoBot = 'Muito Lento';
}
const porcentagemDesempenho = `${desempenhoBot === 'Rápido' ? '100% 🟢' : desempenhoBot === 'Razoável' ? '50% 🟡' : '20% 🔴'}`;

//FOTO DO PING USANDO A API
pingUrl = `${BaseApiDark}/pingcard?perfil=https://files.catbox.moe/asf99y.jpg&backgroundImg=${fotomenu}&speed=${latensi.toFixed(4)}&bot=SAFIRA-PRIVACY&uptime=${formatTime(uptime)}&memory=${totalMemory}&system=${os.type()}&apikey=${API_KEY_NODZ}`
//TEXTO DO PING
const pingResponse = `╭━°𖠁°✮•| ⪧𝐏𝐈𝐍𝐆 𝐃𝐎 𝐁𝐎𝐓⊰ |•✮°𖠁°━╮
┃╭━━━─────━━━╮
┃┝🤖̘̓ͅ᪾⃟⋮⧶ *Versão do Bot:* _${botVersion}_
┃┝🤖̘̓ͅ᪾⃟⋮⧶ *Nome do Bot:* _${botName}_
┃┝👑̘̓ͅ᪾⃟⋮⧶ *Dono do Bot*: _${donoName}_
┃┝⏱️̘̓ͅ᪾⃟⋮⧶ *Velocidade de resposta:* _${latensi.toFixed(4)} segundos._
┃┝⚡̘̓ͅ᪾⃟⋮⧶ *Tempo online do bot:* _${formatTime(uptime)}_
┃┝💻̘̓ͅ᪾⃟⋮⧶ *Sistema Operacional:* _${os.type()}_
┃┝📂̘̓ͅ᪾⃟⋮⧶ *Versão do SO:* _${os.release()}_
┃┝📊̘̓ͅ᪾⃟⋮⧶ *Porcentagem de desempenho:* _${porcentagemDesempenho}_
┃┝💾̘̓ͅ᪾⃟⋮⧶ *Memória RAM total:* _${totalMemory} GB_
┃┝💾̘̓ͅ᪾⃟⋮⧶ *Memória RAM disponível:* _${freeMemory} GB_
┃┝🖥️̘̓ͅ᪾⃟⋮⧶ *Uso da CPU:* _${cpuUsage}%_
┃┝🔄̘̓ͅ᪾⃟⋮⧶ *Threads Ativas:* _${totalThreads}_
┃┝💻̘̓ͅ᪾⃟⋮⧶ *Hospedagem:* _${HostOuNao}_
┃┝🛠️̘̓ͅ᪾⃟⋮⧶ *Versão Node.js:* _${nodeVersion}_
┃┝🖥️̘̓ͅ᪾⃟⋮⧶ *Plataforma:* _${platform}_
┃╰━━━─────━━━╯
╰━°𖠁°✮•| ⪧𝐏𝐈𝐍𝐆 𝐃𝐎 𝐁𝐎𝐓⊰ |•✮°𖠁°━╯`;
//ENVIA AS INFORMAÇÕES PARA O USUÁRIO
await sandro.sendMessage(from, {image: {url: pingUrl}, caption: pingResponse}, {quoted: selo});
}
break;

case 'morte':   
if (isGroup) return reply(resposta.grupo)
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
morrer1 = `${Math.floor(Math.random() * 31)}`
morrer2 = `${Math.floor(Math.random() * 9)}`
var ano = ("2")
ano1 = `${Math.floor(Math.random() * 300)}`
morrer = `${morrer1}.${morrer2}.${ano}${ano1}`
safira = `╭═════════════════ ⪩
╰╮ू ፝͜❥⃟😵𝐃𝐀𝐓𝐀 𝐃𝐀 𝐒𝐔𝐀 𝐌𝐎𝐑𝐓𝐄👁⃟ू ፝͜❥
╭┤➢☃️ 「𝘖𝘓𝘈: ${pushName}」
╭┤➢📆 「𝘋𝘈𝘛𝘈: ${morrer1}/0${morrer2}/${ano}${ano1}
╭┤➢💐 「meus pêsames」
┃╰══ ⪨
╰═════════════════ ⪨`
reply(safira)
break

case 'ia': case 'gpt':
if(!q) return reply("Você esqueceu de perguntar ao lado do comando.")
let { ai } = await sandro.sendMessage(from, {text: `calma ai ${pushname} ja estou trazendo sua respota `}, {quoted: selo})
anu1 = await fetchJson(`https://aemt.me/openai?text=responda em português ao texto: ${q}`)
sandro.sendMessage(from, {
text: `
𝑅𝐸𝑆𝑈𝐿𝑇𝐴𝐷𝑂 𝐷𝐴 𝐼𝐴: CHAT GPT
${anu1.result}
`,
contextInfo: {
mentionedJid: [sender],
externalAdReply: {
showAdAttribution: true,
title: `                GEBE MODZ`,
body: `©GEBEZKZ`,
thumbnailUrl: `https://telegra.ph/file/f8733374b882108490f5f.jpg`,
sourceUrl: `https://chat.whatsapp.com/GhXUAs02wrRKjcjZwtdFlq`,
mediaType: 1,
renderLargerThumbnail: true
}
}
}, {quoted: selo}).catch(e => {
return reply(msg.error())
reagir("❌")
})
break

case "criador":
case "gebe":
//2. Envia o contato (vCard) com as informações do "gebe modz"
  await sandro.sendMessage(from, {
    contacts: {
      displayName: "gebe modz",  // Nome exibido
      contacts: [{
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:gebe modz\nTEL;type=CELL;type=VOICE;waid=558398164308: +55 83 9816 4308\nEND:VCARD`
      }]
    }
  });
  break

case 'nome-bot':
if(!isCreator && !isnit && !info.key.fromMe) return reply(resposta.dono)
config.botName = q
fs.writeFileSync('./dono/dono.js', JSON.stringify(setting, null, 2))
reply(`O nome do bot foi alterado com sucesso para: ${q}`)
setTimeout(async () => {
setTimeout(async () => {
process.exit()
}, 1200)
}, 1000)
break

case 'nick-dono':
if(!isCreator && !isnit && !info.key.fromMe) return reply(resposta.dono) 
config.donoName = q
fs.writeFileSync('./dono/dono.js', JSON.stringify(setting, null, 2))
reply(`O nick do dono foi configurado para: ${q}`)
setTimeout(async () => {
setTimeout(async () => {
process.exit()
}, 1200)
}, 1000)
break

case 'numero-dono':
if(!isCreator && !isnit && !info.key.fromMe) return reply(resposta.dono)  
if(q.match(/[a-z]/i)) return reply("É apenas números..")
reply(`O número dono foi configurado com sucesso para: ${q}`)
config.numeroDono = q
fs.writeFileSync('./dono/dono.js', JSON.stringify(setting, null, 2))
setTimeout(async () => {
setTimeout(async () => {
process.exit()
}, 1200)
}, 1000)
break

case 'nick':
case 'gerarnick':
case 'fazernick':
case 'estilizar':
try {//toshiruz dev 
nick = args.join(' ')
if (!q) return reply(`Escreva um texto para eu estilizar.\n• *Exemplo:* ${prefix+command} toshiruzdev`)
if (ANT_LTR_MD_EMJ(q)) return reply("Não use letras modificadas ou emojis para criar o nick.")
const estilos = [
      (txt) => `『 ${txt.toUpperCase()} 』`,
      (txt) => `• ${txt.toLowerCase()} •`,
      (txt) => `[ ${txt} ]`,
      (txt) => `『★${txt}★』`,
      (txt) => `𓆩 ${txt} 𓆪`,
      (txt) => `꧁༒☬ ${txt} ☬༒꧂`,
      (txt) => `≪ ${txt} ≫`,
      (txt) => `『${txt.split('').join('・')}』`,
      (txt) => `⸻ ${txt} ⸻`,
      (txt) => `${txt.split('').map(l => l + '͜').join('')}`,
    ]
let txt = `• Estilos aplicados ao texto: *${nick}*\n–\n`
estilos.forEach((estilo, i) => { txt += `*${i + 1}.* ${estilo(nick)}\n–\n`})
reply(txt.trim())
} catch (e) { console.log(e)
reply("Erro ao gerar as fontes modificadas ou estilizar seu texto.")
}
break

case 'loja':
case 'lojinha':
  const lojaImg = "https://files.catbox.moe/2wnd4s.jpg";
  await sandro.sendMessage(from, {
    image: { url: lojaImg },
    caption: `🛍️ ╭──〔 🦋✨ *TABELA DE PREÇOS — SAFIRA_PRIVACY* ✨🦋 〕──╮
│ 
│ 🦋 〘 50 ~ 60 membros 〙➟ *R$10* 
│ 🦋 〘 70 ~ 90 membros 〙➟ *R$23* 
│ 🦋 〘100 ~ 120 membros〙➟ *R$30* 
│ 🦋 〘130 ~ 160 membros〙➟ *R$43* 
│ 🦋 〘170 ~ 190 membros〙➟ *R$55* 
│ 🦋 〘+200 membros〙➟ *A combinar* 
│ 
╰────────────────────────────────────────╯ 
╭──〔 ☕️💬 *AVISOS IMPORTANTES* 💬☕️ 〕──╮
│ 
│ 🦋 O projeto *SAFIRA_PRIVACY* está em 
│ constante desenvolvimento. 
│ 
│ 🦋 Bugs ou instabilidades podem ocorrer, 
│ mas serão corrigidos o mais breve possível. 
│ 
│ 🌸 Agradecemos imensamente sua paciência 
│ e confiança durante essa jornada! 
│ 
│ — Com carinho, *gebe Devs* 
│ 
╰──────────────────────────────────────╯ 
╭──〔 🦋✨ *TEXTO DE AGRADECIMENTO* ✨🦋 〕──╮
│ 
│ 🦋 A equipe *SAFIRA_PRIVACY* agradece 
│ imensamente a cada um de vocês 
│ que acredita, apoia e caminha conosco. 
│ 
│ ☕️ Seu apoio é o que nos motiva a evoluir, 
│ mesmo diante dos desafios e ajustes. 
│ 
│ 🌸 Nosso compromisso é entregar sempre 
│ o melhor, com transparência, carinho 
│ e dedicação. 
│ 
│ 🦋 Obrigado por fazer parte dessa jornada! 
│ 
│ — Com amor, *gebe Devs* 
│ 
╰──────────────────────────────────────╯`
  });
  break;
  
case "suporte":
//2. Envia o contato (vCard) com as informações do "gebe modz"
  await sandro.sendMessage(from, {
    contacts: {
      displayName: "foxy",  // Nome exibido
      contacts: [{
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:foxy\nTEL;type=CELL;type=VOICE;waid=559991993622: +55 99 9199-3622 \nEND:VCARD`
      }]
    }
  });
break

case 'salario'://jp
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
    try {
        const salarios = [
            { profissao: "Desenvolvedor de Software", salario: "R$ 8.000,00" },
            { profissao: "Designer Gráfico", salario: "R$ 3.500,00" },
            { profissao: "Médico", salario: "R$ 12.000,00" },
            { profissao: "Professor de Ensino Médio", salario: "R$ 2.800,00" },
            { profissao: "Engenheiro Civil", salario: "R$ 7.500,00" },
            { profissao: "Advogado", salario: "R$ 6.000,00" },
            { profissao: "Dentista", salario: "R$ 9.000,00" },
            { profissao: "Arquiteto", salario: "R$ 5.500,00" },
            { profissao: "Gerente de Marketing", salario: "R$ 10.000,00" },
            { profissao: "Analista de Sistemas", salario: "R$ 4.500,00" },
            { profissao: "Enfermeiro", salario: "R$ 4.000,00" },
            { profissao: "Jornalista", salario: "R$ 3.200,00" },
            { profissao: "Motorista de Caminhão", salario: "R$ 3.000,00" },
            { profissao: "Chef de Cozinha", salario: "R$ 5.000,00" },
            { profissao: "Cabeleireiro", salario: "R$ 2.500,00" },
            { profissao: "Fisioterapeuta", salario: "R$ 4.200,00" },
            { profissao: "Psicólogo", salario: "R$ 4.500,00" },
            { profissao: "Analista de Marketing", salario: "R$ 5.000,00" },
            { profissao: "Assistente Administrativo", salario: "R$ 2.200,00" },
            { profissao: "Recepcionista", salario: "R$ 1.800,00" },
            { profissao: "Estilista", salario: "R$ 3.800,00" },
            { profissao: "Professor Universitário", salario: "R$ 6.500,00" },
            { profissao: "Veterinário", salario: "R$ 7.000,00" },
            { profissao: "Fotógrafo", salario: "R$ 3.200,00" },
            { profissao: "Técnico de Informática", salario: "R$ 2.800,00" },
            { profissao: "Chef de Pâtisserie", salario: "R$ 4.500,00" },
            { profissao: "Arqueólogo", salario: "R$ 4.000,00" },
            { profissao: "Redator Publicitário", salario: "R$ 3.000,00" },
            { profissao: "Sargento", salario: "R$ 4.000,00" },
            { profissao: "Engenheiro de Software", salario: "R$ 8.500,00" },
            { profissao: "Consultor de TI", salario: "R$ 6.000,00" },
            { profissao: "Corretor de Imóveis", salario: "R$ 3.500,00" },
            { profissao: "Guias de Turismo", salario: "R$ 2.500,00" },
            { profissao: "Lixeiro", salario: "R$ 1.800,00" },
            { profissao: "Encanador", salario: "R$ 3.000,00" },
            { profissao: "Pedreiro", salario: "R$ 2.800,00" },
            { profissao: "Consultor de Recursos Humanos", salario: "R$ 5.000,00" },
            { profissao: "Gestor de Projetos", salario: "R$ 7.000,00" },
            { profissao: "Auditor Fiscal", salario: "R$ 9.000,00" },
            { profissao: "Especialista em SEO", salario: "R$ 4.800,00" },
            { profissao: "Técnico em Enfermagem", salario: "R$ 2.800,00" },
            { profissao: "Dublador", salario: "R$ 3.000,00" },
            { profissao: "Analista de Segurança da Informação", salario: "R$ 7.000,00" },
            { profissao: "Analista Financeiro", salario: "R$ 4.500,00" },
            { profissao: "Gestor de TI", salario: "R$ 8.000,00" },
            { profissao: "Desenhista Industrial", salario: "R$ 4.000,00" },
            { profissao: "Técnico de Segurança do Trabalho", salario: "R$ 4.200,00" },
            { profissao: "Padeiro", salario: "R$ 2.400,00" },
            { profissao: "Zelador", salario: "R$ 2.000,00" },
            { profissao: "Contador", salario: "R$ 5.500,00" },
            { profissao: "Analista de Dados", salario: "R$ 6.500,00" },
            { profissao: "Designer de Interiores", salario: "R$ 4.000,00" },
            { profissao: "Programador", salario: "R$ 6.500,00" },
            { profissao: "Operador de Máquinas", salario: "R$ 2.800,00" },
            { profissao: "Consultor de Imagem", salario: "R$ 4.200,00" },
            { profissao: "Agente de Viagens", salario: "R$ 2.500,00" },
            { profissao: "Arqueólogo", salario: "R$ 4.000,00" },
            { profissao: "Pesquisador", salario: "R$ 5.000,00" }
        ];

        const profissaoEscolhida = salarios[Math.floor(Math.random() * salarios.length)]; // Escolhendo uma profissão aleatória

        const mensagem = `
💼 *SALÁRIO E PROFISSÃO* 💰
━━━━━━━━━━━━━━━
📌 *Profissão:* ${profissaoEscolhida.profissao}
💵 *Salário:* ${profissaoEscolhida.salario}
━━━━━━━━━━━━━━━
🤔 *Vai virar pobre ou rico?* 💸
        `;
        reply(mensagem);
    } catch (error) {
        console.error(error);
        reply("❌ *Erro ao calcular o salário, tente novamente!* ❌");
    }
    break;

case 'grupoinfo':
case 'infogrupo':
case 'infogp':  
case 'gpinfo':  
case 'regras':  
if (!isGroup) return reply(resposta.grupo)  
if (!isGroupAdmins) return reply(resposta.adm)  

try {  
    var ppUrl = await saya.profilePictureUrl(from, 'image')  
} catch {  
    var ppUrl = `https://telegra.ph/file/6ca032835ed7a16748b6f.jpg`  
}  

var puxarInfo = await sandro.groupMetadata(from)  
var ANC_INFO = puxarInfo.announce  
var returnAnnounce = ANC_INFO ? "✅ Sim" : "❌ Não"  
var RST_INFO = puxarInfo.restrict  
var returnRestrict = RST_INFO ? "❌ Não" : "✅ Sim"  
var infoCreator = puxarInfo.subjectOwner || "Não Encontrado"  

infoGroup = `🌐 *Informações do Grupo*  
📌 Nome: *${puxarInfo.subject}*  
🆔 ID: *${puxarInfo.id}*  
👑 Criador: *@${infoCreator.replace("@s.whatsapp.net", "")}*  
📅 Criado em: *${moment(`${puxarInfo.creation}` * 1000).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}*  
🔄 Última alteração: *${moment(`${puxarInfo.subjectTime}` * 1000).format('DD/MM/YYYY HH:mm:ss')}*  

👥 Admins: *${groupAdmins.length}*  
📊 Total: *${puxarInfo.participants.length}*  

🔒 Fechado? *${returnAnnounce}*  
✏️ Membros podem alterar info? *${returnRestrict}*  

📊 *Comandos Úteis:*  
📌 ${prefix}atividade – Ver atividades  
📌 ${prefix}inativos [nº de msgs] – Ex: ${prefix}inativos 10`

sandro.sendMessage(from, {image: {url: ppUrl}, caption: infoGroup, mentionedJid: [infoCreator]}, {quoted: selo})  
break

case 'wa.me':
            case 'wame':
                numi = sender.replace('@s.whatsapp.net', '')
                msg = args.toString().split(',').join('%20').split('@').join('')
                msg1 = msg.replace(numi, '')
                s = msg1.substring(0)
                if (msg.length < 1) return reply(`Defina uma mensagem, por exemplo: *${prefix}wame eae gostoso!*`)
                apim = `https://api.whatsapp.com/send?phone=${numi}&text=${s}`
                reply(apim)
                break

case 'minhacarteira':
case 'carteira':
case 'meubanco':
case 'saldo':
if(!isSabCityOFF) return reply(`Olá, o modo RPG não esta ativo`)
if(!JSON.stringify(sabrpg).includes(sender)) return reply(`${tempo} usuário(a), novo(a) por aqui? Use *${prefix}rgsc* para se registrar na Sab's City.`)
AB = sabrpg.map(i => i.id).indexOf(sender)
dindin = Number(sabrpg[AB].money).toFixed(2)
if(dindin < 10){
var bctxt = `0${dindin}`
} else {
var bctxt = dindin
}
caixa = []
for(i = 0; i < sabrpg.length; i++){
caixa.push({idnmr: sabrpg[i].id, nmr: i+1})
}
enc = caixa.map(b => b.idnmr).indexOf(sender)
if(Number(caixa[enc].nmr) < 100) {
if(Number(caixa[enc].nmr) < 10) {
page = `00` + caixa[enc].nmr
} else {
page = `0` + caixa[enc].nmr
}
} else {
page = caixa[enc].nmr
}
myid = sabrpg[AB].id.split('@')[0].slice(5)
txt = `Olá *${sabrpg[AB].nome}*, tudo bem? Aqui está a sua solicitação:\n—\n• [💵] *Informações Bancárias*\n• Seu banco atual: *${sabrpg[AB].namebank}*\n• Você está atualmente com *R$ ${bctxt}* em sua carteira para uso.\n–\n• [🧾] *Informações de Registro*\n• Seu ID: *R${sabrpg[AB].id.split(myid)[0]}GP${myid}BC*\n• Você realizou o registro na _Sab's City_ às *${sabrpg[AB].hrg} hora(s)* no dia *${sabrpg[AB].drg}*.\n–\n• [📖] *Livro de Registro*\n_Com base em meu livro de registros_, você foi registrado na página: *${page}*`
reply(txt)
break
break;

case 'bangp':
case 'unbangp':
if(!isGroup) return reply(resposta.grupo)
if(!isCreator) return reply(resposta.dono)
if(command == 'bangp'){
if(isBanchat) return reply(`Este grupo já está banido.`)
dataGp[0].bangp = true
setGp(dataGp)
reply(`Grupo banido com sucesso`)
} else {
if(!isBanchat) return reply(`Este grupo não está mais banido.`)
dataGp[0].bangp = false
setGp(dataGp)
reply(`Grupo desbanido...`)
}
break

  
  case 'chavepix':
if(!isGroup) return reply(resposta.grupo)
if(!isSabCityOFF) return reply(`É nescessário a ativação do *MODO RPG* no grupo! Use *${prefix}sabrpg*.`)
if(!JSON.stringify(sabrpg).includes(sender)) return reply(`${tempo} usuário(a), novo(a) por aqui? Use *${prefix}rgsc* para se registrar na Sab's City.`)
if(!JSON.stringify(sabrpg).includes(menc_os2)) return sandro.sendMessage(from, {text: `Usuário (a) @${menc_os2.split('@')[0]} não consta em nosso banco...`, mentions: [menc_os2]}, {quoted: selo})
AB = sabrpg.map(i => i.id).indexOf(sender)
reply(`Chave encontrada/localizada! 🌟🧾\n• Nome: *${sabrpg[AB].nome}*\n• Chave: *${sabrpg[AB].id.split('@')[0]}*`)
break

case 'meupix':
if(!isSabCityOFF) return reply(`É nescessário a ativação do *MODO RPG* no grupo! Use *${prefix}sabrpg*.`)
if(!JSON.stringify(sabrpg).includes(sender)) return reply(`${tempo} usuário(a), novo(a) por aqui? Use *${prefix}rgsc* para se registrar na Sab's City.`)
AB = sabrpg.map(i => i.id).indexOf(sender)
reply(`Aqui está sua numeração da chave pix: *${sabrpg[AB].id.split('@')[0]}*`)
break

case 'addpix':
if(!isCreator) return reply(resposta.dono)
var [nmr, pix] = q.split('/')
if(!nmr) return reply(`Falta a chave pix`)
if(!pix) return reply(`Falta o PIX`)
AB = sabrpg.map(i => i.id).indexOf(`${nmr}@s.whatsapp.net`)
if(!JSON.stringify(sabrpg).includes(`${nmr}@s.whatsapp.net`)) return reply(`Chave PIX não encontrada ou inexistente...`)
if(!Number(pix)) return reply(`${pix} não é um número...`)
MD = sabrpg[AB].money
addpix = Number(MD) + Number(pix)
sabrpg[AB].money = addpix
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`R$ ${Number(pix).toFixed(2)} foram adicionados a conta ${sabrpg[AB].nome}`)
break

case 'trabalhar':
if(!isGroup) return reply(resposta.grupo)
if(!isSabCityOFF) return reply(`É nescessário a ativação do *MODO RPG* no grupo! Use *${prefix}sabrpg*.`)
if(!JSON.stringify(sabrpg).includes(sender)) return reply(`${tempo} usuário(a), novo(a) por aqui? Use *${prefix}rgsc* para se registrar na Sab's City.`)
horaT = moment.tz('America/Sao_Paulo').format('HH')
dataT = moment.tz('America/Sao_Paulo').format('DD')
data2T = moment.tz('America/Sao_Paulo').format('MM')
AB = sabrpg.map(i => i.id).indexOf(sender)
if(Number(sabrpg[AB].limiteTh) === 0 && Number(sabrpg[AB].limiteTd) > 0 && Number(sabrpg[AB].hrT) === Number(horaT)) return reply(`Você já trabalhou agora... Volte na próxima hora.`)
//trabalho normal...
if(Number(sabrpg[AB].limiteTh) > 0 && Number(sabrpg[AB].hrT) === Number(horaT) && Number(sabrpg[AB].diaT) === Number(dataT) && Number(sabrpg[AB].mT) === Number(data2T)) {
TBALE = Math.floor(Math.random() * 50) + 40
TBLH = Number(sabrpg[AB].money) + Number(TBALE)
HT = sabrpg[AB].limiteTh - 1
TD = sabrpg[AB].limiteTd - 1
sabrpg[AB].money = TBLH
sabrpg[AB].money = TBLH
sabrpg[AB].money = TBLH
sabrpg[AB].limiteTh = HT
sabrpg[AB].limiteTd = TD
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`Parabéns ${sabrpg[AB].nome}, você trabalhou e ganhou *R$ ${Number(TBALE).toFixed(2)}* até depois!🫡`)
}
HTR = sabrpg[AB].hrT + 1
//passar para a próxima hora...
if(Number(horaT) > Number(sabrpg[AB].hrT) && Number(sabrpg[AB].limiteTd) > 0 && Number(sabrpg[AB].diaT) === Number(dataT) && Number(sabrpg[AB].mT) == Number(data2T)) {
sabrpg[AB].limiteTh = 3
sabrpg[AB].hrT = horaT
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`Já tá pronto pra trabalhar dnv? Digite o comando novamente enquanto eu preparo suas coisas...`)
}
if(Number(sabrpg[AB].limiteTd) < 1 && Number(sabrpg[AB].diaT) === Number(dataT)) return reply(`Você já trabalhou muito por hoje... Volte amanhã!`)
//passar para o outro dia...
if(Number(dataT) > Number(sabrpg[AB].diaT) && Number(sabrpg[AB].mT) == Number(data2T)) {
sabrpg[AB].limiteTh = 3
sabrpg[AB].limiteTd = 24
sabrpg[AB].hrT = horaT
sabrpg[AB].diaT = dataT
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`${tempo} usuário (a), está pronto para trabalhar?`)
}
//passar para o próximo mês...
if(Number(data2T) > Number(sabrpg[AB].mT)) {
sabrpg[AB].limiteTh = 3
sabrpg[AB].limiteTd = 24
sabrpg[AB].hrT = horaT
sabrpg[AB].diaT = dataT
sabrpg[AB].mT = data2T
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`${tempo} usuário (a), está pronto para iniciar o mês?`)
}
break

case 'setpix':
if(!isCreator) return reply(resposta.dono)
var [nmr, pix] = q.split('/')
if(!nmr) return reply(`Falta a chave pix`)
if(!pix) return reply(`Falta o PIX`)
AB = sabrpg.map(i => i.id).indexOf(`${nmr}@s.whatsapp.net`)
if(!JSON.stringify(sabrpg).includes(`${nmr}@s.whatsapp.net`)) return reply(`Chave PIX não encontrada ou inexistente...`)
if(!Number(pix)) return reply(`${pix} não é um número...`)
sabrpg[AB].money = pix
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`O saldo da conta ${sabrpg[AB].nome} foi setado em R$ ${Number(pix).toFixed(2)}`)
break

case 'delpix':
if(!isCreator) return reply(resposta.dono)
var [nmr, pix] = q.split('/')
if(!nmr) return reply(`Falta a chave pix`)
if(!pix) return reply(`Falta o PIX`)
AB = sabrpg.map(i => i.id).indexOf(`${nmr}@s.whatsapp.net`)
if(!JSON.stringify(sabrpg).includes(`${nmr}@s.whatsapp.net`)) return reply(`Chave PIX não encontrada ou inexistente...`)
if(!Number(pix)) return reply(`${pix} não é um número...`)
MD = sabrpg[AB].money
addpix = Number(MD) - Number(pix)
sabrpg[AB].money = addpix
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`R$ ${Number(pix).toFixed(2)} foram retirados da conta ${sabrpg[AB].nome}`)
break

case 'perfil':
try {
    reply(resposta.espere)

    let ppimg
    try {
        ppimg = await shizuku.profilePictureUrl(sender, "image")
    } catch {
        ppimg = "https://telegra.ph/file/b5427ea4b8701bc47e751.jpg"
    }

    let getbb
    try {
        const getbbb = await shizuku.fetchStatus(sender)
        getbb = getbbb.status
    } catch {
        getbb = "privado, ou inexistente!"
    }
const palavras = [
  "Nunca desista dos seus sonhos.",
  "A prática leva à perfeição.",
  "Seja gentil, sempre.",
  "A persistência é o caminho do sucesso.",
  "Confie no seu potencial.",
  "Aprender é uma jornada contínua.",
  "Acredite em si mesmo.",
  "Cada dia é uma nova oportunidade.",
  "Valorize as pequenas conquistas."
];
    const conselho = palavras[Math.floor(Math.random() * palavras.length)]
    const rand = () => Math.floor(Math.random() * 10)
    
    const nivelGado = `${rand()}${rand()}%`
    const gostosura = `${rand()}${rand()}%`
    const inteligencia = `${rand()}${rand()}%`
    const romance = `${rand()}${rand()}%`
    const fama = `${rand()}${rand()}%`
    const flerte = `${rand()}${rand()}%`
    const pix = Math.floor(Math.random() * 5000)
    const programa = Math.ceil(Math.random() * 10000)

    const classes = ['Guerreiro', 'Mago', 'Assassino', 'Ladino', 'Paladino']
    const classe = classes[Math.floor(Math.random() * classes.length)]

    const perfil = await getBuffer(ppimg)

    await sandro.sendMessage(from, {
        image: perfil,
        caption: `╭════════════════════ ┐
┆➮ *_Info-User/Perfil_*
╰════════════════════ ┘
╭════════════════════ ┐
│➤ 💁 *Usuário:* ${pushname}
│➤ 📞 *Número:* ${sender.split("@")[0]}
│➤ 🖋️ *Recado:* ${getbb}
│➤ 📱 *Dispositivo:* ${info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'iOS' : 'Web'}
│➤ 👥 *Grupo:* ${groupName}
╰════════════════════ ┘

╭═ *Níveis Zoando Você* ═┐
│➤ 🐂 *Gado:* ${nivelGado}
│➤ 🤤 *Gostosura:* ${gostosura}
│➤ 🧠 *Inteligência:* ${inteligencia}
│➤ ❤️ *Romantismo:* ${romance}
│➤ 🔥 *Fama no zap:* ${fama}
│➤ 🎯 *Flerte:* ${flerte}
│➤ 💸 *Valor no Pix:* R$${pix}
│➤ 🍼 *Valor do Programa:* R$${programa}
│➤ ⚔️ *Classe RPG:* ${classe}
╰════════════════════ ┘

💭 *Conselho do dia:*  
➤ ${conselho}
`}, { quoted: selo })
} catch (e) {
 console.error("Erro ao executar comando perfil: " + e)
 reply("erro, não consegui executar o comando, sinto muito")
}
break//by: shizuku-Bot & jpzinh!

case 'addlike': //@BotXLeaks
    if (!q) return reply(`Use o comando assim:\n${prefix+command} ID/100`)
    if (!q.includes(`/`)) return reply(`Separe o ID do jogador e a quantidade com uma barra.\nEx: ${prefix+command} 11664052425/100`)
    
    var [playerId, likeQtd] = q.split(`/`)
    if (isNaN(playerId) || isNaN(likeQtd)) return reply(`ID do jogador e quantidade precisam ser números.`)
    
    var qtd = Number(likeQtd)
    if (qtd <= 0) return reply(`A quantidade de likes precisa ser maior que zero.`)
    if (qtd > 100) return reply(`O limite máximo é de 100 likes por comando.`)

    reply(`*FREE FIRE* Enviando ${qtd} likes para o jogador com ID: ${playerId}...`)
    
    try {
        const res = await fetch(`https://adderfreefirelikes.squareweb.app/api/like?uid=${playerId}&quantity=${qtd}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*'
            }
        })
        const result = await res.text()

        if (result.includes('<!DOCTYPE html>') || result.includes('<html')) {
            return reply(`O servidor retornou uma resposta inesperada (HTML). Pode estar fora do ar ou bloqueando a hospedagem.`)
        }

        reply(`*FREE FIRE* Resultado da solicitação:\n${result}\n\n> Esse comando só pode ser usado novamente depois de 15 minutos.`)
    } catch (e) {
        reply(`Ocorreu um erro ao tentar enviar os likes: ${e.message}`)
    }
break

case 'shippar':
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!');
    if (groupMembers.length < 2) return reply('👥 Poucos participantes no grupo.');

    const membro1 = groupMembers[Math.floor(Math.random() * groupMembers.length)].id;
    let membro2;
    do 
        membro2 = groupMembers[Math.floor(Math.random() * groupMembers.length)].id;
     while (membro1 === membro2);

    const porcentagems = Math.floor(Math.random() * 101);
    const coracao = porcentagems > 70 ? '💖' : porcentagems > 40 ? '💘' : '💔';

    reply(
        `👩‍❤️‍👨 *SHIPPANDO...*@${membro1.split('@')[0]} coracao @${membro2.split('@')[0]}\n❤️ *Compatibilidade:* ${porcentagems}%`,
        { mentions: [membro1, membro2] }
    );
    break;

case 'ip': 
if(!isPremium) return reply(resposta.premium)
bla = args.join(" ")
if(!bla) return reply(`📡 *_IP SEARCH_* 📡

_insira o IP que deseja obter informações ao lado do comando caso haja dúvidas contate meu criador! e lembrando que será descontado ${LargeNumber(10000000)} coins de seu saldo._`)
try {
ip = await axios.get(`https://ipwhois.app/json/${encodeURIComponent(bla)}`);
sandro.sendMessage(from, {image: {url: `https://maps.googleapis.com/maps/api/streetview?size=1400x1400&location=${ip.data.latitude},%20${ip.data.longitude}&sensor=false&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`}, caption: `📡 *_IP SEARCH_* 📡

• IP: ${ip.data.ip}
• Tipo: ${ip.data.type}
• Província: ${ip.data.region} 
• Latitude: ${ip.data.latitude}
• Longitude: ${ip.data.longitude}
• Provedor: ${ip.data.isp}
• Continente: ${ip.data.continent} - ${ip.data.continent_code}
• País: ${ip.data.country}
• DDI: ${ip.data.country_phone}
• Sigla: ${ip.data.country_code}
• Capital: ${ip.data.country_capital}
• Fuso Horário: ${ip.data.timezone} ${ip.data.timezone_name} ${ip.data.timezone_gmt}
• Moeda do País: ${ip.data.currency} - ${ip.data.currency_code}`})
} catch {
return reply("Bateu um soninho... 😴")
}
break

case 'cep':
if(!isPremium) return reply(resposta.premium)
bla = args.join(" ")
if(!bla) return reply(`‼️ *_Consulta CEP_* ‼️\n-\n_dúvidas de como usar? entre em contato com meu criador! ah e lembrando após o uso dessa função será descontado ${LargeNumber(10000000)} coins de sua carteira, beijinhos_`)
try {
consulta = await fetchJson(`http://br1.bronxyshost.com:4179/api/cep?code=${bla}&apikey=`+API_KEY_NODZ)
reply(`🔎 Consulta CEP 🔍
-
• Cep: ${consulta.cep || "❌"}
• Logradouro: ${consulta.street || "❌"}
• DDD: ${consulta.ddd || "❌"}
• Bairro: ${consulta.neighborhood || "❌"}
• Cidade: ${consulta.city || "❌"}
• Estado: ${consulta.state || "❌"}
• IBGE: ${consulta.ibge || "❌"}
• Siafi: ${consulta.siafi || "❌"}`)
} catch {
return reply("Bateu um soninho... 😴")
}
break

case 'tempo':
            sandro.sendMessage(from, { react: { text: `📡`, key: info.key } })
            if (!q) return reply(`Qual o nome da sua cidade? Exemplo: /tempo Sao Paulo caso ter algum ponto retire pra nao da erro.`)
            cidade = body.slice(7)
            clima = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=f5c0840c2457fbb64188a6d4be05618f&units=metric&lang=pt_br`)
            if (clima.error) return reply(msg.erro)
            jr = `🌞 Temperatura agora: ${clima.data.main.temp}ºC
  🏙️ Cidade: ${clima.data.name}
  🔥 Temperatura Máxima: ${clima.data.main.temp_max}°C
  ❄ Temperatura Mínima: ${clima.data.main.temp_min}°C
  🌦 Clima: ${clima.data.weather[0].description}
  💧 Umidade de ar: ${clima.data.main.humidity}% 
  🌫 Ventos: ${clima.data.wind.speed}  
  
  Solicitado por: ${pushname}`
            await sandro.sendMessage(from, { text: jr }, { quoted: selo, contextInfo: { "mentionedJid": jr } })
            break  

case 'tiktoksearch':
case 'ttkpesquisa':
try {
if (!q) {//Creditos ao site api.
await reply(`Você esqueceu de inserir um título para a sua pesquisa.\n\nExemplo: ${prefix+command} edit cr7`);
await reagir(from, "🧐");
return;
}
await reagir(from, "⌛");

 const tiktoksearch = await fetchJson(`https://api.nexfuture.com.br/api/pesquisas/tiktok/search?query=` + q);
 const result = tiktoksearch.resultado;

    const txtTiktok = `
╭─「 *Resultados para ${q.trim()}* 」
│
│ ✦ *Título:* ${result.titulo}
│ ✦ *Criador:* ${result.criador}
│ ✦ *Tipo:* ${result.type}
│ ✦ *Mídia:* ${result.mime}
╰───────────────╯

> *Já estou enviando o áudio também, aguarde...*
`;

  await sandro.sendMessage(from, { video: { url: result.videos }, mimetype: result.mime, caption: txtTiktok }, { quoted: selo });
  await sleep(25000);
  await sandro.sendMessage(from, { audio: { url: result.audio }, mimetype: "audio/mpeg" }, { quoted: selo });

} catch (err) {
    console.error("Erro apresentado em:" +err);
    await reply("Ocorreu um erro ao realizar a pesquisa no TikTok, ou a API ficou fora do ar (*F*).");
    await reagir(from, "❌");
}
break;
  
case 'sermembro':
    if (!isGroup) return reply("❌ Use este comando em grupo.");
    if (!isCreator) return reply("❌ Esse comando é exclusivo do dono!");
    if (!isBotAdmins) return reply("❌ Eu preciso ser administrador para fazer isso!");

    await sandro.groupParticipantsUpdate(from, [sender], "demote").then(() => {
        reply("✅ Você voltou a ser membro. Adeus poder (por enquanto)!");
    }).catch(() => {
        reply("❌ Não consegui remover o cargo. Já é membro? Ou não tenho permissão?");
    });
    break;      

case 'play':
try {
if (!q) return reply(`Exemplo: ${prefix}play nome da música`);

reagir(from, '⏳');

// Faz a busca no YouTube
let api = await axios.get(`https://nodz-apis.com.br/api/pesquisas/youtube`, {
 params: {
  query: q,
  apiKey: 'KalixiaKey'
 }
});

if (!api.data.resultado) return reply("Nenhum resultado encontrado.");

let i = api.data.resultado;
let N_E = "Não encontrado.";

let desc = `*🔍 Resultado encontrado:*\n\n`;
desc += `*🇧🇷 Título:* ${i.titulo || N_E}\n`;
desc += `*⏳ Duração:* ${i.duracao || N_E}\n`;
desc += `*👀 Views:* ${i.views || N_E}\n`;
desc += `*🎲 Autor:* ${i.canal || N_E}\n\n`;
desc += `_Aguarde, baixando o áudio..._`;

// Envia as informações da música
await sandro.sendMessage(from, {
 image: { url: i.imagem },
 caption: desc
}, { quoted: selo });

// Envia o áudio
await sandro.sendMessage(from, {
 audio: {
  url: `https://nodz-apis.com.br/api/downloads/youtube/audio?url=${i.url}&apiKey=KalixiaKey`
 },
 mimetype: "audio/mpeg",
 fileName: `${i.titulo}.mp3`
}, { quoted: info });

reagir(from, '✅');

} catch (error) {
 console.error('[ᴄᴏᴍᴀɴᴅᴏ ᴘʟᴀʏ]:', error);
 reply("❌ Erro ao processar sua solicitação. Tente novamente mais tarde.");
}
break;

case 'modosabrpg': case 'modosabcity': case 'modosc': case 'sabrpg':

if(!isGroup) return reply(resposta.grupo)
if(!isGroupAdmins) return reply(resposta.adm)
if(!q) return reply(`Você está usando o comando de forma errada, verifique:\n• Ex: *${prefix+command} 1/0* _(1 para ativar, 0 para desativar)_`)
if(Number(args[0]) === 1) {
if(JSON.stringify(autorpg).includes(from) && autorpg[autorpg.map(i => i.id).indexOf(from)].rpg == true) return reply("Sistema *#Sab'City* - O sistema já está ativado aqui no grupo.")
if(!JSON.stringify(autorpg).includes(from)) {
autorpg.push({id: from, rpg: true})
fs.writeFileSync("./database/usuarios/SystemRPG/autorpg.json", JSON.stringify(autorpg))
} else {
autorpg[autorpg.map(i => i.id).indexOf(from)].rpg = true
fs.writeFileSync("./database/usuarios/SystemRPG/autorpg.json", JSON.stringify(autorpg))
}
reply("Sistema *#Sab'City* - Foi efetuado a ativação no grupo com sucesso...")
} else if(Number(args[0]) === 0) {
if(JSON.stringify(autorpg).includes(from) && autorpg[autorpg.map(i => i.id).indexOf(from)].rpg == false) return reply("Sistema *#Sab'City* - O sistema não está ativado aqui no grupo.")
if(!JSON.stringify(autorpg).includes(from)) {
autorpg.push({id: from, rpg: false})
fs.writeFileSync("./database/usuarios/SystemRPG/autorpg.json", JSON.stringify(autorpg))
} else {
autorpg[autorpg.map(i => i.id).indexOf(from)].rpg = false
fs.writeFileSync("./database/usuarios/SystemRPG/autorpg.json", JSON.stringify(autorpg))
}
reply("Sistema *#Sab'City* - Foi desabilitado com sucesso no grupo.")
}
break
 
case 'rgsc':
case 'rgsabcity':
if(!isGroup) return (resposta.grupo)
if(!isSabCityOFF) return reply(`É nescessário a ativação do *MODO RPG* no grupo! Use *${prefix}sabrpg*.`)
if(JSON.stringify(sabrpg).includes(sender)) return reply(`Seu registro foi encontrado em meu banco de dados! Use *${prefix}meusc* e consulte seu registro/dados`)
if(!q) return reply(`Digite seu nome após o comando, para seu registro ser feito com êxito.`)
if(q.includes('@')) return reply(`O registro foi cancelado na Sab's City! Foi detectado um *@* no campo, retire-o e realize o registro novamente.`)
bancos = ["Inter", "NuBank", "PagBank️", "Bradesco", "Next", "Caixa", "Santander️", "Banco do Brasil", "PicPay", "PayPal", "Itaú"]
bank = bancos[Math.floor(Math.random() * bancos.length)]
horarg = moment.tz('America/Sao_Paulo').format('HH:mm');
hora10 = moment.tz('America/Sao_Paulo').format('HH');
datarg = moment.tz('America/Sao_Paulo').format('DD/MM');
dia10 = moment.tz('America/Sao_Paulo').format('DD');
m10 = moment.tz('America/Sao_Paulo').format('MM');
sabrpg.push({id: sender, gpid: from, hrg: horarg, drg: datarg, nome: q, namebank: bank, money: 0, pixD: 5, pixL: 100, limiteC: 15, horaC: hora10, diaC: dia10, mC: m10, limiteTh: 3, hrT: hora10, limiteTd: 24, diaT: dia10, mT: m10, bcbet: true})
fs.writeFileSync("./database/usuarios/SystemRPG/sabrpg.json", JSON.stringify(sabrpg))
reply(`Registro efetuado e concluído com êxito! Seja bem vindo(a) à Sab's City, ${q}`)
setTimeout(() => {
sandro.sendMessage(from, {text: `Agora você pode trabalhar e ganhar muito dinheiro jogando e apostando em nossos jogos. Para consultar seu saldo atual, use: *${prefix}minhacarteira*`})
}, 1100)
break  
    /* *COMANDOS BRINCADEIRAS, SIMPLES*
• Lembre-se de trocar seu client. */
case 'verdadeoudesafio':
case 'vdd-dsf':
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
  try {
    const escolha = args[0]; 
    if (!escolha || (escolha !== 'verdade' && escolha !== 'desafio')) {
      return reply("Escolha 'verdade' ou 'desafio' para jogar!");
    }
    const verdades = [
      'Verdade: Qual é o maior segredo que você já escondeu de seus amigos?',
      'Verdade: Qual foi a coisa mais vergonhosa que você já fez?',
      'Verdade: Se você pudesse mudar uma coisa em sua vida, o que seria?',
      'Verdade: Já teve um crush em alguém do grupo?',
      'Verdade: Qual a última vez que você mentiu e para quem?',
      'Verdade: Qual é a sua maior insegurança?',
      'Verdade: O que você mais tem medo de acontecer na sua vida?',
      'Verdade: Qual o maior arrependimento da sua vida?',
      'Verdade: Se você pudesse trocar de vida com alguém por 24 horas, quem seria?',
      'Verdade: Qual a coisa mais estranha que você já fez em público?' ];
    const desafiosPesados = [
      'Desafio: Fique 1 minuto de pé com uma perna só! Você consegue?',
      'Desafio: Beba um copo de água gelada enquanto segura o ar por 10 segundos!',
      'Desafio: Coloque o pé na sua cabeça e fique assim por 30 segundos!',
      'Desafio: Fique 2 minutos fazendo caretas enquanto segura a respiração!',
      'Desafio: Diga "Eu sou o mestre do universo" em voz alta 5 vezes seguidas!',
      'Desafio: Balançar sua cabeça de um lado para o outro por 1 minuto, sem parar!',
      'Desafio: Fala para seu 5° contato que vc e gay',
      'Desafio: Imite o som de um animal aleatório (galo, vaca, porquinho, etc.) por 30 segundos!',
      'Desafio: Faça 50 abdominais em menos de 1 minuto!',
      'Desafio: Faça um "selfie" com a expressão mais feia que conseguir e envie para o grupo!',
      'Desafio: Segure o ar por 10 segundos! Você consegue?',
      'Desafio: Fique 30 segundos sem rir! Vai conseguir?',
      'Desafio: Tente fazer 10 flexões sem parar!',
      'Desafio: Diga a palavra "paralelepípedo" 5 vezes sem errar!',
      'Desafio: Tente ficar 10 segundos olhando para a tela sem piscar!',
      'Desafio: Faça uma careta bem feia e mantenha por 10 segundos!',
      'Desafio: Diga seu nome ao contrário 3 vezes!',
      'Desafio: Tente adivinhar o enigma: "O que é, o que é? Tem cabeça, mas não tem corpo!"',
      'Desafio: Faça 20 pulos no lugar! Vai encarar?',
      'Desafio: Tente tocar o seu nariz com a língua!' ];
    if (escolha === 'verdade') {
      const verdadeSelecionada = verdades[Math.floor(Math.random() * verdades.length)];
      reply(`💬 *VERDADE* 💬\n${verdadeSelecionada}`);
    } else if (escolha === 'desafio') {
      const desafioPesadoSelecionado = desafiosPesados[Math.floor(Math.random() * desafiosPesados.length)];
      const imagemUrl = 'https://imgur.com/YbaVUbz'
      const dptr = `🔥 *DESAFIO PESADO* 🔥\n${desafioPesadoSelecionado}\n`;
      reply(`${dptr}`)}
  } catch (e) {
    reply("Houve um erro ao processar seu pedido. Tente novamente mais tarde.");}
  break;
//com botões 
case 'sigma'://ph.46m
if (!isJogos && isGroupAdmins) return reply("🌸O MODO JOGOS PRESCISA ESTA ATIVO 🌸 *_pessa a um adm para ativar o modo jogos_*")
if (!isGroup) return reply(reply.msg.grupo)

// Mensagem inicial
sandro.sendMessage(from, {
text: `*Conversa de alto nível senhores!* 🗿🍷🔥 ⇒ @${sender.split("@")[0]} *Aguarde...* ⏰`,
mentionedJid: [sender]
})

// Tempo de espera (7 segundos)
setTimeout(async () => {
// Geração de número aleatório (0-110)
random = `${Math.floor(Math.random() * 110)}`

// Envio da imagem com legenda 
sandro.sendMessage(from, {
  image: {
    url: "https://i.ibb.co/sm78YrC/9b8f30a05521fd394762e12b836fd2f7.jpg"
  },
  caption: `*O QUANTO VOCÊ É SIGMA?* 🤔 ⇒ @${sender.split("@")[0]} VOCÊ É 𓍯⃝꥟${random}%𓍯⃝꥟ SIGMA 🗿🍷🎉 ⏤͟͟͞͞ ꦿ${botName}`,
  mentionedJid: [sender]
}, { quoted: selo})

}, 7000)
break//ph.46m

case 'setprefix':
    if (!isCreator) return reply(`❌ Somente o ${donoName} pode usar este comando.`)

    if (!q || q.length > 3) return reply(`⚠️ Forneça um prefixo válido com até 3 caracteres.\nExemplo: .setprefix !`)

    const novoPrefixo = q.trim()

    const novoConteudo = `const fs = require("fs")

global.donoName = "gebe modz" // Nome do dono
global.botName = "𝚂𝙰𝙵𝙸𝚁𝙰 𝙿𝚁𝙸𝚅𝙰𝙲𝚈" // Nome do bot
global.donoNumber = "558398164308" // Número do dono
global.numeroBot = "558396768169" // Número do bot
global.prefix = "${novoPrefixo}" // Prefixo do bot
// Não apague
`

    fs.writeFileSync('./dono/dono.js', novoConteudo)
    reply(`✅ Prefixo alterado com sucesso para: *${novoPrefixo}*`)
    break
    
    case 'report':
      case 'bug':
        if (!q) return reply(`*oie ${pushname} infelizmentevoce digitou o comando errado tente ${prefix}bug menu*`)
        reply(`*_Obrigada por detectar esse erro, ja caminhei o bug para o meu criador para ele ajeitar imediatamente 🦋*_`)
        let templateMesssage = {
          image: {
            url: './arquivos/imagens/menu.jpg',
            quoted: selo
          },
          caption: `☕️ *ola mestre desculpe lhe encomondar mas detectaram um erro no meu sistema* ☕️\naqui esta o numero dele 🪷: @${sender.split('@')[0]},\nesse foi o comando que esta com falha 💬:${q}`,
          footer: 'menu.jpg'
        }
        sandro.sendMessage(`558398164308@s.whatsapp.net`, templateMesssage)
        break

      case 'novocmd':
        if (!q) return reply(`oie ${pushname} digite assim ${prefix}novocmd filme`)
        reply(`*_Obrigada pela sugestão de comando estou grata, espero que eu melhore cada vez mais 🥺🦋_*`)
        const qp = args.join(" ")
        let templateMessage = {
          image: {
            url: './arquivos/imagens/menu.jpg',
            quoted: selo
          },
          caption: `*_OIIEE MESTRE VIM TRAZER UMA NOTICIA MUITO BOA, PENSARAM EM UM NOVO COMANDO PRA UM >.<_*\nAqui esta o número dele 🦋:: @${sender.split('@')[0]},\n> O COMANDO QUE ELE PENSOU FOI ESSE:: ${q}`,
          footer: 'menu.jpg'
        }
        sandro.sendMessage(`558398164308@s.whatsapp.net`, templateMessage)
        break

      case 'nomegp':
        {
          if (!isGroup) return reply(resposta.grupo)
          if (!isGroupAdmins) return reply(resposta.adm)
          if (!isBotGroupAdmins) return reply(resposta.botadm)
          blat = args.join(" ")
          sandro.groupUpdateSubject(from, `${blat}`)
          sandro.sendMessage(from, { text: '🌸NOME DO GRUPO ALTERADO COM SUCESSO 🌸' }, { quoted: selo }).catch((err) => {
            reply(`erro`);
          })
        }
        break

      case 'descgp':
      case 'descriçãogp':
        if (!isGroup) return reply(resposta.grupo)
        if (!isGroupAdmins) return reply(resposta.adm)
        if (!isBotGroupAdmins) return reply(resposta.botadm)
        blabla = args.join(" ")
        sandro.groupUpdateDescription(from, `${blabla}`)
        sandro.sendMessage(from, { text: 'Sucesso, alterou a descrição do grupo' }, { quoted: selo })
        break

case 'seradm':
if (!isCreator) return reply("Apenas o dono pode executar este comando.");
const isSenderAdmin = groupAdmins.includes(sender);
if (isSenderAdmin) return reply("Você já é um administrador do grupo.");

await sandro.groupParticipantsUpdate(from, [sender], "promote");
mentioned(`@${sender.split("@")[0]} Pronto - Agora você é um administrador.`, [sender], true);
break//by: yuno-Bot && h
///////////////FIMMM

case 'figurinhas':
reply(`Enviando.. caso demore de mais nao consegui te enviar `)
if (!q) return reply("Insira a qnd de figu que deja que eu envie")
if (!Number(args[0]) || Number(q.trim()) > 100) return reply("Digite a quantidade de figurinhas que deseja que eu envie.. não pode mais de 100..")
reply('Ja estou enviando no seu pv...!')
async function figuss() {
var rnd = Math.floor(Math.random() * 8051)
sandro.sendMessage(from, { sticker: { url: `http://br4.bronxyshost.com:4059/api/figurinhas?apikey=${SANDRO_MD}` } })}
for (i = 0; i < q; i++) {
figuss()
}
break

case 'rebaixar': case 'rebaixa':
if (!isGroupAdmins) return reply(msg.adm)
if (!isBotAdmins) return reply(msg.botadm)
if (!isGroup) return reply(msg.grupo)
if (!isGroupAdmins) return reply('nao e adm...')
if (info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return reply('Marque ou responda a mensagem de quem você quer tirar de admin')
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid[0] ? info.message.extendedTextMessage.contextInfo.mentionedJid[0] : info.message.extendedTextMessage.contextInfo.participant
let responsepm = await sandro.groupParticipantsUpdate(from, [mentioned], 'demote')
if (responsepm[0].status === "406") return reply('Como vc quer que eu remova o adm supremacy????')
else if (responsepm[0].status === "200") return reply('Voce perdeu o cargo de administrador(a) do grupo')
else if (responsepm[0].status === "404") return reply('Esse cara nem ta no grupo')
else return reply('tente dnv')
break

case 'promover': case 'promote':
if (!isGroup) return reply("🦋 *OPS, SO EM GRUPOS* 🦋")
if (!isGroupAdmins) return reply("🚀 *OPS, SO ADM PODE USAR ESSE COMANDO* 🚀")
if (!isBotAdmins) return reply("✋🏻 *BOT PRESCISA SER ADM* ✋🏻")
if (info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return reply('Vai colocar o vento como adm???')
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid[0] ? info.message.extendedTextMessage.contextInfo.mentionedJid[0] : info.message.extendedTextMessage.contextInfo.participant
let responsedm = await sandro.groupParticipantsUpdate(from, [mentioned], 'promote')
if (responsedm[0].status === "200") return reply('Temos um novo admir')
else if (responsedm[0].status === "404") return reply('Esse maluco nem ta no grupo 🤔')
else return reply('Tenta dnv '-'')
break


case 'ban': case 'kick':
if (!isGroup) return reply("🦋 *OPS, SO EM GRUPOS* 🦋")
if (!isGroupAdmins) return reply("🚀 *OPS, SO ADM PODE USAR ESSE COMANDO* 🚀")
if (!isBotAdmins) return reply("✋🏻 *BOT PRESCISA SER ADM* ✋🏻")
{
if (info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return reply('Marque a mensagem da pessoa que deseja banir')
if(info.message.extendedTextMessage.contextInfo.participant !== null && info.message.extendedTextMessage.contextInfo.participant != undefined && info.message.extendedTextMessage.contextInfo.participant !== "") {
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid[0] ? info.message.extendedTextMessage.contextInfo.mentionedJid[0] : info.message.extendedTextMessage.contextInfo.participant
let responseb = await sandro.groupParticipantsUpdate(from, [mentioned], 'remove')
if (responseb[0].status === "200") return reply(`*Usuário removido do grupo com sucesso🙍🏻‍♂️*`)
else if (responseb[0].status === "406") return reply('Como vc quer que eu remova o adm supremacy????')
else if (responseb[0].status === "404") return reply('*Este usuário ja foi removido ou saiu do grupo')
else return reply('tenta dnv')
} else if (info.message.extendedTextMessage.contextInfo.mentionedJid != null && info.message.extendedTextMessage.contextInfo.mentionedJid != undefined) {
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid
if(mentioned.length > 1) {
if(mentioned.length > groupMembers.length || mentioned.length === groupMembers.length || mentioned.length > groupMembers.length - 3) return reply(`Vai arquivar msm??`)
sexocomrato = 0
for (let banned of mentioned) {
await sleep(100)
let responseb2 = await sandro.groupParticipantsUpdate(from, [banned], 'remove')
if (responseb2[0].status === "200") sexocomrato = sexocomrato + 1
}
return reply(``)
} else {
let responseb3 = await sandro.groupParticipantsUpdate(from, [mentioned[0]], 'remove')
if (responseb3[0].status === "200") return reply(`*Usuário removido do grupo com sucesso🙍🏻‍♂️*`)
else if (responseb3[0].status === "406") return reply('Como vc quer que eu remova o adm supremacy????')
else if (responseb3[0].status === "404") return reply('Este usuário já foi removido ou saiu')
else return reply('Tenta dnv')
}
}
}
break

case 'ps':
case 'playstore':
if(!q) return reply(`KD o nome do app ?`)
try {
ABC = await fetchJson(`${zerosite}/api/playstore?nome=${encodeURI(q)}&apikey=`+API_KEY_ZEROTWO)
i = ABC.pesquisa.resultado[0]
txt = `
❪🏷️ฺ࣭࣪͘ꕸ▸ 𝙽𝚘𝚖𝚎৴▸ ${i.nome}
❪📟ฺ࣭࣪͘ꕸ▸ 𝙳𝚎𝚜𝚎𝚗𝚟𝚘𝚕𝚟𝚎𝚍𝚘𝚛৴▸ ${i.desenvolvedor}
❪⭐ฺ࣭࣪͘ꕸ▸ 𝙰𝚟𝚊𝚕𝚒𝚊çã𝚘৴▸ ${i.estrelas}
⏤͟͟͞͞ ꦿ𝙻𝚒𝚗𝚔ฺ࣭࣪͘ꕸ▸ ${i.link}
`
sandro.sendMessage(from, {text: txt, contextInfo: {
  externalAdReply: {
    title: `ㅤㅤㅤ🎮 𝙋𝙇𝘼𝙔 𝙎𝙏𝙊𝙍𝙀 🎮`,
    body: ``,
    thumbnail: await getBuffer(i.imagem),
    mediaType: 1,
    sourceUrl: i.link
  }
}}, {quoted: seloctt})
} catch {
reply(`Não encontrei nenhum app, ou pode ser que a api caiu`)
}
break

case 'sasa':
case 'safira-channel':
    try {//FEITA POR JPZINH O MAGO! DX OS CREDTS DO CANAL AI CHEFF
        if (!isGroup) return reply('Este comando só funciona em grupos.')
        if (!isCreator) return

        const qtd = args[0] ? parseInt(args[0]) : null
        if (!qtd || isNaN(qtd) || qtd < 1 || qtd > 30) return reply('Defina uma quantidade de envios entre 1 e 30. Ex: !sasa 5')

        const metadata = await sandro.groupMetadata(from)
        const participantes = metadata.participants.map(p => p.id).filter(v => v !== undefined)
        const texto = `🚨 *ATENÇÃO* 🚨  
slk, olha isso

╭───〔 👥 *Novo Grupo Oficial* 〕───╮  
│➤ https://chat.whatsapp.com/HWFR21EizPlA4jsvyeyK6u
╰────────────────────────────╯  
⚠️ *Entre agora e continue na mira da safira...*  
(Ela odeia ser ignorada...)

╭───〔 📢 *彡  𝚂𝙰𝙵𝙸𝚁𝙰 𝙿𝚁𝙸𝚅𝙰𝙲𝚈 𝙲𝙷𝙰𝙽𝙽𝙴𝙻𝚂 🦋彡*〕───╮  
│➤  https://whatsapp.com/channel/0029Vb6MFsC4dTnM08IeYY3p
╰────────────────────────────╯  
❤️ *Siga o canal pra não perder nenhuma loucura, atualização e comandos exclusivos!*
`
        for (let i = 0; i < qtd; i++) {
            await sleep(100)
            await sandro.relayMessage(from, {
                requestPaymentMessage: {
                    currencyCodeIso4217: 'LOL',
                    amount1000: 0,
                    requestFrom: sender,
                    noteMessage: {
                        extendedTextMessage: {
                            text: `${texto}\n\n` + '𓆩'.repeat(50),
                            contextInfo: {
                                mentionedJid: participantes
                            }
                        },
                    },
                }
            }, {})
        }
    } catch (e) {
        console.error(e)
        reply('Erro ao realizar ação.')
    }// ★彡 ʏᴜɴᴏ-ʙᴏᴛ - ᴄʜᴀɴɴᴇʟ 彡★
    break//by: yuno-Bot & jpzinh!

case 'cria': 
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_api.jpg?text.0.text=${q}&text.0.color=000000&text.0.font.family=Pacifico&text.0.font.weight=600&text.0.background.color=ffffff&text.0.outline.color=ffffff&text.0.outline.width=10&text.0.outline.blur=17`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break
case 'anime1':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis2.jpg?text.0.text=${q}&text.0.position.gravity=center&text.0.position.x=1%25&text.0.position.y=16%25&text.0.size=80&text.0.color=ff2772&text.0.opacity=67&text.0.font.family=Bangers&text.0.font.style=italic&text.0.background.opacity=50&text.0.outline.width=6`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break

case 'ff1':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis3.jpg?text.0.text=${q}&text.0.position.gravity=north&text.0.position.y=59%25&text.0.size=89&text.0.color=000000&text.0.opacity=71&text.0.font.family=Changa%20One&text.0.font.style=italic&text.0.background.opacity=10&text.0.outline.color=ffffff&text.0.outline.width=3`)
sandro.sendMessage(from, { image: venomk }, {quoted: info })
break	

case 'game':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis5.jpg?text.0.text=${q}&text.0.position.gravity=center&text.0.position.x=1%25&text.0.position.y=22%25&text.0.align=left&text.0.size=59&text.0.font.family=Permanent%20Marker&text.0.outline.color=df00ff&text.0.outline.width=2&text.0.outline.blur=18`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break

case 'ff2':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis6.jpg?text.0.text=${q}&text.0.position.gravity=north&text.0.position.x=1%25&text.0.position.y=50%25&text.0.size=68&text.0.color=464646&text.0.opacity=51&text.0.font.family=Sigmar%20One&text.0.background.opacity=2&text.0.outline.color=ffffff&text.0.outline.width=2&text.0.outline.opacity=61`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break	

case 'anime2':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis7.jpg?text.0.text=${q}&text.0.position.gravity=north&text.0.position.x=1%25&text.0.position.y=58%25&text.0.size=69&text.0.color=00ffea&text.0.opacity=37&text.0.font.family=Bangers&text.0.background.opacity=77&text.0.outline.color=ffffff&text.0.outline.width=2&text.0.outline.blur=20`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break

case 'entardecer':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis9.jpg?text.0.text=${q}&text.0.position.gravity=north&text.0.position.y=50%25&text.0.size=68&text.0.color=ffffff&text.0.opacity=61&text.0.font.family=Tangerine&text.0.font.style=italic&text.0.background.opacity=61&text.0.outline.color=ff6f00&text.0.outline.width=9`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break

case 'casal':
if(!isGroup) return reply(resposta.grupo)
if(!isJogos) return reply("modo jogos prescisa está ativo")
mention(`Tô sentindo que 2 membros *casou no sigilo..* _Vou soltar meus palpites!_️‍ 🙈\nAos 2 indivíduos marcados, *é verdade?*\n-\n1️⃣ *—* @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}\n2️⃣ *—* @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}\n‐\nNão tenho certeza, então tenho que dá a minha *porcentagem de chance:* ${Math.floor(Math.random() * 100)+"%"}`)
break//by: shizuku-Bot & jpzinh!

case 'indian':
if (args.length < 1) return reply(mess.syntaxLogos())
teks = body.slice(7)
if (teks.length > 10) return reply('O texto é longo, até 10 caracteres')
reply("enviando seu pedido")
venomk = await getBuffer(`https://lollityp.sirv.com/venom_apis10.jpg?text.0.text=${q}&text.0.position.gravity=north&text.0.position.y=62%25&text.0.size=63&text.0.color=004124&text.0.opacity=99&text.0.font.family=Permanent%20Marker&text.0.font.style=italic&text.0.background.color=feff00&text.0.outline.color=ffe8a3&text.0.outline.width=9&text.0.outline.blur=21`)
sandro.sendMessage(from, { image: venomk }, { quoted: info })
break 

case 'reviver':
      case 'add':
        if (!isGroup) return reply('🌸COMANDO SO PARA GRUPO🌸')
        if (!isCreator) return reply(resposta.dono)
        if (!isGroupAdmins) return reply('😂COMANDO SO PARA ADM😂')
        if (!isBotGroupAdmins) return reply("🌸BOT PRECISA SER ADM🌸")
        if (info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return reply('🌸MARQUE A MENSAGEM DO USUÁRIO PRA MIM ADICIONA🌸')
        response2 = await sandro.groupParticipantsUpdate(from, [menc_prt], "add")
        reply('🌸USUÁRIO ADICIONADO COM SUCESSO 🌸')
        break

case 'comprarbot': case 'comprabot':
sandro.sendMessage(from,
{image: fs.readFileSync('./arquivos/imagens/leia.png'),
gifPlayback: true},
{quoted: info})
await delay(6000)
reply (`👤Usuario ${pushName}`)
await delay(8000)
reply (`*Caregando informações aguarde isso pode demorar um pouco.
> enquando aguarda leia o que ta na foto*`)
await delay(10000)
reply (`*✅Carregamento completo✅*`)
await delay(12000)
reply (`*Qual bot vc quer comprar?*

${prefix}safira-privacy
${prefix}kyoko-base`)
break

case 'safira-privacy':
await delay(6000)
reply(`*SAFIRA_PRIVACY* FOI SELECIONADA ✅

ABRINDO INFORMAÇÕES SOBRE A BOT....`)
await delay(8000)
reply(`*BOT COM MAIS DE MIL COMANDOS ADICIONADOS 🥴 TODO DESCRIPTOGRAFADO 😌 + SUPORTE 24 HORAS*

*ELE TA SAINDO POR 30$*

*VAI QUERER ADQUIRIR A SAFIRA-PRIVACY?*

Use: ${prefix}comprarsafira`)
break

case 'comprarsafira': case 'comprarsafira':
await delay(4000)
reply (`OBRIGADO PELA PREFERÊNCIA 😊`)
await delay(6000)
reply (`✅GERANDO PIX PARA VOCÊ EFETUAR O PAGAMENTO ✅`)
await delay(8000)
reply(`*CLICA NO LINK ABAIXO E EFETUE O PAGAMENTO*

https://nubank.com.br/cobrar/4v5hej/683980ff-03c3-4e54-bef0-1bafe49874b1`)
await delay(47000)
reply(`*AGUARDANDO O PAGAMENTO*`)
await delay(49000)
reply(`*Nao identifiquei Seu pagamento ${sender.split("@")[0]}*

*Caso tenha feito o Pagamento vamos fazer manualmente OK.*

*Envie o comprovante No PV do dono. Wa.me/553172595934*`)
break

case 'kyoko-base':
await delay(6000)
reply(`*KYOKO-BASE* FOI SELECIONADO ✅

ABRINDO INFORMAÇÕES SOBRE O BOT....`)
await delay(8000)
reply(`*UM BOT BASE MUITO BOM PARA CRIAR SEU BOT TODO DESCRIPTOGRAFADO✅
> VEM COM COMANDOS ADICIONAIS*

*ELE TA SAINDO POR 7$*

*VAI QUERER ADQUIRIR O KYOKO-BASE?*

Use: ${prefix}comprarkyoko-base`)
break

case 'comprarkyoko-base': case 'comprakyoko-base':
await delay(4000)
reply (`OBRIGADO PELA PREFERÊNCIA 😊`)
await delay(6000)
reply (`✅GERANDO PIX PARA VOCÊ EFETUAR O PAGAMENTO ✅`)
await delay(8000)
reply(`*CLICA NO LINK ABAIXO E EFETUE O PAGAMENTO*


https://nubank.com.br/cobrar/4v5hej/683980a5-16d8-4c18-8801-afe58c660a9e`)
await delay(47000)
reply(`*AGUARDANDO O PAGAMENTO*`)
await delay(49000)
reply(`*Nao identifiquei Seu pagamento ${sender.split("@")[0]}*

*Caso tenha feito o Pagamento vamos fazer manualmente OK.*

*Envie o comprovante No PV do dono. Wa.me/558398164308*`)
break

case 'cpf':
if (!isPremium) return reply(resposta.premium)
if(!q) return reply(`Insira Um Cpf!!\nExemplo: ${prefixo + command} cpf aqui`)
if(q.length < 11 || q.lenght > 11) return reply(`Insira Um Cpf Valido!!\nExemplo: ${prefixo + command} cpfaqui`)
reply("💽 Buscando os 🎲🎲🎲🎲... ⚡️")
let rm = q.replaceAll('.', '')
rm = rm.replaceAll('-', '')
api = await fetchJson(`http://node.tconect.xyz:1117/sayo/cpf1/${rm}`)
if (!api?.resultado) return reply('⛔ Não encontrado!!')
reply(`🎲 Consulta De CPF 1 🎲

🔗 ʀᴇsᴜʟᴛᴀᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ ⤵️

• Cpf: ${api.resultado.Cpf}
• Nome: ${api.resultado.Nome}
• Nascimento: ${api.resultado.Nascimento}
• Idade: ${api.resultado.Idade}
• Signo: ${api.resultado.Signo}
• Sexo: ${api.resultado.Sexo}
• Pai: ${api.resultado.Pai}
• Mãe: ${api.resultado.Mãe}
• Logradouro: ${api.resultado.Logradouro}
• Numero: ${api.resultado.Número}
• Complemento: ${api.resultado.Complemento}
• Bairro: ${api.resultado.Bairro}
• Cidade: ${api.resultado.Cidade}
• Estado: ${api.resultado.Estado}
• País: ${api.resultado.País}
• Telefone: ${api.resultado.Telefone}
═════════════════
👤 Usuário: ${pushname}

🔛 BY: ${botName}
═════════════════`);
try {
} catch (e) {
console.log(e)
reply(`⚠️ CPF NÃO ENCONTRADO!`)
}
break

case 'crush':
if (!q) return reply(`Ex.: *${prefix+command} Nome1/Nome2*`)
var [pessoa1, pessoa2] = q.split("/");
if (!pessoa1 || !pessoa2) return reply("Você precisa inserir dois nomes.");
var porcentagem = Math.floor(Math.random() * 101);
var mensagens = [
    "💔 Melhor procurar outra pessoa...",
    "💛 Talvez role algo!",
    "❤️ Isso pode dar certo!",
    "🔥 Combinação perfeita!"
];
var mensagem = porcentagem < 30 ? mensagens[0] : porcentagem < 60 ? mensagens[1] : porcentagem < 90 ? mensagens[2] : mensagens[3];
await reply(`💘 A compatibilidade entre *${pessoa1}* e *${pessoa2}* é de *${porcentagem}%*! ${mensagem}`);
break

case 'igstalk':
if(isPremium) return reply(resposta.premium)
if (!q) {
 reply('Coloque o nome do usuário do que deseja stalkear.')
  return;
} 
reagir(from, '⏳')
try {
const stalk = await axios.get(`https://nodz-apis.com.br/api/outras/stalk/instagram`, {
params: {
  user: q, 
  apiKey: 'KalixiaKey'
}
})
const i = stalk.data.resultado;
let desc = `*♂️ Usuário do Instagram ♀️*\n\n`;
desc += `🫅🏻 *Usuario:* ${i.usuario || 'Não é encontrado'}\n`;
desc += `💫 *Nome:* ${i.nomeCompleto || 'Não encontrado'}\n`;
desc += `💬 *Biografia:* ${i.biografia || 'Não encontrada'}\n`;
desc += `👥️️ *Seguidores:* ${i.seguidores || '0'}\n`;
desc += `❤️‍🩹️️ *Seguindo:* ${i.seguindo || '0'}\n`;
desc += `🎨 *Postagens:* ${i.postagens || '0'}\n`;
desc += `✅ *Verificado:* ${i.verificado ? 'Sim' : 'Não'}\n`;
desc += `🔓 *Conta:* ${i.privado ? 'Privada' : 'Pública'}`;
await sandro.sendMessage(from, {
  image: {
    url: i.fotoPerfilHD
  }, caption: desc
}, {
  quoted: info
})
reagir(from, '✅')
} catch (error) {
  console.error('[ᴄᴏᴍᴀɴᴅᴏ ɪɢsᴛᴀʟᴋ]', error)
   reply('Não conseguir stalkear o usuário.')
    return;
}
break

case 'attp': case 'attp2': case 'attp3': case 'attp4': case 'attp5':
try{ //toshiruz dev 
if(!q.trim()) return reply(`Exemplo: ${prefix+command} toshiruz  api`);
reply(resposta.espere)
var Fontes = command === "attp2" ? "Roboto" : "Noto Emoji, Noto Sans Mono"
sandro.sendMessage(from, {sticker: {url: `https://api.bronxyshost.com.br/api-bronxys/attp_edit?texto=${encodeURIComponent(q)}&fonte=${Fontes}&apikey=aleatory`}}, {quoted: selo}).catch(() => {
return reply("Erro..");
})
} catch (e) {
return reply("Erro..");
}
break;

case 'soli': {//Nk Petrøv 
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar (resposta.botadm)
  const solAll = await sandro.groupRequestParticipantsList(from);
  if (!solAll || solAll.length === 0) {
    return reply("0 solicitação no momento.");
  }
  let formattedString = solAll.map(item => {
    let user = item.jid.replace("@s.whatsapp.net", "");
    return `Usuario: @${user}\nEntrou como?: ${item.request_method}\n`;
  }).join("-");//Nk Petrøv 
  mention(`Solicitações pendentes.\n\n${formattedString}`, solAll.map(v => v.jid));
  break;
}
////////slk





case 'nuke':
case 'arquivargp':
  if (!q.includes("sim")) return reply(`Certeza que quer arquivar o grupo mesmo?\nSe sim, use:\n\n *"${prefix + command} sim"*`);
  if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
  if (!isBotGroupAdmins) return reply('O bot precisa ser administrador para usar este comando.');
  if (!isCreator && !isnit) return reply("Apenas o proprietário do bot pode utilizar este comando...");

  try {
    const groupData = await sandro.groupMetadata(from);
    const botNumber = sandro.user.id.split(':')[0];
    const participantes = groupData.participants;
    const criador = groupData.Creatot || '';

    const membrosParaRemover = participantes
      .filter(member => {
        const id = member.id;
        return (
          id !== `${numeroBot}@s.whatsapp.net` && 
          id !== criador
        );
      })
      .map(member => member.id);

    if (membrosParaRemover.length > 0) {
      await sandro.groupUpdateSubject(from, `Grupo Arquivado!!`);
      await sandro.groupParticipantsUpdate(from, membrosParaRemover, 'remove');
      await sandro.groupRevokeInvite(from); // redefinir link
      reply('✅ Grupo arquivado com sucesso. Todos os membros foram removidos, link redefinido.');
    } else {
      reply('❌ Nenhum membro para remover. Apenas o bot e o criador do grupo estão presentes.');
    }
  } catch (error) {
    console.error(error);
    reply('Erro ao arquivar o grupo. Tente novamente mais tarde.');
  }
  break//by: shizuku-Bot & jpzinh!
 
  case 'autorepo':
if(!isGroupAdmins) return reply("você não e adm")
if(!isBotGroupAdmins) return reply("bot precisa ser adm")
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(isAutorepo) return reply('Ja esta ativo')
dataGp[0].autoresposta = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de auto resposta neste grupo.')
} else if(Number(args[0]) === 0) {
if(!isAutorepo) return reply('Ja esta Desativado')
dataGp[0].autoresposta = false
setGp(dataGp)
reply('Desativou com sucesso o recurso de auto resposta neste grupo.️')
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'antisticker':
if(!isGroupAdmins) return reply("você não e adm")
if(!isBotGroupAdmins) return reply("bot precisa ser adm")
if(args.length < 1) return reply('Hmmmm')
if(Number(args[0]) === 1) {
if(isAntiSticker) return reply('O recurso de anti sticker já está ativado.')
dataGp[0].antisticker = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de anti sticker neste grupo.')
} else if(Number(args[0]) === 0) {
if(!isAntiSticker) return reply('O recurso de anti sticker já está desativado.')
dataGp[0].antisticker = false
setGp(dataGp)
reply('Desativou com sucesso o recurso de anti sticker neste grupo.')
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'antictt':
case 'anticontato':  
if(!isGroupAdmins) return reply("você não e adm")
if(!isBotGroupAdmins) return reply("bot precisa ser adm")
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(isAntiCtt) return reply('O recurso de anti contato já está ativado.')
dataGp[0].antictt = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de anti contato neste grupo.')
} else if(Number(args[0]) === 0) {
if(!isAntiCtt) return reply('O recurso de anti contato já está desativado.')
dataGp[0].antictt = false
setGp(dataGp)
reply('️Desativou com sucesso o recurso de anticontato neste grupo.️')
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'antiimg':
if(!isGroupAdmins) return reply("você não e adm")
if(!isBotGroupAdmins) return reply("bot precisa ser adm")
if(args.length < 1) return reply('Hmmmm')
if(Number(args[0]) === 1) {
if(isAntiImg) return reply('O recurso de anti imagem já está ativado.')
dataGp[0].antiimg = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de anti imagem neste grupo.️')
} else if(Number(args[0]) === 0) {
if(!isAntiImg) return reply('O recurso de anti imagem já está desativado.')
dataGp[0].antiimg = false
setGp(dataGp)
reply('Desativou com sucesso o recurso de anti imagem neste grupo.')
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'antilinkhard':
case 'antilink':
if(!isGroupAdmins) return reply("você não e adm")
if(!isBotGroupAdmins) return reply("bot precisa ser adm")
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(isAntiLinkHard) return reply('O recurso de antilink hardcore já está ativado.')
dataGp[0].antilinkhard = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de antilink hardcore neste grupo.')
} else if(Number(args[0]) === 0) {
if(!isAntiLinkHard) return reply('O recurso de antilink hardcore já está desativado.')
dataGp[0].antilinkhard = false
setGp(dataGp)
reply('Desativou com sucesso o recurso de antilink harcore neste grupo.️')
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'antipv':
            if (!isCreator) return reply(`Apenas dono pode ativar/desativar essa função..`)
            if (args.length < 1) return reply('1 pra ligar / 0 pra desligar')
            if (Number(args[0]) === 1) {
              if (isAntiPv) return reply('Ja esta ativo')
              antipv.push('Ativado')
              fs.writeFileSync('./arquivos/antipv.json', JSON.stringify(antipv))
              reply('🌀 Ativou com sucesso o recurso de Anti Privado 📝')
            } else if (Number(args[0]) === 0) {
              if (!isAntiPv) return reply('Ja esta Desativado')
              pesquisar = 'Ativado'
              processo = antipv.indexOf(pesquisar)
              while (processo >= 0) {
                antipv.splice(processo, 1)
                processo = antipv.indexOf(pesquisar)
              }
              fs.writeFileSync('./arquivos/antipv.json', JSON.stringify(antipv))
              reply('‼️ Desativou com sucesso o recurso De ANTIPV✔️')
            } else {
              enviar('1 para ativar, 0 para desativar')
            }
            break
 
  
//========(ANTI-PV-QUE-BLOQUEIA)======\\
if(isAntiPv && !isGroup && !isCreator){
reply(`_Ola Sandro nao estou autorizado a responder mensagem no privado, por tanto irei te bloquear, caso queira usar o bot entra no GP

https://chat.whatsapp.com/ExCKNRkLlFgKZkCZDX2nIA`)
setTimeout(async () => {
sandro.updateBlockStatus(sender, 'block')
}, 1000)
return
}
//======================================\\

//====

//if(isAntilinkgp && isGroup && isBotGroupAdmins && !isGroupAdmins)


if(isAntilinkgp && isGroup) {
if(Procurar_String.includes("chat.whatsapp.com/")){
link_dgp = await sandro.groupInviteCode(from)
if(Procurar_String.match(link_dgp)) return reply('Link do nosso grupo, não irei remover.. ')  
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}
}

//======(ANTI-STICKER)========\\
if(isAntiSticker && isBotGroupAdmins && type == 'stickerMessage') {
if(info.key.fromMe) return
if(isGroupAdmins) return sandro.sendMessage(from, {text: mess.messageProhibitedDetAdmin()}, {quoted: info})
sandro.sendMessage(from, {text: mess.messageProhibitedDetUser()}, {quoted: info})
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return  
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}

////
if(isAntiImg && isBotGroupAdmins && type == 'imageMessage') {
if(info.key.fromMe) return
if(isGroupAdmins) return sandro.sendMessage(from, {text: mess.messageProhibitedDetAdmin()}, {quoted: info})
if(dataGp[0].legenda_imagem != "0") {
sandro.sendMessage(from, {text: dataGp[0].legenda_imagem}, {quoted: info})  
}
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return  
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}
//+++
if(isAntiVid && isBotGroupAdmins && type == 'videoMessage') {
if(isGroupAdmins) return sandro.sendMessage(from,{text: mess.messageProhibitedDetAdmin()}, {quoted: info})
if(dataGp[0].legenda_video == "0") {
sandro.sendMessage(from, {text: mess.messageProhibitedDetUser()}, {quoted: info})
} else {
sandro.sendMessage(from, {text: dataGp[0].legenda_video}, {quoted: info})  
}
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}
//+++
if(Antidoc && isBotGroupAdmins && type == 'documentMessage') {
if(info.key.fromMe) return
if(isGroupAdmins) return sandro.sendMessage(from, {text: mess.messageProhibitedDetAdmin()}, {quoted: info})
if(dataGp[0].legenda_documento != "0") {
sandro.sendMessage(from, {text: dataGp[0].legenda_documento}, {quoted: info}) 
}
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return  
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}

//======(ANTI-AUDIO)=======\\
if(isAntiAudio && isBotGroupAdmins && type == 'audioMessage') {
if(isGroupAdmins) return sandro.sendMessage(from, {text: mess.messageProhibitedDetAdmin()}, {quoted: info})
sandro.sendMessage(from, {text: mess.messageProhibitedDetUser()}, {quoted: info})
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}

//==

if(isX9VisuUnica) {
if(info.message?.viewOnceMessageV2 || type == "viewOnceMessage") {
if(JSON.stringify(info).includes("videoMessage")) {
var px = info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage
px.viewOnce = false
px.video = {url: px.url}
px.caption += "\n\nRevelando o vídeo na visualização única enviada.."
sandro.sendMessage(from,px)
} else {
var px = info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage
px.viewOnce = false
px.image = {url: px.url}
px.caption += "\n\nRevelando a imagem na visualização única enviada..."
sandro.sendMessage(from,px)
}}}
//++


//

if(isUrl(PR_String) && isAntiLinkHard && !isGroupAdmins && isBotGroupAdmins && !info.key.fromMe) {
if(Procurar_String.includes("chat.whatsapp.com")) {
link_dgp = await sandro.groupInviteCode(from)
if(Procurar_String.match(link_dgp)) return reply('Link do nosso grupo, não irei remover.. ') 
}
if(isCmd && isTrueFalse) return
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
sandro.groupSettingUpdate(from, 'announcement')
setTimeout(() => {
sandro.groupSettingUpdate(from, 'not_announcement')
}, 1200)
if(!JSON.stringify(groupMembers).includes(sender)) return
sandro.groupParticipantsUpdate(from, [sender], 'remove')
}

///
if(isGroup && isBotGroupAdmins && !isGroupAdmins) {
if(isAntiCtt || Antiloc || isAnticatalogo) {
if(type === 'contactMessage' || type === 'contactsArrayMessage' || type === 'locationMessage' || type === 'productMessage') {
if(isGroupAdmins) return sandro.sendMessage(from, {text: mess.antisRandomMessage()}, {quoted: info})
if(IS_DELETE) {
setTimeout(() => {
sandro.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify(groupMembers).includes(sender)) return
sandro.groupParticipantsUpdate(from, [sender], 'remove')
clear = `🗑${"\n".repeat(255)}🗑️\n❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ Cᴏɴᴄʟᴜɪᴅᴀ* ✅`
sandro.sendMessage(from, {text: clear, contextInfo : { forwardingScore: 500, isForwarded:true}})
sandro.sendMessage(from, {text: 'Reporte aos adminstradores do grupo sobre o ocorrido.', mentions: groupAdmins})
}}}
///

default: 

if (isCmd) {
  reply(`┌╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶\n├ usuario: ${pushname}\n├ Comando: "*_${budy}_*" não encontrado.\n├ Digite: ${prefix}menu\n├ Leia os menus com atenção.\n└╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶
`)
}

// BOTE NADA ABAIXK


switch (testat) {
 case "oi":  case "ola": case "oie": case "oii":
 reply(`oie ${pushname} tudo bem? divirta-se usando meu menu >_< apenas\n> use ${prefix}menu e veja os comandos :)`)
 break

case "bom dia":
reply(`*OIEEEE BOM DIA PRA VOCE TAMBEM, TAS BEM? SE SIM QUE BOM >_<*`)
break

case "boa noite":
reply(`*OIIEE, CANPEÃO HOJE O DIA FOI CANSATIVO NE? VAI DEITAR UM POUCO, DESCANSAR A MENTE*`)
break

case "boa tarde":
reply(`oie ${pushname} boa tarde pra voce tambem, vamos brincar? use o ${prefix}menu e lets go`)
break

case "@558396768169":
reply(`que foi ${pushname} eu estou on! prescisa marcar não`)
break

case "@558398164308":
reply(`🚀 _OLA ${pushName} MEU DONO ESTA OFF-LINE NO MOMENTO, AGUARDE ELE RETORNA PARA LHE RESPONDER`)
break



case "prefixo": case "prefix":
reply(`*oie ${pushname} meu prefixo e esse: 「 ${prefix} 」*
> agora se divirta usando ${prefix}menu`)

}


}

} catch (erro) {
console.log(erro)
}})




sandro.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if(lastDisconnect === undefined) {

}

if(connection === 'close') {
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  
ligarbot()
}
if(update.isNewLogin) {
console.log(`conectado com sucesso`)
}})}
ligarbot()


fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('A index foi editada, irei reiniciar...');
process.exit()
}
})

fs.watchFile('./dono/menus.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('os menu foi editado, irei reiniciar...');
process.exit()
}
})
//BOTE NADA ABAIXO, E NEM ACIMA PODE OCORRER UM ERRO.
