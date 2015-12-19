var unirest = require('unirest');

var BASE_URL = "https://api.telegram.org/bot<token>/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";

var max_offset

function poll(offset) {

    var url = POLLING_URL.replace(":offset:", offset);

    unirest.get(url)
        .end(function(response) {
            var body = response.raw_body;
            if (response.status == 200) {
                var jsonData = JSON.parse(body);
                var result = jsonData.result;

                if (result.length > 0) {
                    var is_valid_command;

                    for (var i = result.length - 1; i >= 0; i--) {

                        var message = result[i].message
                        if (message.text !== undefined) {

                        message.text = message.text.replace(/@Alfredinho_bot/g, "")

                        console.log(message.text)

                            var have_slash = (message.text.indexOf("/") === 0)

                            if (have_slash) {
                                is_valid_command = runCommand(message);
                            }

                            if (!is_valid_command) {
                                detectar_frase(message)
                            }
                        }
                    };

                    max_offset = parseInt(result[result.length - 1].update_id) + 1; // update max offset

                }
                console.log("pool done at " + max_offset)
                poll(max_offset);
            }
        });
};

var frases = {
        "o o o oo" : "cadê o isqueiroooo",
        "quem não tem colírio" : "uuusa óóculos escuroo",
        "e daí qualé que é" : "HAHA FOGO NA BOMBA!",
        "fuma fuma fuma folha de bananeira" : "fuma na boooaaa sóó de brincadeiraa",
        "que horas?" : "4:20 blaze it",
        "para bizarro" : "Bizarro, por favor, você sabe que você está sendo inconveniente, só para.",
        "todos nós amamos você alfred" : "Eu também amo vocês galera.",
        "obrigado alfred" : "Obrigado você seu lindo.",
        "bom dia alfred" : "Bom dia mestre.",
        "10/10" : "gr8 m8 i r8 8/8",
        "lei do duende" : "o Marco acende",
        "lei do vovo" : "tossiu passou",
        "memes" : "tipos de carinhas são",
        "the game" : "perdi",
        "kick the baby" : "don't kick the baby",
        "your name is davi" : "My name is Davi and I ride my teeny tiny little bee-cee-clee-ta to school.",
        "quem é o alfred?" : "Olá, meu nome é Alfred, Sou um robô criado por Marco Worms, digite /falas para saber quais frases eu respondo. Caso você queira contribuir no meu desenvolvimento entre aqui https://github.com/MarcoWorms/Alfred/blob/master/robo.js"
}

var COMMANDS = {
    "rolar_dado" : command_rolar_dado,
    "falas" : command_falas,
    "abrir_pack_hearthstone" : command_abrir_pack_hearthstone,
    "random_schwarzenegger" : command_random_schwarzenegger,
    "random_memes_background" : command_random_memes_background
};

function detectar_frase(message) {

    var dict_key = message.text.toLowerCase()

    if (frases[dict_key]) {
        enviar_mensagem(message, frases[dict_key])
    }

    checar_dono(message)
}

function checar_dono(message) {

    var dono = message.from.id;

    if (dono == 131702731) {
        var random_1_to_10 = rng(1, 20);
        if (random_1_to_10 === 1) {
            enviar_mensagem(message, "Cala a boca bizarro PELO AMOR DE DEUS.")
        }
    } else if (dono == 164614428) {
        var random_1_to_10 = rng(1, 20);
        if (random_1_to_10 === 1) {
            enviar_mensagem(message, "ALAHUUU AHKBAAAAAA")
        }
    }
}

function rng(from, to) {
    return Math.floor((Math.random() * to) + from)
}

function runCommand(message) {
    var msgtext = message.text;

    if (msgtext.indexOf("/") != 0) return false;

    var command = msgtext.split("/")[1]
    var arg = command.split(" ")[1]
    var raw_command = command.split(" ")[0]

    console.log("Command: " + command)
    console.log("Args: " + arg)
    if (COMMANDS[raw_command] == null) return false;
    COMMANDS[raw_command](message, arg);
    return true;
}

function command_rolar_dado(message, numero) {
    if (numero > 1) {
        var random_1_to_number = rng(1, numero);
        enviar_mensagem(message, message.from.first_name + ", Você tirou " + random_1_to_number.toString() + " de " + numero)
    } else if (numero == 1) {
        enviar_mensagem(message, "1 " + message.from.first_name + "? Ta de zoeira?")
    } else {
        var random_1_to_number = rng(1, 6);
        enviar_mensagem(message, message.from.first_name + ", Você tirou " + random_1_to_number.toString() + " de " + 6)
    }
}

function command_falas(message, numero) {

    var output = ''
    for (var property in frases) {
      output += "-" + property + '\n';
    }

    //output = output.replace(/;/g, "\n\n")
    //output = output.replace(/:/g, " -->")

    enviar_mensagem(message, output)
}

function command_abrir_pack_hearthstone(message, arg) {

    var card_chances = {
        "Common"        : 70000,
        "Rare"          : 21400,
        "Epic"          : 4280,
        "Legendary"     : 1080,
        "Gold Common"   : 1470,
        "Gold Rare"     : 1370,
        "Gold Epic"     : 308,
        "Gold Legendary": 111
    }

    var card_indexes = {
        "Common"        : 0,
        "Rare"          : 1,
        "Epic"          : 2,
        "Legendary"     : 3,
        "Gold Common"   : 4,
        "Gold Rare"     : 5,
        "Gold Epic"     : 6,
        "Gold Legendary": 7
    }

    for (card_type in card_chances) {
        var card_chance = card_chances[card_type]
        if (card_chance == 70000) {
            continue;
        }

        var previous_card_index = card_indexes[card_type] - 1

        for (previous_card_type in card_indexes) {
            var card_index = card_indexes[previous_card_type]
            if (card_index === previous_card_index) {
                var previous_card_chance = card_chances[previous_card_type]
                continue;
            }
        }

        card_chances[card_type] = card_chances[card_type] + previous_card_chance
    }

    //card_chances 0 ~ 100019

    var output = ""

    for (var i = 4; i >= 0; i--) {
        output = output + rng_carta(card_chances) + "\n"
    };

    enviar_mensagem(message, output)
}



function rng_carta(card_chances) {

    var rng_carta = rng(0, 100019)

    for (card_type in card_chances) {
        var card_chance = card_chances[card_type]
        if (rng_carta < card_chance) {
            return card_type
        }
    }

}

var sch_frases = ["I'll be back","Get to the chopper!","You are one ugly motherfucker","Hasta la vista, baby","Fuck you, asshole","Get your ass to mars","I need your clothes, your boots and your motorcycle","Milk are for babies, when you get older you drink beer","Between your faith and my Glock nine millimeter, I'll take the Glock", "Snakes?! DID YOU SAY SNAKES?!","You're not sending me to the Cooler!","Come with me if you want to live.","When I said you should screw yourself. I didn't mean it literally.","I'm the party pooper.","Killian! Here's your Subzero! Now....plain zero!","Surprise, I'm your new cellmate. And I've come to make your life a living hell. Prepare for a bitter harvest. Winter... has come at last.","I'm going to throw up all over you.", "Leave anything for us? Just bodies.", "Can you hurry up. My horse is getting tired.", "Oh, cookies! I can't wait to toss them.","If you yield only to a conqueror, then prepared to be conquered.","A freeze is coming!"]

function command_random_schwarzenegger(message, arg){
    enviar_mensagem(message, sch_frases[rng(0, sch_frases.length - 1)])
}


var random_memes_bg_url = ["http://i.imgflip.com/1bij.jpg", "http://i.imgflip.com/9ehk.jpg", "http://i.imgflip.com/1bh8.jpg", "http://i.imgflip.com/26am.jpg", "http://i.imgflip.com/1bgw.jpg", "http://i.imgflip.com/39t1o.jpg", "http://i.imgflip.com/7g1q.jpg", "http://i.imgflip.com/1bhm.jpg", "http://i.imgflip.com/1bhf.jpg", "http://i.imgflip.com/9sw43.jpg", "http://i.imgflip.com/1bh3.jpg", "http://i.imgflip.com/1bim.jpg", "http://i.imgflip.com/c2qn.jpg", "http://i.imgflip.com/1bip.jpg", "http://i.imgflip.com/265k.jpg", "http://i.imgflip.com/1bhk.jpg", "http://i.imgflip.com/8p0a.jpg", "http://i.imgflip.com/4t0m5.jpg", "http://i.imgflip.com/wczz.jpg", "http://i.imgflip.com/m78d.jpg", "http://i.imgflip.com/25w3.jpg", "http://i.imgflip.com/1bh9.jpg", "http://i.imgflip.com/5mcpl.jpg", "http://i.imgflip.com/59qi.jpg", "http://i.imgflip.com/8h0c8.jpg", "http://i.imgflip.com/grr.jpg", "http://i.imgflip.com/5kdc.jpg", "http://i.imgflip.com/51s5.jpg", "http://i.imgflip.com/odluv.jpg", "http://i.imgflip.com/3pnmg.jpg", "http://i.imgflip.com/1bgs.jpg", "http://i.imgflip.com/23ls.jpg", "http://i.imgflip.com/1bik.jpg", "http://i.imgflip.com/9iz9.jpg", "http://i.imgflip.com/25wb.jpg", "http://i.imgflip.com/265j.jpg", "http://i.imgflip.com/9hhr.jpg", "http://i.imgflip.com/1bhw.jpg", "http://i.imgflip.com/2cp1.jpg", "http://i.imgflip.com/2nuc.jpg", "http://i.imgflip.com/jrj7.jpg", "http://i.imgflip.com/7dusq.jpg", "http://i.imgflip.com/269s.jpg", "http://i.imgflip.com/26hb.jpg", "http://i.imgflip.com/26br.jpg", "http://i.imgflip.com/86vlk.jpg", "http://i.imgflip.com/26hg.jpg", "http://i.imgflip.com/46rh.jpg", "http://i.imgflip.com/1bin.jpg", "http://i.imgflip.com/12dxv.jpg", "http://i.imgflip.com/fecg.jpg", "http://i.imgflip.com/gft6.jpg", "http://i.imgflip.com/1bil.jpg", "http://i.imgflip.com/cv1y0.jpg", "http://i.imgflip.com/9gbzb.jpg", "http://i.imgflip.com/3oyi.jpg", "http://i.imgflip.com/25w8.jpg", "http://i.imgflip.com/tau4.jpg", "http://i.imgflip.com/efmn.jpg", "http://i.imgflip.com/1bgy.jpg", "http://i.imgflip.com/7zq97.jpg", "http://i.imgflip.com/4vy0.jpg", "http://i.imgflip.com/8csq.jpg", "http://i.imgflip.com/8lxz.jpg", "http://i.imgflip.com/bfexh.jpg", "http://i.imgflip.com/6vq22.jpg", "http://i.imgflip.com/6bt40.jpg", "http://i.imgflip.com/1bio.jpg", "http://i.imgflip.com/tas1.jpg", "http://i.imgflip.com/3vzej.jpg", "http://i.imgflip.com/8rwb.jpg", "http://i.imgflip.com/qep4.jpg", "http://i.imgflip.com/3i7p.jpg", "http://i.imgflip.com/dnn.jpg", "http://i.imgflip.com/7yk6.jpg", "http://i.imgflip.com/af002.jpg", "http://i.imgflip.com/26ae.jpg", "http://i.imgflip.com/8u2b.jpg", "http://i.imgflip.com/34y5.jpg", "http://i.imgflip.com/5p31.jpg", "http://i.imgflip.com/em3r.jpg", "http://i.imgflip.com/25w4.jpg", "http://i.imgflip.com/7n5z.jpg", "http://i.imgflip.com/3si4.jpg", "http://i.imgflip.com/582gv.jpg", "http://i.imgflip.com/ljk.jpg", "http://i.imgflip.com/b2ln.jpg", "http://i.imgflip.com/e8gx0.jpg", "http://i.imgflip.com/pry7.jpg", "http://i.imgflip.com/2b5p.jpg", "http://i.imgflip.com/duwl.jpg", "http://i.imgflip.com/4mcml.jpg", "http://i.imgflip.com/bfq76.jpg", "http://i.imgflip.com/a9wyh.jpg", "http://i.imgflip.com/6kcv.jpg", "http://i.imgflip.com/9vct.jpg", "http://i.imgflip.com/qeqb.jpg", "http://i.imgflip.com/1bhu.jpg", "http://i.imgflip.com/15hg.jpg", "http://i.imgflip.com/b2jt6.jpg"]

function command_random_memes_background(message, arg){
    enviar_mensagem(message, random_memes_bg_url[rng(0, random_memes_bg_url.length - 1)])
}


function enviar_mensagem(message, text) {
    var answer = {
        chat_id : message.chat.id,
        text : text
    };

    unirest.post(SEND_MESSAGE_URL)
        .send(answer)
        .end(function (response) {
            if (response.status == 200) console.log("Successfully sent message to " + message.chat.id);
        });
}

poll(922829674);
