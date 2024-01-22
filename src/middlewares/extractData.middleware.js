export const extractFormData = (req, res, next) => {
    let data = '';
  
    req.on('data', chunk => {
      data += chunk;
    });
  
    req.on('end', () => {
      req.body = JSON.parse(data);
      next();
    });
  };