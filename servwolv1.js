const net = require('net');
const fs = require('fs');
const { Console } = require('console');
const { Socket } = require('dgram');
const cheminFichier = 'data.json';


const updatelobby = require('./wolcmd');
const updatetopic = require('./wolcmd');
const { channel } = require('diagnostics_channel');
// Utiliser la fonction importée


let saveparam = "";
const PORT_1 = 4005;
const PORT_2 = 4010;
const PORT_3 = 4005;
const PORT_4 = 4006;
const PORT_5 = 4807;
const PORT_6 = 4000;
const PORT_7 = 7001;
const HOST = '192.168.1.25';
let savemsg = "";
var buddy = [""];
// var listuser = [""];

const clients = {};  // Objet pour stocker les connexions des clients
const users = {};  // Objet pour stocker les informations des utilisateurs
const buffers = {};  // Objet pour stocker les buffers des clients
// Fonction pour charger et récupérer la valeur d'un utilisateur
function chargerUtilisateur(nomUtilisateur, callback) {
    // Lecture du fichier JSON
    fs.readFile(cheminFichier, 'utf8', (err, data) => {
      if (err) {
        return callback(err);
      }
  
      try {
        // Analyse du contenu JSON
        const contenuJSON = JSON.parse(data);
        
        // Récupération de la valeur associée au nom de l'utilisateur spécifié
        const valeurUtilisateur = contenuJSON.utilisateurs[nomUtilisateur];
        if (!valeurUtilisateur) {
          return callback(new Error(`Utilisateur "${nomUtilisateur}" non trouvé`));
        }
        
        callback(null, valeurUtilisateur);
      } catch (erreur) {
        callback(erreur);
      }
    });
  }

  function loadchannel(channel, callback) {
    // Lecture du fichier JSON
    fs.readFile(cheminFichier, 'utf8', (err, data) => {
      if (err) {
        return callback(err);
      }
  
      try {
        // Analyse du contenu JSON
        const contenuJSON = JSON.parse(data);
        
        // Récupération de la valeur associée au nom de l'utilisateur spécifié
        const valeurchannel = contenuJSON.channel[channel];
        if (!valeurchannel) {
          return callback(new Error(`channel "${channel}" non trouvé`));
        }
        
        callback(null, valeurchannel);
      } catch (erreur) {
        callback(erreur);
      }
    });
  }

function createServer(port) {
  const server = net.createServer((socket) => {
    console.log(`Client connected to port ${port}`);

    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
    clients[clientId] = socket;
    buffers[clientId] = '';

    const quitCommandRegex = /\bQUIT\b/;


    socket.on('data', (data) => {
        buffers[clientId] += data.toString(); // Accumuler les données dans le buffer

        let newlineIndex;
        while ((newlineIndex = buffers[clientId].indexOf('\r\n')) > -1) {
          const receivedData = buffers[clientId].slice(0, newlineIndex).trim();
          buffers[clientId] = buffers[clientId].slice(newlineIndex + 2);
  
          console.log(`Received from ${clientId} on port ${port}:`, receivedData);
  
          const parts = receivedData.split(' '); // Diviser le message en parties
      const portco = `${port}`;
      const QUIT = receivedData.match(quitCommandRegex);

      if (portco == 4005 && QUIT) {
        socket.write(': 602 u :Update record non-existant\r\n');
        socket.write(': 602 u :Update record non-existant\r\n');
        socket.write(': 610 u 1\r\n');
        socket.write(": 605 u :" + HOST + " 4005 '0:Live ra2' -8 36.1083 -115.0582\r\n");
        socket.write(": 605 u :" + HOST + " 4000 'Live chat server' -8 36.1083 -115.0582\r\n");
        socket.write(": 608 u :" + HOST + " 4807 'Gameres server' -8 36.1083 -115.0582\r\n");
        socket.write(": 609 u :" + HOST + " 4005 'Ladder server' -8 36.1083 -115.0582\r\n");
        socket.write(': 607 u :goodbye');
        console.log('Au revoir !');
        socket.write(': 602 u :Update record non-existant\r\n');
        socket.write(': 602 u :Update record non-existant\r\n');
        socket.write(': 610 u 1\r\n');
        socket.write(": 605 u :" + HOST + " 4005 '0:Live ra2' -8 36.1083 -115.0582\r\n");
        socket.write(": 605 u :" + HOST + " 4000 'Live chat server' -8 36.1083 -115.0582\r\n");
        socket.write(": 608 u :" + HOST + " 4807 'Gameres server' -8 36.1083 -115.0582\r\n");
        socket.write(": 609 u :" + HOST + " 4005 'Ladder server' -8 36.1083 -115.0582\r\n");
        socket.write(': 607 u :goodbye');
        
        setTimeout(() => {
            socket.end();
          }, 1000);
      }

      const commands = receivedData.split("\n");
      commands.forEach((command) => {
          processCommand(command.trim());
      })

      function processCommand(command) {
        const parts = command.split(" ");
        // Vérifie la commande et effectue le traitement approprié
        if (parts[0] === "CVERS") {
            const port = parts[1];
            const userId = parts[2];
            console.log(`Commande CVERS : Port ${port}, Utilisateur ${userId}`);
        } else if (parts[0] === "apgar") {
            const password = parts[1]; // Mb111111
            console.log(`Commande APGAR : Mot de passe ${password}`);
            if (password === "atGGGG" || password === "atGGGGGI") {
                console.log("pass ok");
            } else { 
                console.log("pass nok");
                socket.write("ERROR :closing link:(Password needed for that nickname.)");
                socket.end();
            }
        } else if (parts[0] === "NICK") {
            var username = parts[1];
            user = parts[1];
            users[clientId] = { username };
            console.log("utilisateur trouvé :" + user);
            console.log(`Commande NICK : Nom d'utilisateur ${username}`);
            if (username === "test22200" || username === "senji") {
                console.log("login ok");

            } else { 
                console.log("login nok");
                socket.write("ERROR :closing link:(Password needed for that nickname.)");
                socket.end();
            }

            
        } 

        else if (parts[0] === "SETOPT") {
            socket.write("PING :942582\r\n");
            socket.write(": 375 u :- Hello :)\r\n");
            socket.write(": 376 u :End of /MOTD command\r\n");
            socket.write(": 379 u :none none none 1 32515 NONREQ\r\n");
            }
        
        else if (parts[0] === "GETLOCALE") {
            const getuser = parts[1];
            console.log(`Commande GETLOCALE : Nom d'utilisateur ${getuser}`);
            if (getuser === "senji" || getuser === "test22200" || getuser === "0")  {
                console.log("GETLOCALE ok");
                broadcastMessage(": 309" + " " + getuser + " " + getuser + "`2\r\n");
    //   " + getuser + "" + getuser + "
            }

            else if (parts[0] === "SETCODEPAGE") {
                broadcastMessage(": 329 " + getuser + " 1252\r\n");
            }

        } else if (parts[0] === "SQUADINFO") {
            socket.write(": 439\r\n");
                console.log("Demande de squad pour");
                // envoi egalement de la list
                const channeldef = "#Lob_33_0";
                loadchannel(channeldef, (erreur, channelshow) => {
                    if (erreur) {
                      console.error('Erreur lors de la lecture du fichier JSON :', erreur);
                      return;
                    }
                    console.log('Utilisateurs :', channelshow.users);
                    // channel LOB 33
                    socket.write(": 321 " + user + " #Lob_33_0 :test \r\n");
                    socket.write(": 327 " + user + " #Lob_33_0 0 1 388:\r\n");
                    socket.write(": 323 " + user + " :End of /LIST\r\n");
                    // utilisateurs de LOB 33
                    socket.write(": 353 " + user + " #Lob_33_0 :"+ channelshow.users + ",0,0\r\n");
                    socket.write(": 366 u " + channeldef + " :End of /NAMES list\r\n");
                });
            }
        
        
        else if (parts[0] === "LIST") {
            var list = parts[1];
            var list2 = parts[2];
            if (list == "0" && list2 == "33") {
                console.log("Demande de list");
                const channeldef = "#Lob_33_0";
                loadchannel(channeldef, (erreur, channelshow) => {
                    if (erreur) {
                      console.error('Erreur lors de la lecture du fichier JSON :', erreur);
                      return;
                    }
                    console.log('Utilisateurs :', channelshow.users);
                    // channel LOB 33
                    socket.write(": 321 " + user + " #Lob_33_0 :test \r\n");
                    socket.write(": 327 " + user + " #Lob_33_0 0 2436:\r\n");
                    socket.write(": 323 " + user + " :End of /LIST\r\n");
                    // utilisateurs de LOB 33
                    socket.write(": 353 " + user + " #Lob_33_0 :" + channelshow.users + "\r\n");
                    socket.write(": 366 u " + channeldef + " :End of /NAMES list\r\n");
                  });
                }
                

            
            else if (list == "33" && list2 == "33") {
                console.log("demande de parties");
                // socket.write(": 321 u:\r\n");
                // socket.write(": 326 " + user + " #test22200's_game 0 0 33 0 1 336657890 0::g12N39,1878366581,1,0,0,MP02T2.MAP\r\n");
                // socket.write(": 323 " + user + " :End of /LIST\r\n");
                socket.write(": 321 u:\r\n");
                // Fonction pour lire le fichier JSON
                function readJsonFileSync(cheminFichier, encoding = 'utf8') {
                  const file = fs.readFileSync(cheminFichier, encoding);
                  return JSON.parse(file);
                }
                // Fonction pour trouver et retourner les valeurs de `NAME`, `IP`, et `MAP` dans les éléments se terminant par "game"
                function getAllGameDetails(obj) {
                  let details = [];
                  for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                      // Vérifier si la clé se termine par "game"
                      if (key.endsWith('game') && obj[key].NAME && obj[key].IP && obj[key].MAP && obj[key].PARAM) {
                        details.push({
                          NAME: obj[key].NAME,
                          IP: obj[key].IP,
                          MAP: obj[key].MAP,
                          PARAM: obj[key].PARAM
                        });
                      }
                    }
                  }
                
                  return details;
                }
                // Lire le fichier JSON
                const data = readJsonFileSync(cheminFichier);
                
                // Trouver les détails de `NAME`, `IP`, et `MAP` dans les éléments se terminant par "game"
                const gameDetails = getAllGameDetails(data.channel);
                
                if (gameDetails.length > 0) {
                  console.log('Game details:');
                  gameDetails.forEach(detail => {
                    console.log(`NAME: ${detail.NAME}`);
                    console.log(`IP: ${detail.IP}`);
                    console.log(`MAP: ${detail.MAP}`);
                    console.log(`PARAM: ${detail.PARAM}`);
                    console.log('---');

                    const NAMEGAME = detail.NAME;
                    const IPGAME = detail.IP;
                    const MAPGAME = detail.MAP;
                    const PARAMGAME = detail.PARAM;

                    
                    socket.write(": 326 " + user + " " + NAMEGAME + " " + PARAMGAME + " " + IPGAME + " " + MAPGAME + "\r\n");
                    // console.log(user + " " + NAMEGAME + " " + PARAMGAME + " " + IPGAME + " " + MAPGAME);
                    // socket.write(": 326 " + user + " #test22200's_game 0 0 33 0 1 336657890 0::g12N39,1878366581,1,0,0,MP02T2.MAP\r\n");
                    
                  });
                } else {
                  console.log('No game details found.');
                }

                socket.write(": 323 " + user + " :End of /LIST\r\n");







            }
        } else if (parts[0] === "JOIN") {
            const channel = parts[1];
            const list2 = parts[2];
            updatelobby(user);

                // update du lobby
fs.readFile(cheminFichier, 'utf8', (err, data) => {
    if (err) {
      console.error('Une erreur est survenue lors de la lecture du fichier JSON', err);
      return;
    }
  
    try {
      // Convertir les données JSON en un objet JavaScript
      const jsonData = JSON.parse(data);
  
      // Vérifier si la section "channel" et le channel spécifique existent
      if (!jsonData.channel) {
        jsonData.channel = {};
      }
      if (!jsonData.channel['#Lob_33_0']) {
        jsonData.channel['#Lob_33_0'] = {};
      }
  
      // Vérifier si l'élément "users" existe dans le channel spécifique
      if (!jsonData.channel['#Lob_33_0'].users) {
        jsonData.channel['#Lob_33_0'].users = "";
      }
  
      // Ajouter le nouvel utilisateur à la liste existante
      const currentUsers = jsonData.channel['#Lob_33_0'].users.split(' ').filter(user => user.trim() !== '');
      const adduser = user;
      currentUsers.push(adduser);
      console.log("Ut : " +adduser );
  
      // Mettre à jour l'élément "users" avec la nouvelle liste
      jsonData.channel['#Lob_33_0'].users = currentUsers.join(' ');
  
      // Convertir l'objet JavaScript modifié en une chaîne JSON
      const jsonString = JSON.stringify(jsonData, null, 2);
  
      // Écrire la chaîne JSON dans le fichier
      fs.writeFile(cheminFichier, jsonString, (err) => {
        if (err) {
          console.error('Une erreur est survenue lors de l\'écriture du fichier JSON', err);
        } else {
          console.log('Fichier JSON mis à jour avec succès');
        }
      });
    } catch (parseErr) {
      console.error('Une erreur est survenue lors de l\'analyse du fichier JSON', parseErr);
    }
  });


      socket.write(":" + user + "!RAL2@192.168.1.25 JOIN :0,3232235801 " + channel + "\r\n");
      // socket.write(": 353 " + user + " #Lob_33_0 :@" + user + ",0,0\r\n");

      // for (let i = 0; i < listuser.length; i++) {
      //     console.log(listuser[i]);
      //     socket.write(": 353 " + user + " #Lob_33_0 :"+ listuser[i] + ",0,0\r\n");
      // }
    //   socket.write(": 353 " + user + " #Lob_33_0 :test\r\n");
      socket.write(": 366 u " + channel + " :End of /NAMES list\r\n");
      //   socket.write(":test22200!u@h JOIN :1,0 #Lob_33_0\r\n");

        }

        else if (parts[0] === "PART") {
            const quitchannel = parts[1];
                broadcastMessage(":" + user + "!RAL2@192.168.1.25 PART " + quitchannel + "\r\n");

                // rajouter une fonction qui cherche depuis json
                const userToRemove = user;
                fs.readFile(cheminFichier, 'utf8', (err, data) => {
                    if (err) {
                      console.error('Une erreur est survenue lors de la lecture du fichier JSON', err);
                      return;
                    }
                  
                    try {
                      // Convertir les données JSON en un objet JavaScript
                      const jsonData = JSON.parse(data);
                  
                      // Vérifier si la section "channel" et le channel spécifique existent
                      if (jsonData.channel && jsonData.channel['#Lob_33_0'] && jsonData.channel['#Lob_33_0'].users) {
                        // Obtenir la liste des utilisateurs existants
                        const currentUsers = jsonData.channel['#Lob_33_0'].users.split(' ').filter(user => user.trim() !== '');
                  
                        // Supprimer l'utilisateur spécifié de la liste
                        const updatedUsers = currentUsers.filter(user => user !== userToRemove);
                  
                        // Mettre à jour l'élément "users" avec la nouvelle liste
                        jsonData.channel['#Lob_33_0'].users = updatedUsers.join(' ');
                  
                        // Convertir l'objet JavaScript modifié en une chaîne JSON
                        const jsonString = JSON.stringify(jsonData, null, 2);
                  
                        // Écrire la chaîne JSON dans le fichier
                        fs.writeFile(cheminFichier, jsonString, (err) => {
                          if (err) {
                            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON', err);
                          } else {
                            console.log('Fichier JSON mis à jour avec succès');
                          }
                        });
                      } else {
                        console.log('La section "channel" ou le channel spécifique n\'existe pas ou ne contient pas d\'utilisateurs');
                      }
                    } catch (parseErr) {
                      console.error('Une erreur est survenue lors de l\'analyse du fichier JSON', parseErr);
                    }
                  });

                    
        }

        else if (parts[0] === "LISTSEARCH") {
            const listsearch = parts[1];
            console.log("Demande de score");
            socket.write("8 senji 20 4 1 0 1\r\n");
            socket.write("NOTFOUND\r\n");  

        }

        else if (parts[0] === "PING") {
                  socket.write("pong\r\n"); 
      }
        
        else if (parts[0] === "GETCODEPAGE") {
            const GETNAME = parts[1];
            console.log(GETNAME);
            if (parts[0] === "GETCODEPAGE" && parts[1] === "test22200" || parts[1] === "senji" ) {
                broadcastMessage(": 328 " + GETNAME + " senji`1252\r\n");
                console.log(": 328 u " + GETNAME + " senji`1252\r\n");
        }

        if (parts[0] === "GETCODEPAGE" && parts[1] === "senji") {
            broadcastMessage(": 328 u " + GETNAME + " test22200`1252\r\n");
    }
                // socket.write(": 328 u 0`0\r\n");
            
        }

        else if (parts[0] === "GETBUDDY") {
                // socket.write(": 333 " + user + " " + buddy + "\r\n");
                // console.log(buddy);

                chargerUtilisateur(user, (erreur, datauser) => {
                    if (erreur) {
                      console.error('Erreur lors de la lecture du fichier JSON :', erreur);
                      return;
                    }
                    console.log('Valeur de buddy ' + user + ' :', datauser.buddy);
                    socket.write(": 333 " + user + " " + datauser.buddy + "\r\n");
                  });
            
        }


        else if (parts[0] === "STARTG") {
            console.log("lancement de la partie");
                const currentUnixTime = Math.floor(Date.now() / 1000);
                console.log(currentUnixTime);

          broadcastMessage(":test22200!RAL2@192.168.1.25 STARTG test22200 :senji 192.168.1.21 test22200 192.168.1.25 :200" + " " + currentUnixTime + " \r\n");
        console.log(":test22200!RAL2@192.168.1.25 STARTG test22200 :senji 192.168.1.25 test22200 192.168.1.25 :1 " + currentUnixTime + "\r\n");


        
        }

      

        else if (parts[0] === "JOINGAME" && parts[3] !== undefined && parts[3].trim() !== "") {
           console.log("demande de creation partie");
           socket.write(": PAGE " + user + " :you are now tempOP for this channel\r\n")
            broadcastMessage(":" + user + "!RAL2@192.168.1.25 JOINGAME 1 5 33 3 0 3232235801 0 :#" + user + "'s_game\r\n");
           socket.write(": 332 u #" + user + "'s_game :g12N39,1878366581,0,0,0,MP02T2.MAP\r\n");
            socket.write(": 353 u * #" + user + "'s_game :@" + user + ",0 3232235801\r\n");
            socket.write(": 366 u #" + user + "'s_game :End of /NAMES list\r\n");

 


const paramadd = parts[2] + " " + parts[3] + " " +  + parts[4] + " " + parts[5] + " " + parts[6];


            // Fonction pour lire le fichier JSON
            function readJsonFileSync(filepath, encoding = 'utf8') {
              const file = fs.readFileSync(filepath, encoding);
              return JSON.parse(file);
            }
            
            // Fonction pour écrire dans le fichier JSON
            function writeJsonFileSync(cheminFichier, data, encoding = 'utf8') {
              const jsonString = JSON.stringify(data, null, 2);
              fs.writeFileSync(cheminFichier, jsonString, encoding);
            }
            
            // Chemin vers le fichier JSON
            
            // Lire le fichier JSON
            const data = readJsonFileSync(cheminFichier);
            
            // Nouveau jeu à ajouter
            const newGame = {
              "IP": "336657550",
              "MAP": "0::g12N39,1878366581,1,0,0,MP02T2.MAP",
              "PARAM": "0 0 33 0 1",
              "NAME": "#" + user + "'s_game",
              "TOPIC": ""
            };
            
            // Ajouter le nouveau jeu sous la clé "#test2's_game"
            data.channel[""+ user + "'s_game"] = newGame;
            
            // Écrire les modifications dans le fichier JSON
            writeJsonFileSync(cheminFichier, data);
            
            console.log('Nouveau jeu ajouté avec succès.');
        }
        else if (parts[0] === "JOINGAME" && (parts[3] === undefined || parts[3].trim() === "")) { 
            const user = users[clientId] ? users[clientId].username : 'unknown';
            const topic = " :g12N39,246518484,1,0,0,MP02T2.MAP";
            const testuser = ":senji,0,1142700218 @test22200,0,1142700218";
            console.log("test entreé");
            
              broadcastMessage(":" + user + "!RAL2@192.168.1.25 JOINGAME 1 5 33 1 0 3232235801 0 " + parts[1] + "\r\n");
                //  socket.write(":test22200!u@h JOINGAME 1 5 33 3 0 :1207029625 0 :" + parts[1] + "\r\n");
              broadcastMessage(": 332 " + user + " " + parts[1] + " " + topic + "\r\n");
              broadcastMessage(": 353 " + user + " * " + parts[1] + " " + testuser + "\r\n");
              broadcastMessage(": 366 " + user + " " + parts[1] + " :End of NAMES list\r\n");

        }


        else if (parts[0] === "GAMEOPT" && parts[2] != ":Z1;senji" && parts[2] != ":Z12senji") {
            const chan = parts[1]; 
            const msg = parts.slice(2).join(' ');  // Recomposer le message à partir de la 3ème partie
            const option = parts.slice(2).join(' ').replace(':', '');  // Recomposer l'option à partir de la 3ème partie et retirer les :
            const user = users[clientId] ? users[clientId].username : 'unknown';
            broadcastMessage(`:${user}!RAL2@192.168.1.25 GAMEOPT ${chan} ${msg}\r\n`);
            console.log(`:${user}!RAL2@192.168.1.25 GAMEOPT ${chan} ${msg}`);
            console.log(user);
        }


  else if (parts[0] === "TOPIC") {
    broadcastMessage(": 332 test22200 " + parts[1] + " " + parts[2] + "\r\n");
  }
  else if (parts[0] === "mode") {
    broadcastMessage(":test22200!RAL2@192.168.1.25 MODE " + parts[1] + " +l " + parts[3] + "\r\n");

  }

else if (parts[0] === "PRIVMSG") {
  const chan = parts[1];
  const msg = parts.slice(2).join(' ');  // Recomposer le message à partir de la 3ème partie
  const user = users[clientId] ? users[clientId].username : 'unknown';
  broadcastMessage(`:${user}!RAL2@192.168.1.25 PRIVMSG ${chan} ${msg}\r\n`);
  console.log(`${user} parle`);
}
        
        else if (parts[0] === "QUIT") {
            if (portco == 4010) {
                console.log("Demande de QUIT");
                socket.end();   
            }
        }
    
    
    }
}






     // setTimeout(() => {
     //   socket.end();
     //    }, 30000);


    });

    socket.on('end', () => {
      console.log(`Client disconnected from port ${port}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error on port ${port}:`, err.message);
    });
  });

  server.listen(port, HOST, () => {
    console.log(`Server running on ${HOST}:${port}`);
  });

  server.on('error', (err) => {
    console.error(`Server error on port ${port}:`, err.message);
  });
}


function broadcastMessage(message) {
    Object.values(clients).forEach(clientSocket => {
      clientSocket.write(message);
    });
  }

// Créer des serveurs pour les deux ports
createServer(PORT_1);
createServer(PORT_2);
createServer(PORT_3);
createServer(PORT_4);
createServer(PORT_5);
createServer(PORT_6);
createServer(PORT_7);
