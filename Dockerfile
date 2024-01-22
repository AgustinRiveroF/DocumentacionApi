FROM node:lts-alpine
ENV NODE_ENV=production
ENV MONGO_URI=mongodb+srv://agusfanzo:basededatos@cluster0.hofsaip.mongodb.net/ecommerce?retryWrites=true&w=majority
ENV PORT=8080
ENV ENVIROMENT=development
ENV #ENVIROMENT=production
ENV SECRET_KEY_JWT=12312ñs2scqrq
ENV GOOGLE_CLIENT_SECRET=1231sfacwq
ENV GOOGLE_CLIENT_ID=123weqwe
ENV ADMIN_EMAIL=adminCoder@coder.com
ENV ADMIN_PASSWORD=adminCod3r123
ENV NODEMAILER_USER=agusfanzo@gmail.com
ENV NODEMAILER_PASSWORD=gjxmfvyzjqzlaybz
ENV TWILIO_ACCOUNT_SID=AC42c6d9dc7eebd082f74d5ac79eb020b7
ENV TWILIO_AUTH=c5631d4768d15954c85cd99951f0fbdd
ENV TWILIO_PHONE_NUMBER=+13238591613
ENV TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
