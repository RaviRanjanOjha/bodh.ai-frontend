const API_BASE_URL = "https://bodh-ai.onrender.com";
//const API_BASE_URL = "http://localhost:8000";
 
export const chat = async (message, sessionId = null) => {
  console.log("🔵 Frontend API call:", {
    message: message.substring(0, 50) + "...",
    sessionId,
  });
 
  const payload = {
    message,
    session_id: sessionId || "", // Ensure we always send session_id even if null
  };
 
  console.log("🔵 Sending payload:", payload);
 
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
 
  console.log("🔵 Response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 API Error:", errorData);
    throw new Error(errorData.detail || "Network response was not ok");
  }
 
  const result = await response.json();
  console.log("🔵 API Response:", result);
  return result;
};
 
export const getConversationHistory = async () => {
  console.log("🟦 Fetching conversation history...");
  const response = await fetch(`${API_BASE_URL}/chat/history`, {
    credentials: "include",
  });
 
  console.log("🟦 History response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 History fetch error:", errorData);
    throw new Error(errorData.detail || "Failed to fetch conversation history");
  }
 
  const data = await response.json();
  console.log(
    "🟦 Conversation history received:",
    data.length,
    "conversations"
  );
  console.log("🟦 First conversation:", data[0]);
  return data;
};
export const getConversationDetails = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/chat/history/${sessionId}`, {
    credentials: "include",
  });
 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch conversation details");
  }
  return response.json();
};
 
export const getClients = async () => {
  const response = await fetch(`${API_BASE_URL}/clients`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};
 
export const getClientDetails = async (clientId) => {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};
 
export const getMarketData = async () => {
  const response = await fetch(`${API_BASE_URL}/market`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};
 
export const uploadDocuments = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
 
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload documents");
  }
  return response.json();
};
 
export const search_convo = async (query, limit) => {
  const response = await fetch(`${API_BASE_URL}/chat/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit, // Ensure we always send session_id even if null
    }),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Network response was not ok");
  }
  return response.json();
};
 
export const queryDocuments = async (query, max_results = 3) => {
  const response = await fetch(`${API_BASE_URL}/documents/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, max_results }),
    credentials: "include",
  });
 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Document query failed");
  }
  return response.json();
};
 
export const deleteConversation = async (sessionId) => {
  console.log("🗑️ Deleting conversation:", sessionId);
 
  const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
 
  console.log("🗑️ Delete response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 Delete Error:", errorData);
    throw new Error(errorData.detail || "Failed to delete conversation");
  }
 
  const result = await response.json();
  console.log("🗑️ Delete successful:", result);
  return result;
};
 
export const querySimulatedDb = async (prompt) => {
  const response = await fetch(`${API_BASE_URL}/clients/simulated-db`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
    credentials: "include",
  });
 
  if (!response.ok) {
    throw new Error("Failed to fetch simulated data");
  }
 
  return response.json();
};
 
export const getSuggestions = async (sessionId) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/followup-questions/${sessionId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("failed to fetch the suggestions");
  return response.json();
};
 
// Favorite conversation functions
export const toggleFavoriteConversation = async (sessionId) => {
  console.log("⭐ Toggling favorite for conversation:", sessionId);
 
  const response = await fetch(`${API_BASE_URL}/chat/favorite/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
 
  console.log("⭐ Toggle favorite response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 Toggle Favorite Error:", errorData);
    throw new Error(errorData.detail || "Failed to toggle favorite");
  }
 
  const result = await response.json();
  console.log("⭐ Toggle favorite successful:", result);
  return result;
};
 
export const getFavoriteConversations = async () => {
  console.log("⭐ Fetching favorite conversations...");
 
  const response = await fetch(`${API_BASE_URL}/chat/favorites`, {
    credentials: "include",
  });
 
  console.log("⭐ Favorites response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 Favorites fetch error:", errorData);
    throw new Error(
      errorData.detail || "Failed to fetch favorite conversations"
    );
  }
 
  const data = await response.json();
  console.log(
    "⭐ Favorite conversations received:",
    data.length,
    "conversations"
  );
  return data;
};
 
export const reorderFavorites = async (newOrder) => {
  console.log("⭐ Reordering favorites:", newOrder);
 
  const response = await fetch(`${API_BASE_URL}/chat/favorites/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ new_order: newOrder }),
    credentials: "include",
  });
 
  console.log("⭐ Reorder favorites response status:", response.status);
 
  if (!response.ok) {
    const errorData = await response.json();
    console.error("🔴 Reorder Favorites Error:", errorData);
    throw new Error(errorData.detail || "Failed to reorder favorites");
  }
 
  const result = await response.json();
  console.log("⭐ Reorder favorites successful:", result);
  return result;
};
 
export const getFAQs=async() => {
  try{
    const response = await fetch(`${API_BASE_URL}/faq`);
    const data=await response.json();
    console.log("Fetched faqs: ", data.faqs);
    return data.faqs;
  } catch(error){
    console.error("Failed to fetch FAQs:", error)
    throw error;
  }
};