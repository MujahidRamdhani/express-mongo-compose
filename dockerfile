# Gunakan Node.js versi yang sesuai
FROM node:16

# Set working directory di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies (hanya saat build)
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Ekspose port yang digunakan aplikasi
EXPOSE 3001

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
