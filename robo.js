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
        "quem é o alfred?" : "Olá, meu nome é Alfred, Sou um robô criado por Marco Worms, digite /falas para saber quais frases eu respondo. Caso você queira contribuir no meu desenvolvimento entre aqui https://github.com/MarcoWorms/Alfred/blob/master/robo.js"
}

var COMMANDS = {
    "rolar_dado" : command_rolar_dado,
    "falas" : command_falas,
    "abrir_pack_hearthstone" : command_abrir_pack_hearthstone,
    "random_schwarzenegger" : command_random_schwarzenegger
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
      output += property + '\n\n';
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
