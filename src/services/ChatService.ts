export async function SendChatMessageService(fm: FormData) {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/Chat/general-chat', {
      method: 'POST',
      body: fm
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error: unknown) {
    throw new Error("Error General Chat Message Creation: " + error);
  }
}
