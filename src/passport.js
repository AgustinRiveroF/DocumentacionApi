// passport.js
import passport from "passport";
import { ObjectId } from 'mongodb';
import { usersManager } from "./dao/managers/users.dao.js";
import { usersModel } from "./dao/models/users.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { compareData, hashData } from "./utils/utils.js";
import { logger } from "./utils/logger.js";


// LOCAL

passport.use(
  'signup',
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return done(null, false);
      }
      try {
        const existingUser = await usersManager.findByEmail(email);
        if (existingUser) {
          return done(null, false, { message: 'Ya existe un usuario con ese email' });
        }
        const hashedPassword = await hashData(password);
        const createdUser = await usersManager.createOne({
          ...req.body,
          password: hashedPassword,
        });
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      logger.info('1 strategy ')
      if (!email || !password) {
        logger.info('2 strategy ')
        return done(null, false, { message: 'Campos incorrectos' });
      }

      try {
        logger.info('3 strategy ')
        const idAdmin = "123"
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          let role = "admin";
          return done(null, { email, role, idAdmin });
        }

        const user = await usersManager.findByEmail(email);
        if (!user) {
          logger.info('4 strategy ')
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
          logger.info('5 strategy ')
          return done(null, false, { message: 'Contraseña no válida' });
        }
        logger.info('6 strategy ')
        let role = "usuario";
        return done(null, {
          cartID:user.cartId,
          id:user._id,
          last_name: user.last_name,
          email, first_name: user.first_name,
          role });
        //return done(null, user)
      } catch (error) {
        return done(error);
      }
    }
  )
);


// GITHUB

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: "Iv1.fb6f4779cfcdb4fc",
      clientSecret: "94355f8df58f2db65aafc5a583f57400769f118c",
      callbackURL: "http://localhost:8080/api/sessions/callback",
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //logger.info('Paso 1: GitHub strategy called');

        //const userDB = await usersManager.findByEmail(profile.emails[0].value);

        const userDB = await usersManager.findByEmail(profile._json.email);


        if (userDB) {
          if (userDB.isGithub) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        const infoUser = {
          first_name: profile._json.name.split(' ')[0],
          last_name: profile._json.name.split(' ')[1],
          email: profile._json.email,
          password: "ads12c1h%/123DS13*çs",
          isGithub: true,
          cartID: new ObjectId(),
        };

        const createdUser = await usersManager.createOne(infoUser);
        return done(null, createdUser);
      } catch (error) {
        console.error('Error en la estrategia de GitHub:', error);
        return done(error);
      }
    }
  )
);

// PASSPORT GOOGLE






// SERIALIZE && DESERIALIZE

/* passport.serializeUser((user, done) => {
  logger.info('Serialize User:', user);
  const idAdmin = "123"
  done(null, {
    cartID: user.cartID ? user.cartID.toString() : undefined,  La que funciona
    id: user.id || idAdmin,
    email: user.email, 
    first_name: user.first_name, 
    last_name: user.last_name,  
    role: user.role 
  });
}); */


passport.serializeUser((user, done) => {
  logger.warning('Serialize User:', user);
  const idAdmin = "123"
  const serializedUser = {
    id: user.id || idAdmin,
    email: user.email, 
    first_name: user.first_name, 
    last_name: user.last_name,  
    role: user.role 
  };

  if (user.cartID) {
    serializedUser.cartID = user.cartID.toString();
  }

  done(null, serializedUser);
});


passport.deserializeUser(async (serializedUser, done) => {
  //logger.info('Deserialize User:', serializedUser);
  try {
    const foundUser = await usersManager.findByEmail(serializedUser.email);
    const idAdmin = "123";
    if (!foundUser || !foundUser.cartID) {
      return done(null, idAdmin || foundUser.id );
    }

    const cartID = new ObjectId(foundUser.cartID);

    return done(null, {
      cartID,
      id: foundUser.id,
      email: foundUser.email,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      role: foundUser.role
    });
  } catch (error) {
    done(error);
  }
});

