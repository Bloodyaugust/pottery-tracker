export function convertToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = (event) => {
      if (event.target) {
        if (event.target.error) {
          reject(event.target.error);
          return;
        }

        resolve(reader.result);
      } else {
        reject('Something real bad happened');
      }
    };

    reader.readAsDataURL(file);
  });
}
