export const webEdition=import.meta.env.MODE==='web';
export const appAsset=file=>new URL(file,new URL(import.meta.env.BASE_URL,window.location.href)).href;
export const libraryURL=file=>appAsset('library/'+file.split('/').map(encodeURIComponent).join('/'));
