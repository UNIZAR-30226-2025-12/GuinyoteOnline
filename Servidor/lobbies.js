const { v4: uuidv4 } = require('uuid');

const lobbies = [];

function createLobby(maxPlayers, idCreador, tipo, codigoAcceso) {
  const id = uuidv4();
  const lobby = {
    id,
    iniciado: false,
    maxPlayers: (maxPlayers === "1v1") ? 2 : 4,
    idCreador,
    tipo,
    codigoAcceso,
    jugadores: [],
    estado: 'esperando'
  };
  lobbies.push(lobby);
  return lobby;
}

function findLobby(lobbyId) {
  return lobbies.find(
    (lobby) => lobby.id === lobbyId
  );
}

function findLobbyBySocketId(socket) {
  return lobbies.find(
    (lobby) => lobby.estado === 'en curso' && lobby.jugadores.some(jugador => jugador.socket.id === socket.id)
  );
}

function findLobbyByUserName(user) {
  return lobbies.find(
    (lobby) => lobby.estado === 'en curso' && lobby.jugadores.some(jugador => jugador.correo === user)
  );
}

function findAvailableLobby(maxPlayers) {
  return lobbies.find(
    (lobby) => lobby.maxPlayers === maxPlayers && lobby.jugadores.length < maxPlayers && lobby.codigoAcceso === '0'
  );
}

function findAvailableCode(maxPlayers, codigoAcceso) {
  return lobbies.find(
    (lobby) => lobby.maxPlayers === maxPlayers && lobby.jugadores.length < maxPlayers && lobby.codigoAcceso === codigoAcceso
  );
}

function joinLobby(lobbyId, playerId) {
  const lobby = lobbies.find((l) => l.id === lobbyId);
  if (!lobby || lobby.jugadores.length >= lobby.maxPlayers || lobby.jugadores.includes(playerId)) return null;
  lobby.jugadores.push(playerId);
}

function joinPrivateLobby(lobbyId, playerId, codigoAcceso) {
  const lobby = lobbies.find((l) => l.id === lobbyId);
  if (!lobby || lobby.jugadores.length >= lobby.maxPlayers || lobby.codigoAcceso != codigoAcceso || lobby.jugadores.includes(playerId)) return null;
  lobby.jugadores.push(playerId);
}

function autoJoinOrCreate(playerId, maxPlayers) {
  let lobby = findAvailableLobby((maxPlayers === '1v1') ? 2 : 4);
  if (!lobby) {
    lobby = createLobby(maxPlayers, playerId, 'publico', '0');
  }
  console.log(lobby);
  joinLobby(lobby.id, playerId);
  return lobby;
}

module.exports = {
  findLobby,
  findLobbyBySocketId,
  findLobbyByUserName,
  createLobby,
  joinLobby,
  joinPrivateLobby,
  autoJoinOrCreate,
  findAvailableCode,
  lobbies
};
