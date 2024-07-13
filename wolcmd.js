const cheminFichier = 'data.json';
const fs = require('fs');

function updatelobby(user) {
    console.log("pdate du lobby");
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
          currentUsers.push(user);
          console.log("Ut : " +user);
      
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
  }
  

  function updatetopic(user) {
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

        "TOPIC": "test"
      };
      
      // Ajouter le nouveau jeu sous la clé "#test2's_game"
      data.channel[""+ user + "'s_game"] = newGame;
      
      // Écrire les modifications dans le fichier JSON
      writeJsonFileSync(cheminFichier, data);
      
      console.log('Nouveau jeu ajouté avec succès.');
  }
  // Exporter la fonction
  module.exports = updatelobby;
//   module.exports = updatetopic;