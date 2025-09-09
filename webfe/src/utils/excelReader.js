export const readExcelAsJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
          header: 1,
          raw: false,
        });

        const headers = json[0];
        const filteredJson = json
          .slice(1)
          .map((row) =>
            row.reduce((acc, cell, index) => {
              if (headers[index]) {
                acc[headers[index]] = cell;
              }
              return acc;
            }, {})
          )
          .filter((row) => Object.values(row).some((cell) => cell !== null));

        resolve(filteredJson);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};
