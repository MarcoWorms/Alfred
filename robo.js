var unirest = require('unirest');

var BASE_URL = "https://api.telegram.org/bot156638006:AAFAMRlhz-rg-HAvIz12KnGG_34gcZNgdfs/";
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

                        console.log(message.text)
                        if (message.text !== undefined) {

                            var have_slash = (message.text.indexOf("/") === 0)

                            if (have_slash) {
                                is_valid_command = runCommand(message);
                            }

                            if (!is_valid_command) {
                                var dono = message.from.id;
                                detectar_frase(message)
                                checar_envio_para(message, dono)
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

function checar_envio_para(message, dono) {
    if (dono == 131702731) {
        xingar_bizarro(message)
    } else if (dono == 164614428) {
        xingar_rodrigo(message)
    }
}

function detectar_frase(message) {

    frases = {
        "o o o oo" : "cadê o isqueiroooo",
        "quem não tem colírio" : "uuusa óóculos escuroo",
        "para bizarro" : "Bizarro, por favor, você sabe que você está sendo inconveniente, só para.",
        "todos nós amamos você alfred" : "Eu também amo vocês galera."
    }

    var dict_key = message.text.toLowerCase()

    if (frases[dict_key]) {
        enviar_mensagem(message, frases[dict_key])
    }
}

var COMMANDS = {
    "rolar_dado" : rolar_dado
};

function rng(from, to) {
    return Math.floor((Math.random() * to) + from)
}

function rolar_dado(message, numero) {
    if (numero > 1) {
        var random_1_to_number = rng(1, numero);
        enviar_mensagem(message, message.from.first_name + ", Você tirou " + random_1_to_number.toString() + " de " + numero)
    } else if (numero == 1) {
        enviar_mensagem(message, "1 " + message.from.first_name + "? Ta de zoeira?")
    } else {
        enviar_mensagem(message,  message.from.first_name + ", você esqueceu do número.")
    }
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

function xingar_bizarro(message) {
    //var caps = message.text.toUpperCase();
    var random_1_to_10 = Math.floor((Math.random() * 10) + 1);
    if (random_1_to_10 === 1) {
        enviar_mensagem(message, "Cala a boca bizarro PELO AMOR DE DEUS.")
    }

}

function xingar_rodrigo(message) {
    //var caps = message.text.toUpperCase();
    var random_1_to_10 = Math.floor((Math.random() * 10) + 1);
    if (random_1_to_10 === 1) {
        enviar_mensagem(message, "ALAHUUU AHKBAAAAAA")
    }
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