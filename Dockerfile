FROM node:latest
ARG endpoint_arg='http://localhost:8200'
ARG token_arg='a.token'
ENV endpoint $endpoint_arg
ENV token $token_arg
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install 
EXPOSE 4000
CMD ["node", "app.js"]