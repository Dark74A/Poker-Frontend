import { apiClient } from "./client";

export async function listSessions({ page = 0, size = 12, filter = "all", sort = "newest" } = {}) {
  const { data } = await apiClient.get("/sessions", {
    params: { page, size, filter, sort },
  });
  return data;
}

export async function createSession({ name, description }) {
  const { data } = await apiClient.post("/sessions", { name, description });
  return data;
}

export async function joinSessionWithCode(inviteCode) {
  const { data } = await apiClient.post("/sessions/join", { inviteCode });
  return data;
}

export async function getSession(sessionId) {
  const { data } = await apiClient.get(`/sessions/${sessionId}`);
  return data;
}

export async function getSessionAsOf(sessionId, asOf) {
  const { data } = await apiClient.get(`/sessions/${sessionId}`, {
    params: { asOf },
  });
  return data;
}

export async function getSessionEvents(sessionId) {
  const response = await apiClient.get(`/sessions/${sessionId}/history`);
  return response.data;
}

export async function addPlayer(
  sessionId,
  { displayName, linkedUserId = null },
) {
  const { data } = await apiClient.post(`/sessions/${sessionId}/players`, {
    displayName,
    linkedUserId,
  });
  return data;
}

export async function findPlayerCandidates(sessionId, query) {
  const { data } = await apiClient.get(`/sessions/${sessionId}/player-candidates`, {
    params: { query },
  });
  return data;
}

export async function removePlayer(sessionId, playerId) {
  await apiClient.delete(`/sessions/${sessionId}/players/${playerId}`);
}

export async function leaveSession(sessionId) {
  await apiClient.delete(`/sessions/${sessionId}/players/me`);
}

export async function recordBuyIn(sessionId, deltas) {
  const { data } = await apiClient.post(`/sessions/${sessionId}/buyins`, {
    deltas,
  });
  return data;
}

export async function addCashOut(sessionId, { playerId, amount }) {
  const { data } = await apiClient.post(`/sessions/${sessionId}/cashouts`, {
    playerId,
    amount,
  });
  return data;
}

export async function recordHand(sessionId, deltas) {
  const { data } = await apiClient.post(`/sessions/${sessionId}/hands`, {
    deltas,
  });
  return data;
}

export async function closeSession(sessionId) {
  await apiClient.post(`/sessions/${sessionId}/close`);
}

export async function archiveSession(sessionId) {
  await apiClient.post(`/sessions/${sessionId}/archive`);
}

export async function reopenSession(sessionId) {
  await apiClient.post(`/sessions/${sessionId}/reopen`);
}
