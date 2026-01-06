// lib/fileStore.ts
import { openDB } from "idb";

const DB_NAME = "evermoment-files";
const STORE_NAME = "files";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveFiles(key: string, files: File[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");

  for (const file of files) {
    await tx.store.put(file, `${key}:${file.name}`);
  }

  await tx.done;
}

export async function getFiles(key: string): Promise<File[]> {
  const db = await getDB();
  const files: File[] = [];

  const tx = db.transaction(STORE_NAME, "readonly");
  for await (const cursor of tx.store) {
    if (cursor.key.toString().startsWith(`${key}:`)) {
      files.push(cursor.value as File);
    }
  }

  return files;
}

export async function clearFiles(key: string) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");

  for await (const cursor of tx.store) {
    if (cursor.key.toString().startsWith(`${key}:`)) {
      await tx.store.delete(cursor.key);
    }
  }

  await tx.done;
}
