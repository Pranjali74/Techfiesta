const STORAGE_KEY = 'finance-user-data';

export async function loadUserData() {
  try {
    const stored = await window.storage.get(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored.value);
    }
    return null;
  } catch (error) {
    console.log('No previous data found:', error);
    return null;
  }
}

export async function saveUserData(data) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}
